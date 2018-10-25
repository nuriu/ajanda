export class Toast {
  public Message: string;
  public Type: TOAST_TYPES;
  public Visible: boolean;
  public Duration: number;

  public constructor(init?: Partial<Toast>) {
    this.Visible = true;
    this.Duration = 2000;

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
