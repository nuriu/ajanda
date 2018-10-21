import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { EVENT_TYPES, LoggerService, LOG_LEVELS } from '../../services/logger.service';

@Component({
  selector: 'app-sidenav-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  M: moment.Moment;
  daysInMonth: number;
  days: Array<number>;
  maxPresentableDayCount: number; // maximum 6 weeks of days can be displayed.
  printedDaysFromPrevMonth: number;
  printedDaysFromNextMonth: number;
  currentDay: number;

  constructor(private logger: LoggerService) {}

  ngOnInit() {
    this.logger.log('CalendarComponent initialized.', LOG_LEVELS.LIFECYCLE);

    this.M = moment();
    this.daysInMonth = this.M.daysInMonth();
    this.fillDayArray();
    this.checkCurrentDay();
  }

  /**
   * Fills 'days' array with numbers of the days [1, ..., 28, 29, 30, 31 etc.]
   * to present which depends on selection.
   */
  fillDayArray() {
    this.printedDaysFromPrevMonth = 0;
    this.printedDaysFromNextMonth = 0;
    this.days = new Array<number>();

    let printedDaysFromCurrentMonth = 0;

    const lastDayInPrevMonth = moment(this.M)
      .subtract(1, 'M')
      .daysInMonth();
    const firstDayOfMonth = moment(this.M)
      .startOf('M')
      .weekday();

    if (
      (firstDayOfMonth === 6 && this.daysInMonth > 29) ||
      (firstDayOfMonth === 5 && this.daysInMonth > 30)
    ) {
      // we need 6 weeks of space.

      // Example for use-case 1: July 2018 (firstDayOfMonth === 6 && this.daysInMonth > 29)

      // Mon Tue Wed Thu Fri Sat Sun
      // 25  26  27  28  29  30   1       1
      //  2   3   4   5   6   7   8       2
      //  9  10  11  12  13  14  15       3
      // 16  17  18  19  20  21  22       4
      // 23  24  25  26  27  28  29       5
      // 30  31                           6

      // Example for use-case 2: December 2018 (firstDayOfMonth === 5 && this.daysInMonth > 30)

      // Mon Tue Wed Thu Fri Sat Sun
      // 27  28  29  30  31   1   2       1
      //  3   4   5   6   7   8   9       2
      // 10  11  12  13  14  15  16       3
      // 17  18  19  20  21  22  23       4
      // 22  23  24  25  28  29  30       5
      // 31   1   2   3   4   5   6       6

      this.maxPresentableDayCount = 6 * 7;
    } else {
      // 5 weeks of space will be enough.
      this.maxPresentableDayCount = 5 * 7;
    }

    // fill day array according to gathered info of current.
    for (let i = 0; i < this.maxPresentableDayCount; i++) {
      if (i < firstDayOfMonth) {
        this.days[i] = lastDayInPrevMonth - firstDayOfMonth + i + 1;
        this.printedDaysFromPrevMonth++;
      } else if (printedDaysFromCurrentMonth < this.daysInMonth) {
        this.days[i] = ++printedDaysFromCurrentMonth;
      } else {
        this.days[i] = ++this.printedDaysFromNextMonth;
      }
    }
  }

  /**
   * Returns localized name of day with given index.
   * @param i Index of day [0, 6].
   * @param format Returning format for moment.
   */
  getDayName(i: number, format: string = 'ddd'): string {
    return this.M.weekday(i).format(format);
  }

  /**
   * Presents previous month.
   */
  prevMonth() {
    this.logger.log('Switched to previous month.', LOG_LEVELS.EVENT, EVENT_TYPES.MONTH_SWITCH);

    this.M = this.M.startOf('M');
    this.M = this.M.subtract(1, 'M');
    this.daysInMonth = this.M.daysInMonth();
    this.fillDayArray();
    this.checkCurrentDay();
  }

  /**
   * Presents next month.
   */
  nextMonth() {
    this.logger.log('Switched to next month.', LOG_LEVELS.EVENT, EVENT_TYPES.MONTH_SWITCH);

    this.M = this.M.startOf('M');
    this.M = this.M.add(1, 'M');
    this.daysInMonth = this.M.daysInMonth();
    this.fillDayArray();
    this.checkCurrentDay();
  }

  /**
   * Checks if current day is exists in presented month.
   * If it exists in current presented month,
   * we should present it with adding a css class. (date-today)
   */
  checkCurrentDay() {
    this.logger.log('Checking if current day exists in the selected month.');

    if (moment().year() === this.M.year() && moment().month() === this.M.month()) {
      this.logger.log('Current day exists in the selected month.');
      this.M = moment();
      this.currentDay = this.M.date();
    } else {
      this.logger.log('Current day does not exists in the selected month.');
      this.currentDay = -1;
    }
  }
}
