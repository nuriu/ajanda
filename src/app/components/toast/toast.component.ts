import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast } from '../../models/Toast';
import { LoggerService, LOG_LEVELS } from '../../services/logger.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Array<Toast>;

  private subscription: Subscription;

  constructor(
    private toastService: ToastService,
    private logger: LoggerService
  ) {
    this.toasts = new Array<Toast>();
  }

  ngOnInit() {
    this.logger.log('ToastComponent initialized.', LOG_LEVELS.LIFECYCLE);

    this.subscription = this.toastService.event.subscribe((data: Toast) => {
      this.addToast(data);
    });
  }

  private addToast(toast: Toast) {
    this.toasts.push(toast);
    setTimeout(() => {
      this.toasts.reverse().pop();
    }, toast.Duration);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
