import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  @Output()
  onSubmit = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  private submit() {
    this.close();
    this.onSubmit.emit();
  }

  private close() {
    document.getElementById(this.id).classList.remove('active');
  }
}
