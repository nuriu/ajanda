import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { LoggerService, LOG_LEVELS } from '../../services/logger.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  dbName: string;

  constructor(private db: DataService, private logger: LoggerService) {}

  ngOnInit() {
    this.logger.log('SidenavComponent initialized.', LOG_LEVELS.LIFECYCLE);

    this.dbName = this.db.getDatabaseName();
  }
}
