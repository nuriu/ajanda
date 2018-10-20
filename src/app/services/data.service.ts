import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from './electron.service';
import { JsonService } from './json.service';

@Injectable()
export class DataService {
  private fileBuffer: Buffer;
  private dataFilePath: string;

  constructor(private router: Router, private electron: ElectronService, private js: JsonService) {}
}
