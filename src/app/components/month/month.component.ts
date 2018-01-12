import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit {
  @Input()
  databasePath: string;

  constructor(private db: DataService) { }

  ngOnInit() {
    this.databasePath = this.db.getDatabasePath();
  }
}
