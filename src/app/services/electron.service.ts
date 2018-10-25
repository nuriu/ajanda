import { Injectable } from '@angular/core';
import * as childProcess from 'child_process';
import { ipcRenderer, remote, webFrame } from 'electron';
import * as fs from 'fs';

@Injectable()
export class ElectronService {
  public ipcRenderer: typeof ipcRenderer;
  public webFrame: typeof webFrame;
  public remote: typeof remote;
  public childProcess: typeof childProcess;
  public fs: typeof fs;

  public constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  public isElectron(): boolean {
    return window && window.process && window.process.type;
  }

  /**
   * Shows open file dialog for database file loading purposes.
   * @param title Dialog title.
   * @param extensions Supported extensions.
   * @param extensionText Extension description text. i.e. Text files (*.txt)
   */
  public showOpenDBDialog(
    title: string,
    extensions: string[],
    extensionText: string
  ): Array<string> {
    if (this.isElectron()) {
      return this.remote.dialog.showOpenDialog({
        title: title,
        properties: ['openFile'],
        filters: [
          {
            name: extensionText,
            extensions: extensions
          }
        ]
      });
    }
  }

  /**
   * Shows save file dialog for database file saving purposes.
   * @param title Dialog title.
   * @param extensions Supported extensions.
   * @param extensionText Extension description text. i.e. Text files (*.txt)
   */
  public showSaveDBDialog(
    title: string,
    extensions: string[],
    extensionText: string
  ): string {
    if (this.isElectron()) {
      return this.remote.dialog.showSaveDialog({
        title: title,
        filters: [
          {
            name: extensionText,
            extensions: extensions
          }
        ]
      });
    }
  }

  /**
   * Check if file or folder at path is exists or not.
   * @param path Path to check.
   */
  public isPathExists(path: string): boolean {
    return this.fs.existsSync(path);
  }

  /**
   * Creates folder at given path.
   * @param path Folder path.
   */
  public createFolder(path: string) {
    try {
      this.fs.mkdirSync(path);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  /**
   * Clear folder contents at given path.
   * @param path Folder path.
   */
  public clearFolder(path: string) {
    try {
      fs.readdir(path, (err, files) => {
        if (!err) {
          for (const file of files) {
            fs.unlinkSync(path + '/' + file);
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Writes data to file. Creates file if it isn't exists.
   * @param filePath File path.
   * @param data Data to write.
   */
  public writeDataToFile(filePath: string, data: any) {
    this.fs.appendFileSync(filePath, data);
  }
}
