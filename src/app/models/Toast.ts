export class Toast {
  public Message: string;
  public Type: TOAST_TYPES;

  public constructor(init?: Partial<Toast>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export enum TOAST_TYPES {
  PRIMARY = 'PRIMARY',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}
