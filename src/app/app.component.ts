import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './services/electron.service';
import { LoggerService, LOG_LEVELS } from './services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private logger: LoggerService
  ) {
    this.logger.log(
      'Opened application with config: ' + JSON.stringify(AppConfig),
      LOG_LEVELS.LIFECYCLE
    );

    if (electronService.isElectron()) {
      this.logger.log('Application mode: ELECTRON', LOG_LEVELS.LIFECYCLE);

      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      this.logger.log('Application mode: WEB', LOG_LEVELS.LIFECYCLE);
    }

    // TODO: make locales changeable from settings.
    translate.setDefaultLang('en');
    moment.locale('en');

    // TODO: update log message after settings implementation.
    this.logger.log('locale set to: en');
    this.logger.log('moment locale set to: en');
  }
}
