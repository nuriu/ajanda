import { Component, OnInit } from '@angular/core';
import { Calendar } from '../../models/Calendar';
import { DataService } from '../../services/data.service';
import { EVENT_TYPES, LoggerService, LOG_LEVELS } from '../../services/logger.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  /**
   * Name of the database.
   */
  databaseName: string;
  /**
   * List of calendars.
   */
  calendars: Array<Calendar>;

  constructor(private db: DataService, private logger: LoggerService) {
    this.calendars = new Array<Calendar>();
  }

  ngOnInit() {
    this.logger.log('SidenavComponent initialized.', LOG_LEVELS.LIFECYCLE);

    this.databaseName = this.db.getDatabaseName();
    this.calendars = this.db.listCalendars();
  }

  /**
   * Updates calendar selection info.
   * @param calendar Selected calendar.
   */
  handleCalendarSelection(calendar: Calendar) {
    calendar.selected = !calendar.selected;

    this.db.updateCalendar(calendar);

    this.logger.log(
      'Calendar selection updated: ' + JSON.stringify(calendar),
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );
  }

  /**
   * Handles new calendar addition.
   * @param name Name for calendar to add.
   */
  handleCalendarAddition(name: string) {
    if (name.trim().length > 0) {
      this.db.createCalendar(new Calendar({ name: name }));
    }
  }
}
