import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './services/electron.service';
import { LoggerService, LOG_LEVELS } from './services/logger.service';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private logger: LoggerService,
    private settings: SettingsService
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

    // load settings database and set locale.
    settings.loadDatabase().then(() => {
      settings.updateRuntimeLocale();
    });
  }
}
