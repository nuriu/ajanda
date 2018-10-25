import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Calendar } from '../../models/Calendar';
import { Tag } from '../../models/Tag';
import { Toast, TOAST_TYPES } from '../../models/Toast';
import { DataService } from '../../services/data.service';
import {
  EVENT_TYPES,
  LoggerService,
  LOG_LEVELS
} from '../../services/logger.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  /**
   * Name of the database.
   */
  public databaseName: string;
  /**
   * List of calendars.
   */
  public calendars: Array<Calendar>;
  /**
   * List of tags.
   */
  public tags: Array<Tag>;

  public constructor(
    private router: Router,
    private db: DataService,
    private logger: LoggerService,
    private toastService: ToastService
  ) {
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
  public handleCalendarSelection(calendar: Calendar) {
    calendar.selected = !calendar.selected;

    this.db.updateObject<Calendar>('calendars', calendar);

    this.logger.log(
      'Calendar selection updated: ' + JSON.stringify(calendar),
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    let translateKey = '';
    if (calendar.selected) {
      translateKey = 'TOAST_MESSAGES.CALENDAR_SELECTED';
    } else {
      translateKey = 'TOAST_MESSAGES.CALENDAR_UNSELECTED';
    }

    this.toastService.publish(
      new Toast({
        Message: 'TRANSLATED-MESSAGE' + calendar.name,
        Type: TOAST_TYPES.PRIMARY
      }),
      translateKey
    );
  }

  /**
   * Handles new calendar addition.
   * @param name Name for calendar to add.
   */
  public handleCalendarAddition(name: string) {
    this.logger.log(
      'Clicked to add calendar with name: ' + name,
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    if (name.trim().length > 0) {
      this.db.createObject<Calendar>('calendars', new Calendar({ name: name }));
    }

    this.toastService.publish(
      new Toast({
        Message: 'TRANSLATED-MESSAGE' + name,
        Type: TOAST_TYPES.SUCCESS
      }),
      'TOAST_MESSAGES.CREATED_CALENDAR'
    );
  }

  /**
   * Handles calendar deletion event.
   * @param calendar Which calendar to be deleted.
   */
  public handleCalendarDeletion(calendar: Calendar) {
    this.logger.log(
      'Clicked to delete calendar: ' + JSON.stringify(calendar),
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    this.db.deleteCalendar(calendar.id, true);

    this.toastService.publish(
      new Toast({
        Message: 'TRANSLATED-MESSAGE' + calendar.name,
        Type: TOAST_TYPES.SUCCESS
      }),
      'TOAST_MESSAGES.REMOVED_CALENDAR'
    );
  }

  /**
   * Handles tag deletion event.
   * @param tag Which tag to be deleted.
   */
  public handleTagDeletion(tag: Tag) {
    this.logger.log(
      'Clicked to delete tag: ' + JSON.stringify(tag),
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    this.db.deleteTag(tag.id);

    this.toastService.publish(
      new Toast({
        Message: 'TRANSLATED-MESSAGE' + tag.name,
        Type: TOAST_TYPES.SUCCESS
      }),
      'TOAST_MESSAGES.REMOVED_TAG'
    );
  }

  /**
   * Updates tag selection info.
   * @param tag Selected tag.
   */
  public handleTagSelection(tag: Tag) {
    tag.enabled = !tag.enabled;

    this.db.updateObject<Tag>('tags', tag);

    this.logger.log(
      'Tag selection updated: ' + JSON.stringify(tag),
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    let translateKey = '';
    if (tag.enabled) {
      translateKey = 'TOAST_MESSAGES.TAG_ENABLED';
    } else {
      translateKey = 'TOAST_MESSAGES.TAG_UNENABLED';
    }

    this.toastService.publish(
      new Toast({
        Message: 'TRANSLATED-MESSAGE' + tag.name,
        Type: TOAST_TYPES.PRIMARY
      }),
      translateKey
    );
  }

  /**
   * Handles new tag addition.
   * @param name Name for tag to add.
   */
  public handleTagAddition(name: string) {
    this.logger.log(
      'Clicked to add tag with name: ' + name,
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CLICK
    );

    if (name.trim().length > 0) {
      this.db.createObject<Tag>('tags', new Tag({ name: name }));
    }

    this.toastService.publish(
      new Toast({
        Message: 'TRANSLATED-MESSAGE' + name,
        Type: TOAST_TYPES.SUCCESS
      }),
      'TOAST_MESSAGES.CREATED_TAG'
    );
  }

  /**
   * Moves to welcome page.
   */
  public closeFile() {
    this.logger.log('Navigating to: ./welcome');
    this.router.navigate(['./welcome']);
  }
}
