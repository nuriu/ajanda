import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

import { Day, Month } from '../../models/models';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input()
  data: Month;

  private m: moment.Moment;

  constructor() { }

  ngOnInit() {
    this.data = new Month();
    this.m = moment();
    this.syncronize();
  }

  nextMonth() {
    this.m = this.m.add({months: 1});
    this.syncronize();
  }

  previousMonth() {
    this.m = this.m.subtract({months: 1});
    this.syncronize();
  }

  private syncronize() {
    this.data.Year = this.m.year();
    this.data.Month = this.m.month() + 1;
  }
}
