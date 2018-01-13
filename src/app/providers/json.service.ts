import { Injectable } from '@angular/core';

import * as fs from 'fs';
import * as tv4 from 'tv4';

@Injectable()
export class JsonService {
  constructor() {}

  isValid(data: string): boolean {
    try {
      const valid = tv4.validate(JSON.parse(data), JSON.parse(fs.readFileSync('data.schema.json', 'utf8')));

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
