import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Calendar } from '../../models/Calendar';
import { Tag } from '../../models/Tag';
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
  /**
   * List of tags.
   */
  tags: Array<Tag>;

  constructor(private router: Router, private db: DataService, private logger: LoggerService) {
    this.calendars = new Array<Calendar>();
  }

  ngOnInit() {
    this.logger.log('SidenavComponent initialized.', LOG_LEVELS.LIFECYCLE);

    this.databaseName = this.db.getDatabaseName();
    this.calendars = this.db.getObjectList<Calendar>('calendars');
    this.tags = this.db.getObjectList<Tag>('tags');
  }

  /**
   * Updates calendar selection info.
   * @param calendar Selected calendar.
   */
  handleCalendarSelection(calendar: Calendar) {
    calendar.selected = !calendar.selected;

    this.db.updateObject<Calendar>('calendars', calendar);

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
      this.db.createObject<Calendar>('calendars', new Calendar({ name: name }));
    }
  }

  /**
   * Handles calendar deletion event.
   * @param calendar Which calendar to be deleted.
   */
  handleCalendarDeletion(calendar: Calendar) {
    this.logger.log(
      'Clicked to delete calendar: ' + JSON.stringify(calendar),
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    this.db.deleteCalendar(calendar.id, true);
  }

  /**
   * Handles tag deletion event.
   * @param tag Which tag to be deleted.
   */
  handleTagDeletion(tag: Tag) {
    this.logger.log(
      'Clicked to delete tag: ' + JSON.stringify(tag),
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    this.db.deleteTag(tag.id);
  }

  /**
   * Updates tag selection info.
   * @param tag Selected tag.
   */
  handleTagSelection(tag: Tag) {
    tag.enabled = !tag.enabled;

    this.db.updateObject<Tag>('tags', tag);

    this.logger.log(
      'Tag selection updated: ' + JSON.stringify(tag),
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );
  }

  /**
   * Handles new tag addition.
   * @param name Name for tag to add.
   */
  handleTagAddition(name: string) {
    if (name.trim().length > 0) {
      this.db.createObject<Tag>('tags', new Tag({ name: name }));
    }
  }

  /**
   * Moves to welcome page.
   */
  closeFile() {
    this.logger.log('Navigating to: ./welcome');
    this.router.navigate(['./welcome']);
  }
}
