import { Component, OnInit } from '@angular/core';
import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit {
  constructor(private db: DataService) {}

  ngOnInit() {}
}
