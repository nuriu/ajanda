import { Injectable } from '@angular/core';
import * as low from 'lowdb';
// import { generate } from 'shortid';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { LoggerService, LOG_LEVELS } from './logger.service';
@Injectable()
export class DataService {
  private db: low.LowdbAsync<any>;
  private adapter: low.AdapterAsync<any>;
  /**
   * Base schema for database file.
   */
  private schema = { name: '', calendars: [], password: '', tags: [], tasks: [] };

  constructor(private logger: LoggerService) {}

  /**
   * Loads database file.
   * @param path Path to database (.ajanda file).
   */
  async loadDatabase(path: string) {
    this.logger.log('Loading database file from: ' + path, LOG_LEVELS.EVENT);

    this.adapter = new FileAsync(path);
    this.db = await low(this.adapter);
    this.db.defaults(this.schema).write();
  }

  /**
   * Creates new database named data.ajanda.
   */
  async newDatabase() {
    this.logger.log('Creating new database file at: ./data.ajanda', LOG_LEVELS.EVENT);

    this.adapter = new FileAsync('data.ajanda');
    this.db = await low(this.adapter);
    this.db.defaults(this.schema).write();
    this.db.set('name', 'data.ajanda').write();
  }

  /**
   * Returns name of the database.
   */
  getDbName() {
    this.logger.log('Requested database name info.');

    return this.db.get('name').value();
  }
}
