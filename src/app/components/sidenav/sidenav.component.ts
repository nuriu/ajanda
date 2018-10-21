import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  dbName: string;

  constructor(private db: DataService) {}

  ngOnInit() {
    this.dbName = this.db.getDbName();
  }
}
