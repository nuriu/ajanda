import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { LoggerService, LOG_LEVELS } from '../../services/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public constructor(private db: DataService, private logger: LoggerService) {}

  ngOnInit() {
    this.logger.log('HomeComponent initialized.', LOG_LEVELS.LIFECYCLE);
  }
}
