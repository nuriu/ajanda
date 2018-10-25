import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast, TOAST_TYPES } from '../../models/Toast';
import { LoggerService, LOG_LEVELS } from '../../services/logger.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  message: string;
  type: TOAST_TYPES;
  visible: boolean;

  private subscription: Subscription;

  constructor(private toastService: ToastService, private logger: LoggerService) {
    this.visible = false;
  }

  ngOnInit() {
    this.logger.log('ToastComponent initialized.', LOG_LEVELS.LIFECYCLE);

    this.subscription = this.toastService.event.subscribe((data: Toast) => {
      console.log(data);
      this.message = data.Message;
      this.type = data.Type;
      this.visible = true;

      setTimeout(() => {
        this.visible = false;
      }, data.Duration);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
