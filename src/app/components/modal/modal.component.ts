import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input()
  id: string;
  @Input()
  title: string;

  constructor() { }

  ngOnInit() { }

  private close() {
    document.getElementById(this.id).classList.remove('active');
  }
}
