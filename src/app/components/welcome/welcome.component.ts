import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private electron: ElectronService,
    private db: DataService,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.logger.log('WelcomeComponent initialized.', LOG_LEVELS.LIFECYCLE);
  }

  newDataFile() {
    this.logger.log(
      'Create new data file button at welcome page.',
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    // TODO: Show save file dialog and get user defined path from it to create database file.

    this.db.newDatabase().then(() => {
      this.logger.log('Navigating to: ./home');
      this.router.navigate(['./home']);
    });
  }

  loadDataFile() {
    this.logger.log('Load data file button at welcome page.', LOG_LEVELS.EVENT, EVENT_TYPES.CLICK);

    const path = this.electron.showOpenDBDialog();
    if (path) {
      this.db.loadDatabase(path[0]).then(() => {
        this.logger.log('Navigating to: ./home');
        this.router.navigate(['./home']);
      });
    }
  }
}
