import { Injectable } from '@angular/core';
import * as low from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as PATH from 'path';
import { generate } from 'shortid';
import { Calendar } from '../models/Calendar';
import { Schema } from '../models/Schema';
import { Tag } from '../models/Tag';
import { Task } from '../models/Task';
import { EVENT_TYPES, LoggerService, LOG_LEVELS } from './logger.service';
import { SettingsService } from './settings.service';

@Injectable()
export class DataService {
  /**
   * lowdb db object.
   */
  private db: low.LowdbAsync<any>;
  /**
   * lowdb adapter.
   */
  private adapter: low.AdapterAsync<any>;
  /**
   * Base schema for database file.
   */
  private schema: Schema;

  public constructor(
    private logger: LoggerService,
    private settings: SettingsService
  ) {
    this.schema = new Schema();
  }

  /**
   * Loads/creates database file.
   * @param path Path to database (.ajanda file).
   * @param isNew Database is creating or loading existing one.
   */
  public async loadDatabase(path: string, isNew: boolean = false) {
    this.adapter = new FileAsync(path);
    this.db = await low(this.adapter);
    this.db.defaults(JSON.parse(JSON.stringify(this.schema))).write();
    this.settings.addRecentlyOpenedFile(path);

    if (isNew) {
      this.logger.log(
        'Creating new database file at: ' + path,
        LOG_LEVELS.EVENT,
        EVENT_TYPES.CREATE_DB_FILE
      );
      this.db.set('name', PATH.basename(path)).write();
    } else {
      this.logger.log(
        'Loading database file from: ' + path,
        LOG_LEVELS.EVENT,
        EVENT_TYPES.OPEN_DB_FILE
      );
    }
  }

  /**
   * Returns name of the database.
   */
  public getDatabaseName() {
    this.logger.log('Requested database name info.');

    return this.db.get('name').value();
  }

  /**
   * Adds non-related object to database inside parentKey.
   * @param parentKey Parent key (table name) where to save the object inside.
   * @param object Object that will be created.
   */
  public createObject<T>(parentKey: string, object: T) {
    object['id'] = generate();

    this.db
      .get(parentKey)
      .push(object)
      .write();

    this.logger.log(
      'Created new object inside ' + parentKey + ': ' + JSON.stringify(object)
    );
  }

  /**
   * Returns object that has given id inside parentKey from database.
   * @param parentKey Parent key (like table name) where to look for object.
   * @param id Id of the object.
   */
  public getObjectWithId<T>(parentKey: string, id: string): T {
    this.logger.log(
      'Requested object info inside ' + parentKey + ' with id: ' + id
    );

    return (this.db
      .get(parentKey)
      .find({ id: id })
      .value() as unknown) as T;
  }

  /**
   * Returns object list from 'key' at database.
   * @param key Database object key.
   */
  public getObjectList<T>(key: string): Array<T> {
    this.logger.log('Requested list of: ' + key + '.');

    return this.db.get(key).value() as Array<T>;
  }

  /**
   * Updates object at database.
   * @param parentKey Parent key (like table name) where to look for object.
   * @param updatedObject New object to swap with the old one.
   */
  public updateObject<T>(parentKey: string, updatedObject: T) {
    this.logger.log(
      'Updated object info in ' +
        parentKey +
        ' for object: ' +
        updatedObject['id']
    );

    this.db
      .get(parentKey)
      .find({ id: updatedObject['id'] })
      .assign(updatedObject)
      .write();
  }

  /**
   * Adds new calendar to database.
   * @param calendar Calendar object.
   */
  public createCalendar(calendar: Calendar) {
    calendar.id = generate();

    this.db
      .get('calendars')
      .push(calendar)
      .write();

    this.logger.log('Created new calendar: ' + JSON.stringify(calendar));
  }

  /**
   * Deletes calendar with or without its tasks from database.
   * @param id Calendar id.
   * @param deleteTasks Delete tasks inside the calendar too?
   */
  public deleteCalendar(id: string, deleteTasks: boolean) {
    this.logger.log('Deleted calendar: ' + id);

    // if deleTasks set to true, delete all task inside calendar.
    if (deleteTasks) {
      const taskIds = this.getObjectWithId<Calendar>('calendars', id).tasks;
      taskIds.forEach(taskId => {
        this.db
          .get('tasks')
          .remove({ id: taskId })
          .write();
      });
    }

    this.db
      .get('calendars')
      .remove({ id: id })
      .write();
  }

  /**
   * Adds new tag to database.
   * @param tag Tag object.
   */
  public createTag(tag: Tag) {
    tag.id = generate();

    this.db
      .get('tags')
      .push(tag)
      .write();

    this.logger.log('Created new tag: ' + JSON.stringify(tag));
  }

  /**
   * Deletes tag from database.
   * @param id Tag id.
   */
  public deleteTag(id: string) {
    this.logger.log('Deleted tag: ' + id);

    // remove tag from all tasks.
    const tasks = this.getObjectList<Task>('tasks');

    tasks.forEach(task => {
      for (let i = 0; i < task.tags.length; i++) {
        const tagId = task.tags[i];
        if (tagId === id) {
          task.tags.splice(i, 1);
          this.logger.log('Removed tag: ' + id + ' from task: ' + task.id);
          this.updateObject<Task>('tasks', task);
        }
      }
    });

    this.db
      .get('tags')
      .remove({ id: id })
      .write();
  }

  /**
   * Adds new task to database.
   * @param task Task object.
   * @param calendarId Task's parent calendar id.
   */
  public createTask(task: Task, calendarId: string) {
    const calendar = this.getObjectWithId<Calendar>('calendars', calendarId);

    if (!calendar) {
      this.logger.log(
        'Calendar with given calendarId does not exists: ' + calendarId,
        LOG_LEVELS.ERROR
      );
      return;
    }

    task.id = generate();

    this.db
      .get('tasks')
      .push(task)
      .write();

    // add task to calendar and update it.
    calendar.tasks.push(task.id);
    this.updateObject<Calendar>('calendars', calendar);

    this.logger.log(
      'Created new task: ' +
        JSON.stringify(task) +
        '. Added to calendar: ' +
        calendarId
    );
  }

  /**
   * Deletes task from database.
   * @param id Task id.
   */
  public deleteTask(id: string) {
    this.logger.log('Deleted task: ' + id);

    // remove task from all calendars.
    const calendars = this.getObjectList<Calendar>('calendars');
    calendars.forEach(calendar => {
      for (let i = 0; i < calendar.tasks.length; i++) {
        const taskId = calendar.tasks[i];
        if (taskId === id) {
          calendar.tasks.splice(i, 1);
          this.logger.log(
            'Removed task: ' + id + ' from calendar: ' + calendar.id
          );
          this.updateObject<Calendar>('calendars', calendar);
        }
      }
    });

    this.db
      .get('tasks')
      .remove({ id: id })
      .write();
  }
}
