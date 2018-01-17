import { Component, OnInit, Output } from '@angular/core';

import { Label, Event, Task } from '../../models/models';

import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  constructor(private db: DataService) { }

  ngOnInit() { }

  /**
   * Saves data to data file.
   */
  saveData() {
    this.db.overwriteDataFile();
  }

  /**
   * Sends new label object to data service.
   */
  addLabel() {
    const n = (<HTMLInputElement>document.getElementById('label-name')).value;
    const c = (<HTMLInputElement>document.getElementById('label-color-code')).value;
    const d = (<HTMLInputElement>document.getElementById('label-description')).value;

    if (n && c) {
      this.db.addLabel(new Label({
        Id: '',
        Name: n,
        ColorCode: c,
        Description: d
      }));
    } else {
      // TODO: show error toast.
    }
  }

  /**
   * Sends new event object to data service.
   */
  addEvent() {

  }

  /**
   * Sends new task object to data service.
   */
  addTask() {

  }

  openModal(id: string) {
    document.getElementById(id).classList.add('active');
  }

  closeModal(id: string) {
    document.getElementById(id).classList.remove('active');
  }
}
