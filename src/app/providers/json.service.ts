import { Injectable } from '@angular/core';
import * as tv4 from 'tv4';
import { ElectronService } from './electron.service';

@Injectable()
export class JsonService {
  constructor(private electron: ElectronService) {}

  isValid(data: string): boolean {
    try {
      const valid = tv4.validate(
        JSON.parse(data),
        JSON.parse(this.electron.fs.readFileSync('data.schema.json', 'utf8'))
      );

      if (!valid) {
        console.error(tv4.error);
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
