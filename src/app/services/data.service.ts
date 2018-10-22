import { Injectable } from '@angular/core';
import * as low from 'lowdb';
// import { generate } from 'shortid';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as PATH from 'path';
import { Schema } from '../models/Schema';
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
  getDbName() {
    this.logger.log('Requested database name info.');

    return this.db.get('name').value();
  }
}
