import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import * as uuidv4 from 'uuid/v4';
import { DataFile, Event, Label, Task } from '../models/models';
import { ElectronService } from './electron.service';
import { JsonService } from './json.service';

@Injectable()
export class DataService {
  private fileBuffer: Buffer;
  private dataFilePath: string;
  private db: DataFile;

  constructor(private router: Router, private electron: ElectronService, private js: JsonService) {}

  /**
   * Returns label records.
   */
  getLabels(): Array<Label> {
    if (this.db) {
      return this.db.LABELS;
    } else {
      return null;
    }
  }

  /**
   * Returns event records.
   */
  getEvents(): Array<Event> {
    if (this.db) {
      return this.db.EVENTS;
    } else {
      return null;
    }
  }

  /**
   * Returns task records.
   */
  getTasks(): Array<Task> {
    if (this.db) {
      return this.db.TASKS;
    } else {
      return null;
    }
  }

  /**
   * Returns database files path if file object exists.
   * Otherwise redirects to load page.
   */
  getDataFilePath() {
    if (!isNullOrUndefined(this.dataFilePath)) {
      return this.dataFilePath;
    } else {
      this.router.navigate(['./home']);
    }
  }

  /**
   * Loads data file from given file object.
   * @param dataFilePath Data file object.
   */
  loadDataFile(dataFilePath: string) {
    this.dataFilePath = dataFilePath;

    const jsonString = this.electron.fs.readFileSync(this.dataFilePath, 'utf8');

    if (this.js.isValid(jsonString)) {
      this.db = JSON.parse(jsonString);

      console.log(this.db);
    } else {
      this.router.navigate(['./home']);
    }
  }

  /**
   * Creates base data structure.
   */
  newDatafile() {
    this.db = {
      LABELS: [],
      EVENTS: [],
      TASKS: []
    };

    // TODO: test darwin & win32
    this.dataFilePath = './data.ajanda';
  }

  /**
   * Adds new event to the data.
   * @param event Event object which will be added.
   */
  addEvent(event: Event) {
    event.Id = uuidv4();
    this.db.EVENTS.push(event);
  }

  /**
   * Adds new task to the data.
   * @param task Task object which will be added.
   */
  addTask(task: Task) {
    task.Id = uuidv4();
    this.db.TASKS.push(task);
  }

  /**
   * Adds new label to the data.
   * @param label Label object which will be added.
   */
  addLabel(label: Label) {
    label.Id = uuidv4();
    this.db.LABELS.push(label);
  }

  /**
   * Saves current database data to loaded database file.
   * If file object not exists; redirects to load page.
   */
  overwriteDataFile() {
    if (!isNullOrUndefined(this.dataFilePath)) {
      this.electron.fs.writeFile(this.dataFilePath, JSON.stringify(this.db), err => {
        if (err) {
          console.error(err);
        }
      });
    } else {
      this.router.navigate(['./home']);
    }
  }
}
