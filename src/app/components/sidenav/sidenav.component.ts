import { Component, OnInit } from '@angular/core';
import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  constructor(private db: DataService) {}

  ngOnInit() {}
}
