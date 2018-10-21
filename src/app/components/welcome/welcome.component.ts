import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../services/data.service';
import { ElectronService } from '../../services/electron.service';
import { EVENT_TYPES, LoggerService, LOG_LEVELS } from '../../services/logger.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  constructor(
    private router: Router,
    private translate: TranslateService,
    private electron: ElectronService,
    private db: DataService,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.logger.log('WelcomeComponent initialized.', LOG_LEVELS.LIFECYCLE);
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
   */
  loadDataFile() {
    this.logger.log('Load data file button at welcome page.', LOG_LEVELS.EVENT, EVENT_TYPES.CLICK);
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
