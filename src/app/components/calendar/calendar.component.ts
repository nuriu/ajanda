import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

import { Day, CalendarBlock } from '../../models/models';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input()
  y: number;
  @Input()
  m: number;

  private _m: moment.Moment;
  private blockCount: number;
  private data: Array<CalendarBlock>;
  private startingWeekDay: number;
  private dayCount: number;

  constructor() { }

  ngOnInit() {
    this._m = moment();
    this.syncronize();
  }

  nextMonth() {
    this._m = this._m.add({months: 1});
    this.syncronize();
  }

  previousMonth() {
    this._m = this._m.subtract({months: 1});
    this.syncronize();
  }

  private syncronize() {
    // initialize data
    this.data = new Array<CalendarBlock>();
    this.y = this._m.year();
    this.m = this._m.month() + 1;
    this.startingWeekDay = this._m.startOf('month').isoWeekday();
    this.dayCount = this._m.daysInMonth();

    (this.startingWeekDay > 4 && this.dayCount > 29) ? this.blockCount = 42 : this.blockCount = 35;

    // fill calendar blocks
    for (let i = 1; i <= this.blockCount; i++) {
      if (i < this.startingWeekDay) {
        this.data.push(new CalendarBlock({
          isAvailable: false
        }));
      } else if (i < this.startingWeekDay + this.dayCount) {
        this.data.push(new CalendarBlock({
          isAvailable: true,
          Day: new Day({
            Nu: (i === 1) ? 1 : i - (this.startingWeekDay - 1),
            Events: null,
            Tasks: null
          })
        }));
      } else {
        this.data.push(new CalendarBlock({
          isAvailable: false
        }));
      }
    }
  }
}
