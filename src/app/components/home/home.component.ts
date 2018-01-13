import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
              private db: DataService) { }

  ngOnInit() { }

  loadDatabase() {
    // get selected file
    const file = document.forms['database-form']['database-input'].files[0];

    if (file !== undefined && file !== null) {
      // load file data to service
      this.db.loadDataFile(file);
      // go to month view
      this.router.navigate(['./month']);
    } else {
      // TODO: show error toast
    }
  }
}
