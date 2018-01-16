import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

import { Day, CalendarBlock } from '../../models/models';

const blockCount = 42;

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

  private data: Array<CalendarBlock>;

  private _m: moment.Moment;

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

    const startingWeekDay = this._m.startOf('month').isoWeekday();
    const dayCount = this._m.daysInMonth();

    // fill calendar blocks
    for (let i = 1; i <= blockCount; i++) {
      if (i < startingWeekDay) {
        this.data.push(new CalendarBlock({
          isAvailable: false
        }));
      } else if (i < startingWeekDay + dayCount) {
        this.data.push(new CalendarBlock({
          isAvailable: true,
          Day: new Day({
            Nu: (i === 1) ? 1 : i - (startingWeekDay - 1),
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
