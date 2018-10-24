import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LOCALES } from '../../models/LOCALES';
import { DataService } from '../../services/data.service';
import { ElectronService } from '../../services/electron.service';
import { EVENT_TYPES, LoggerService, LOG_LEVELS } from '../../services/logger.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  /**
   * List of recently opened file paths.
   */
  recentlyOpenedFiles: Array<string>;
  /**
   * Default locale that readed from settings file.
   */
  defaultLocale: string;
  /**
   * Supported locales by application.
   */
  supportedLocales: Array<string>;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private electron: ElectronService,
    private db: DataService,
    private logger: LoggerService,
    private settings: SettingsService
  ) {}

  ngOnInit() {
    this.logger.log('WelcomeComponent initialized.', LOG_LEVELS.LIFECYCLE);

    // Get recently opened files.
    this.settings.loadDatabase().then(() => {
      this.recentlyOpenedFiles = this.settings.listRecentlyOpenedFiles().reverse();
      this.defaultLocale = this.settings.getPrefferedLocale();
      this.supportedLocales = LOCALES;
    });
  }

  /**
   * Create new database file.
   */
  newDataFile() {
    this.logger.log(
      'Create new data file button at welcome page.',
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    this.translate
      .get(['SAVE_DATA_FILE_DIALOG_TITLE', 'FILE_DIALOG_EXTENSION_TEXT'])
      .subscribe(data => {
        const path = this.electron.showSaveDBDialog(
          data.SAVE_DATA_FILE_DIALOG_TITLE,
          ['ajanda'],
          data.FILE_DIALOG_EXTENSION_TEXT
        );
        if (path) {
          this.db.loadDatabase(path, true).then(() => {
            this.logger.log('Navigating to: ./home');
            this.router.navigate(['./home']);
          });
        }
      });
  }

  /**
   * Load database from file.
   * @param filePath Path of database file.
   */
  loadDataFile(filePath?: string) {
    this.logger.log('Load data file button at welcome page.', LOG_LEVELS.EVENT, EVENT_TYPES.CLICK);

    if (filePath) {
      if (this.electron.isPathExists(filePath)) {
        this.db.loadDatabase(filePath).then(() => {
          this.logger.log('Navigating to: ./home');
          this.router.navigate(['./home']);
        });
      } else {
        this.settings.removeRecentlyOpenedFile(filePath);
      }
    } else {
      this.translate
        .get(['OPEN_DATA_FILE_DIALOG_TITLE', 'FILE_DIALOG_EXTENSION_TEXT'])
        .subscribe(data => {
          const path = this.electron.showOpenDBDialog(
            data.OPEN_DATA_FILE_DIALOG_TITLE,
            ['ajanda'],
            data.FILE_DIALOG_EXTENSION_TEXT
          );
          if (path) {
            this.db.loadDatabase(path[0]).then(() => {
              this.logger.log('Navigating to: ./home');
              this.router.navigate(['./home']);
            });
          }
        });
    }
  }

  /**
   * Handles locale change from language selection.
   * @param event Event object of select value change.
   */
  handleLocaleChange(event: any) {
    console.log(event.target.value);
    this.settings.updatePrefferedLocale(event.target.value);
  }
}
