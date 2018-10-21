import { Injectable } from '@angular/core';
import * as childProcess from 'child_process';
import { ipcRenderer, remote, webFrame } from 'electron';
import * as fs from 'fs';

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  isElectron(): boolean {
    return window && window.process && window.process.type;
  }

  /**
   * Shows open file dialog for database file loading purposes.
   */
  showOpenDBDialog(): Array<string> {
    if (this.isElectron()) {
      return this.remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          {
            name: 'Ajanda Files (*.ajanda)',
            extensions: ['ajanda']
          }
        ]
      });
    }
  }

  /**
   * Check if file or folder at path is exists or not.
   * @param path Path to check.
   */
  isPathExists(path: string): boolean {
    return this.fs.existsSync(path);
  }

  /**
   * Creates folder at given path.
   * @param path Folder path.
   */
  createFolder(path: string) {
    try {
      this.fs.mkdirSync(path);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  /**
   * Writes data to file. Creates file if it isn't exists.
   * @param filePath File path.
   * @param data Data to write.
   */
  writeDataToFile(filePath: string, data: any) {
    this.fs.appendFileSync(filePath, data);
  }
}
