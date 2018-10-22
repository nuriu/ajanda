import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as low from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as moment from 'moment';
import { LOCALES } from '../models/LOCALES';
import { SettingsSchema } from '../models/SettingsSchema';
import { EVENT_TYPES, LoggerService, LOG_LEVELS } from './logger.service';

@Injectable()
export class SettingsService {
  /**
   * lowdb db object.
   */
  private db: low.LowdbAsync<any>;
  /**
   * lowdb adapter.
   */
  private adapter: low.AdapterAsync<any>;
  /**
   * Base schema for database file.
   */
  private schema: SettingsSchema;

  constructor(private translate: TranslateService, private logger: LoggerService) {
    this.schema = new SettingsSchema();
  }

  /**
   * Loads settings database file.
   */
  async loadDatabase() {
    this.logger.log(
      'Loading settings database file from: ajanda.settings',
      LOG_LEVELS.EVENT,
      EVENT_TYPES.OPEN_DB_FILE
    );

    this.adapter = new FileAsync('./ajanda.settings');
    this.db = await low(this.adapter);
    this.db.defaults(JSON.parse(JSON.stringify(this.schema))).write();
  }

  /**
   * Returns list of the recently opened file paths.
   */
  listRecentlyOpenedFiles(): Array<string> {
    this.logger.log('Requested list of recently opened file paths.');
    return this.db.get('recentlyOpenedFiles').value() as Array<string>;
  }

  /**
   * Returns previously saved app locale.
   */
  getPrefferedLocale(): string {
    this.logger.log('Requested preffered app locale info.');
    return this.db.get('locale').value() as string;
  }

  /**
   * Updates preffered app locale.
   * @param locale New locale to set.
   */
  updatePrefferedLocale(locale: string) {
    this.logger.log('Updated app locale to: ' + locale);

    this.db
      .get('locale')
      .assign(locale)
      .write();

    // update runtime locales.
    this.updateRuntimeLocale();
  }

  /**
   * Updates runtime locales.
   */
  updateRuntimeLocale() {
    const prefferedLocale = this.getPrefferedLocale();

    // if locale is supported set it.
    if (LOCALES.indexOf(prefferedLocale) > -1) {
      this.translate.setDefaultLang(prefferedLocale);
      moment.locale(prefferedLocale);

      this.logger.log('App locale set to: ' + prefferedLocale);
      this.logger.log('Moment locale set to: ' + prefferedLocale);
    } else {
      // fallback to en
      this.translate.setDefaultLang('en');
      moment.locale('en');

      this.logger.log('App locale set to: en');
      this.logger.log('Moment locale set to: en');
    }
  }

  /**
   * Add file path to recentlyOpenedFiles array at settings file.
   * @param path File path.
   */
  addRecentlyOpenedFile(path: string) {
    const recentlyOpenedFileCount = this.db
      .get('recentlyOpenedFiles')
      .size()
      .value();

    // if there is already 5 elements in
    // recentlyOpenedFiles array then delete first one.
    if (recentlyOpenedFileCount === 5) {
      this.db
        .get('recentlyOpenedFiles[0]')
        .remove()
        .write();
    }

    // add new record.
    this.db
      .get('recentlyOpenedFiles')
      .push(path)
      .write();
  }
}
