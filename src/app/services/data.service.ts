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

  constructor(private logger: LoggerService) {
    this.schema = new Schema();
  }

  /**
   * Loads database file.
   * @param path Path to database (.ajanda file).
   */
  async loadDatabase(path: string) {
    this.logger.log(
      'Loading database file from: ' + path,
      LOG_LEVELS.EVENT,
      EVENT_TYPES.OPEN_DB_FILE
    );

    this.adapter = new FileAsync(path);
    this.db = await low(this.adapter);
    this.db.defaults(JSON.parse(JSON.stringify(this.schema))).write();
  }

  /**
   * Creates new database named data.ajanda.
   */
  async newDatabase(path: string) {
    this.logger.log(
      'Creating new database file at: ' + path,
      LOG_LEVELS.EVENT,
      EVENT_TYPES.CREATE_DB_FILE
    );

    this.adapter = new FileAsync(path);
    this.db = await low(this.adapter);
    this.db.defaults(JSON.parse(JSON.stringify(this.schema))).write();
    this.db.set('name', PATH.basename(path)).write();
  }

  /**
   * Returns name of the database.
   */
  getDatabaseName() {
    this.logger.log('Requested database name info.');

    return this.db.get('name').value();
  }

  /**
   * Adds new calendar to database.
   * @param calendar Calendar object.
   */
  createCalendar(calendar: Calendar) {
    calendar.id = generate();

    this.db
      .get('calendars')
      .push(calendar)
      .write();

    this.logger.log('Created new calendar: ' + JSON.stringify(calendar));
  }

  /**
   * Get calendar info with given id.
   * @param id Calendar id.
   */
  getCalendar(id: string): Calendar {
    this.logger.log('Requested calendar info for: ' + id);

    return this.db
      .get('calendars')
      .find({ id: id })
      .value() as Calendar;
  }

  /**
   * Returns list of calendar objects.
   */
  listCalendars(): Array<Calendar> {
    this.logger.log('Requested list of calendars.');

    return this.db.get('calendars').value() as Array<Calendar>;
  }

  /**
   * Updates calendar object with same id.
   * @param calendar New calendar object with same id.
   */
  updateCalendar(calendar: Calendar) {
    this.logger.log('Updated calendar info for: ' + calendar.id.toString());

    this.db
      .get('calendars')
      .find({ id: calendar.id })
      .assign(calendar)
      .write();
  }

  /**
   * Deletes calendar with or without its tasks from database.
   * @param id Calendar id.
   * @param deleteTasks Delete tasks inside the calendar too?
   */
  deleteCalendar(id: string, deleteTasks: boolean) {
    this.logger.log('Deleted calendar: ' + id);

    // if deleTasks set to true, delete all task inside calendar.
    if (deleteTasks) {
      const taskIds = this.getCalendar(id).tasks;
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
  createTag(tag: Tag) {
    tag.id = generate();

    this.db
      .get('tags')
      .push(tag)
      .write();

    this.logger.log('Created new tag: ' + JSON.stringify(tag));
  }

  /**
   * Get tag info with given id.
   * @param id Tag id.
   */
  getTag(id: string): Tag {
    this.logger.log('Requested tag info for: ' + id);

    return this.db
      .get('tags')
      .find({ id: id })
      .value() as Tag;
  }

  /**
   * Returns list of tag objects.
   */
  listTags(): Array<Tag> {
    this.logger.log('Requested list of tags.');

    return this.db.get('tags').value() as Array<Tag>;
  }

  /**
   * Updates tag object with same id.
   * @param tag New tag object with same id.
   */
  updateTag(tag: Tag) {
    this.logger.log('Updated tag info for: ' + tag.id.toString());

    this.db
      .get('tags')
      .find({ id: tag.id })
      .assign(tag)
      .write();
  }

  /**
   * Deletes tag from database.
   * @param id Tag id.
   */
  deleteTag(id: string) {
    this.logger.log('Deleted tag: ' + id);

    // remove tag from all tasks.
    const tasks = this.listTasks();
    tasks.forEach(task => {
      for (let i = 0; i < task.tags.length; i++) {
        const tagId = task.tags[i];
        if (tagId === id) {
          task.tags.splice(i, 1);
          this.logger.log('Removed tag: ' + id + ' from task: ' + task.id);
          this.updateTask(task);
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
  createTask(task: Task, calendarId: string) {
    const calendar = this.getCalendar(calendarId);

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
    this.updateCalendar(calendar);

    this.logger.log(
      'Created new task: ' + JSON.stringify(task) + '. Added to calendar: ' + calendarId
    );
  }

  /**
   * Get task info with given id.
   * @param id Task id.
   */
  getTask(id: string): Task {
    this.logger.log('Requested task info for: ' + id);

    return this.db
      .get('tasks')
      .find({ id: id })
      .value() as Task;
  }

  /**
   * Returns list of task objects.
   */
  listTasks(): Array<Task> {
    this.logger.log('Requested list of tasks.');

    return this.db.get('tasks').value() as Array<Task>;
  }

  /**
   * Updates task object with same id.
   * @param task New task object with same id.
   */
  updateTask(task: Task) {
    this.logger.log('Updated task info for: ' + task.id.toString());

    this.db
      .get('tasks')
      .find({ id: task.id })
      .assign(task)
      .write();
  }

  /**
   * Deletes task from database.
   * @param id Task id.
   */
  deleteTask(id: string) {
    this.logger.log('Deleted task: ' + id);

    // remove task from all calendars.
    const calendars = this.listCalendars();
    calendars.forEach(calendar => {
      for (let i = 0; i < calendar.tasks.length; i++) {
        const taskId = calendar.tasks[i];
        if (taskId === id) {
          calendar.tasks.splice(i, 1);
          this.logger.log('Removed task: ' + id + ' from calendar: ' + calendar.id);
          this.updateCalendar(calendar);
        }
      }
    });

    this.db
      .get('tasks')
      .remove({ id: id })
      .write();
  }
}
