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
    const recentlyOpenedFiles = this.listRecentlyOpenedFiles();

    // if file already existsin array then first delete it.
    for (let i = 0; i < recentlyOpenedFiles.length; i++) {
      const rof = recentlyOpenedFiles[i];
      if (rof === path) {
        recentlyOpenedFiles.splice(i, 1);
      }
    }

    // if there is already 5 elements in
    // recentlyOpenedFiles array then delete first one.
    if (recentlyOpenedFiles.length === 5) {
      recentlyOpenedFiles.splice(4, 1);
    }

    // push new file to beginning of the list.
    recentlyOpenedFiles.reverse().push(path);

    // save updated records.
    this.db
      .get('recentlyOpenedFiles')
      .assign(recentlyOpenedFiles)
      .write();

    this.logger.log('Added new record to recentlyOpenedFiles: ' + path);
  }

  /**
   * Removes path from recentlyOpenedFiles at settings.
   * @param path File path to remove.
   */
  removeRecentlyOpenedFile(path: string) {
    const records = this.listRecentlyOpenedFiles();

    for (let i = 0; i < records.length; i++) {
      if (records[i] === path || records[i] === path.replace(/\\/g, '\\\\')) {
        records.splice(i, 1);
        this.logger.log('Removed record from recentlyOpenedFiles: ' + path);
      }
    }

    this.db
      .get('recentlyOpenedFiles')
      .assign(records)
      .write();
  }
}
