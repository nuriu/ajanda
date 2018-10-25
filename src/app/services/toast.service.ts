import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Toast } from '../models/Toast';

@Injectable()
export class ToastService {
  private subject: Subject<Toast>;

  public event: Observable<Toast>;

  public constructor() {
    this.subject = new Subject<Toast>();
    this.event = this.subject.asObservable();
  }

  /**
   * Publishes send data to toast.
   * @param data Toast data to publish.
   */
  public publish(data: Toast) {
    this.subject.next(data);
  }
}
