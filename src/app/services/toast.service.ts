import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { Toast } from '../models/Toast';

@Injectable()
export class ToastService {
  private subject: Subject<Toast>;

  public event: Observable<Toast>;

  public constructor(private translate: TranslateService) {
    this.subject = new Subject<Toast>();
    this.event = this.subject.asObservable();
  }

  /**
   * Publishes send data to toast.
   * @param data Toast data to publish.
   */
  public publish(data: Toast, translateKey: string) {
    // assign translated message
    if (translateKey) {
      this.translate.get(translateKey).subscribe(message => {
        console.log(data.Message, message);
        data.Message = data.Message.replace(/TRANSLATED-MESSAGE/g, message);

        this.subject.next(data);
      });
    }
  }
}
