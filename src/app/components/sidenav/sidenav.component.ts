import { Component, OnInit, Output } from '@angular/core';

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

  addLabel() {
  }

  addEvent() {

  }

  addTask() {

  }

  openModal(id: string) {
    document.getElementById(id).classList.add('active');
  }

  closeModal(id: string) {
    document.getElementById(id).classList.remove('active');
  }
}
