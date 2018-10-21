import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AppConfig } from '../../environments/environment';
import { ElectronService } from './electron.service';

@Injectable()
export class LoggerService {
  constructor(private electron: ElectronService) {}

  /**
   * Logs given message to file.
   * @param message Message to log.
   * @param level Log level. [LIFECYCLE, EVENT, INFO, WARNING, ERROR]
   */
  log(message: string, level: LOG_LEVELS = LOG_LEVELS.INFO, eventType?: EVENT_TYPES) {
    const filePath = './LOGS/' + moment().format('D-M-YYYY') + '.log';

    let finalMessage = moment().toISOString() + '\t|\t' + level + '\t|\t';

    if (level === LOG_LEVELS.EVENT && eventType) {
      finalMessage += eventType + '\t|\t' + message + '\n';
    } else {
      finalMessage += message + '\n';
    }

    // if we aren't in production mode then write message to console as well.
    if (!AppConfig.production) {
      console.log(finalMessage);
    }

    // if folder doesn't exists then create it.
    if (!this.electron.isPathExists('./LOGS/')) {
      this.electron.createFolder('./LOGS/');
    }

    this.electron.writeDataToFile(filePath, finalMessage);
  }

  /**
   * Removes log folder from disk.
   */
  clearLogFolder() {
    // TODO: implement removing log folder from disk.
  }
}

/**
 * Logging levels.
 */
export enum LOG_LEVELS {
  LIFECYCLE = 'LIFECYCLE',
  EVENT = 'EVENT',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

/**
 * Types of log events.
 */
export enum EVENT_TYPES {
  CLICK = 'CLICK',
  MONTH_SWITCH = 'MONTH_SWITCH',
  CREATE_DB_FILE = 'CREATE_DB_FILE',
  OPEN_DB_FILE = 'OPEN_DB_FILE'
}
