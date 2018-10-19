import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private db: DataService) {}

  ngOnInit() {}

  newDataFile() {}

  loadDataFile() {
    // go to month view
    this.router.navigate(['./month']);
  }
}
