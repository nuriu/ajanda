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
    const cmd = `
    CREATE TABLE IF NOT EXISTS hello (a int, b char);
    `;

    this.db.run(cmd);
    this.overwriteDatabase();
  }

  private overwriteDatabase() {
    const data = this.db.export();
    const buffer = new Buffer(data);
    console.log(this.dbFile.path);
    fs.writeFileSync(this.dbFile.path, buffer);
  }
}
