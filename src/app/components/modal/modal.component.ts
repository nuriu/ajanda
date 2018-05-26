import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() id: string;
  @Input() title: string;

  @Output() Submit = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  submit() {
    this.close();
    this.Submit.emit();
  }

  close() {
    document.getElementById(this.id).classList.remove('active');
  }
}
