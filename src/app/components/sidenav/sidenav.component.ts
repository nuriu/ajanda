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
    const t = (<HTMLInputElement>document.getElementById('event-title')).value;
    const sd = (<HTMLInputElement>document.getElementById('event-start-date')).valueAsDate;
    const fd = (<HTMLInputElement>document.getElementById('event-finish-date')).valueAsDate;

    if (t && sd && fd) {
      this.db.addEvent(new Event({
        Id: '',
        Title: t,
        StartDate: sd,
        FinishDate: fd,
        Labels: new Array<Label>()
      }));
    } else {
      // TODO: show error toast.
    }
  }

  /**
   * Sends new task object to data service.
   */
  addTask() {
    const n = (<HTMLInputElement>document.getElementById('task-name')).value;
    const fd = (<HTMLInputElement>document.getElementById('task-finish-date')).valueAsDate;
    const rpd = (<HTMLInputElement>document.getElementById('task-repeat-days')).valueAsNumber;
    const d = (<HTMLInputElement>document.getElementById('task-description')).value;

    if (n && fd) {
      this.db.addTask(new Task({
        Id: '',
        Name: n,
        FinishDate: fd,
        RepeatDays: rpd,
        Description: d
      }));
    } else {
      // TODO: show error toast.
    }
  }

  openModal(id: string) {
    document.getElementById(id).classList.add('active');
  }

  closeModal(id: string) {
    document.getElementById(id).classList.remove('active');
  }
}
