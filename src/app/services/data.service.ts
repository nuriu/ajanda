import { Injectable } from '@angular/core';
import * as low from 'lowdb';
// import { generate } from 'shortid';
import * as FileAsync from 'lowdb/adapters/FileAsync';
@Injectable()
export class DataService {
  private db: low.LowdbAsync<any>;
  private adapter: low.AdapterAsync<any>;
  /**
   * Base schema for database file.
   */
  private schema = { name: '', calendars: [], password: '', tags: [], tasks: [] };

  constructor() {}

  /**
   * Loads database file.
   * @param path Path to database (.ajanda file).
   */
  async loadDatabase(path: string) {
    this.adapter = new FileAsync(path);
    this.db = await low(this.adapter);
    this.db.defaults(this.schema).write();
  }

  /**
   * Creates new database named data.ajanda.
   */
  async newDatabase() {
    this.adapter = new FileAsync('data.ajanda');
    this.db = await low(this.adapter);
    this.db.defaults(this.schema).write();
    this.db.set('name', 'data.ajanda').write();
  }

  /**
   * Returns name of the database.
   */
  getDbName() {
    return this.db.get('name').value();
  }
}
