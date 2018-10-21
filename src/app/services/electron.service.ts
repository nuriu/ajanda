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
}
