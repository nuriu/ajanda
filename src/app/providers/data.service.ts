import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as fs from 'fs';
import * as SQL from 'sql.js';

@Injectable()
export class DataService {
  private fileBuffer: Buffer;
  private dbFile: File;
  private db;

  constructor(private router: Router) {}

  loadDatabase(database: File) {
    this.dbFile = database;

    this.fileBuffer = fs.readFileSync(this.dbFile.path);

    // load database from file
    this.db = new SQL.Database(this.fileBuffer);

    this.createTablesIfNotExists();
  }

  getDatabasePath() {
    if (this.dbFile !== null && this.dbFile !== undefined) {
      return this.dbFile.path;
    } else {
      this.router.navigate(['./home']);
    }
  }

  private createTablesIfNotExists() {
    const tbl_labels = `
    CREATE TABLE IF NOT EXISTS LABELS (
      Id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
      Name TEXT NOT NULL UNIQUE,
      ColorCode	TEXT NOT NULL,
      Description	TEXT
    );
    `;

    const tbl_events = `
    CREATE TABLE IF NOT EXISTS EVENTS (
      Id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
      Title TEXT NOT NULL,
      StartDate TEXT NOT NULL,
      FinishDate TEXT NOT NULL
    );
    `;

    const tbl_tasks = `
    CREATE TABLE IF NOT EXISTS TASKS (
      Id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
      Name TEXT NOT NULL,
      Description	TEXT,
      FinishDate TEXT NOT NULL,
      RepeatDays INTEGER
    );
    `;

    const tbl_eventslabels = `
    CREATE TABLE IF NOT EXISTS EVENTSLABELS (
      Event_Id INTEGER NOT NULL,
      Label_Id INTEGER NOT NULL,
      FOREIGN KEY(Event_Id) REFERENCES EVENTS(Id)
      FOREIGN KEY(Label_Id) REFERENCES LABELS(Id)
    )
    `;

    const tbl_taskslabels = `
    CREATE TABLE IF NOT EXISTS TASKSLABELS (
      Task_Id INTEGER NOT NULL,
      Label_Id INTEGER NOT NULL,
      FOREIGN KEY(Task_Id) REFERENCES TASKS(Id)
      FOREIGN KEY(Label_Id) REFERENCES LABELS(Id)
    )
    `;

    this.db.run(tbl_labels);
    this.db.run(tbl_events);
    this.db.run(tbl_eventslabels);
    this.db.run(tbl_tasks);
    this.db.run(tbl_taskslabels);

    this.overwriteDatabase();
  }

  overwriteDatabase() {
    const data = this.db.export();
    const buffer = new Buffer(data);
    console.log(this.dbFile.path);
    fs.writeFileSync(this.dbFile.path, buffer);
  }
}
