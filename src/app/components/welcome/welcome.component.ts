import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router, private electron: ElectronService, private db: DataService) {}

  ngOnInit() {}

  newDataFile() {
    // TODO: Show save file dialog and get user defined path from it to create database file.
    this.db.newDatabase().then(() => {
      this.router.navigate(['./home']);
    });
  }

  loadDataFile() {
    const path = this.electron.showOpenDBDialog();
    if (path) {
      console.log('DEBUG: Loading database: ', path);

      this.db.loadDatabase(path[0]).then(() => {
        this.router.navigate(['./home']);
      });
    }
  }
}
