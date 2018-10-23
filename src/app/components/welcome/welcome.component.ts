import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
          this.db.newDatabase(path).then(() => {
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
        // TODO: Show error toast: File doesn't exists.
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
}
