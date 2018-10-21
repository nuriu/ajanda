import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from './electron.service';

@Injectable()
export class DataService {
  private fileBuffer: Buffer;
  private dataFilePath: string;

  constructor(private router: Router, private electron: ElectronService) {}
}
