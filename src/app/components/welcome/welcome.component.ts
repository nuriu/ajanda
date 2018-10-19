import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router, private db: DataService) {}

  ngOnInit() {}

  newDataFile() {}

  loadDataFile() {
    // go to month view
    this.router.navigate(['./home']);
  }
}
