import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as fs from 'fs';
import * as moment from 'moment';

import { Label } from '../models/models';
import { Event } from '../models/models';
import { Task } from '../models/models';

@Injectable()
export class DataService {
  private fileBuffer: Buffer;
  private databaseFile: File;
  private db: string;

  private labels: Array<Label>;
  private events: Array<Event>;
  private tasks: Array<Task>;

  constructor(private router: Router) {}

  /**
   * Loads sqlite database from given file object.
   * @param database Database file object.
   */
  loadDatabase(database: File) {
    this.databaseFile = database;

    console.log(this.db);
    // this.createTablesIfNotExists();
    // console.log(this.getLabels());
  }

  /**
   * Returns database files path if file object exists.
   * Otherwise redirects to load page.
   */
  getDatabasePath() {
    if (this.databaseFile !== null && this.databaseFile !== undefined) {
      return this.databaseFile.path;
    } else {
      this.router.navigate(['./home']);
    }
  }

  /**
   * Saves current database data to loaded database file.
   * If file object not exists; redirects to load page.
   */
  overwriteDataFile() {
    if (this.databaseFile !== null && this.databaseFile !== undefined) {

    } else {
      this.router.navigate(['./home']);
    }
  }

  /**
   * Returns label records.
   */
  getLabels(): Array<Label> {
    if (!this.labels) {
      this.loadLabels();
    }

    return this.labels;
  }

  /**
   * Returns event records.
   */
  getEvents(): Array<Event> {
    if (!this.events) {
      this.loadEvents();
    }

    return this.events;
  }

  /**
   * Returns task records.
   */
  getTasks(): Array<Task> {
    if (!this.tasks) {
      this.loadTasks();
    }

    return this.tasks;
  }

  /**
   * Loads label records from database to service.
   */
  private loadLabels() {
    if (!this.labels) {
      this.labels = new Array<Label>();
    }

    const data = null;

    data.forEach(element => {
      this.labels.push();
    });
  }

  /**
   * Loads event records from data file to service.
   */
  private loadEvents() {
    if (!this.events) {
      this.events = new Array<Event>();
    }

    const data = null;

    data.forEach(element => {});
  }

  /**
   * Loads task records from data file to service.
   */
  private loadTasks() {
    if (!this.tasks) {
      this.tasks = new Array<Task>();
    }

    const data = null;

    data.forEach(element => {});
  }
}
