export class Label {
  Id: number;
  Name: string;
  ColorCode: string;
  Description?: string;

  public constructor(init?: Partial<Label>) {
    Object.assign(this, init);
  }
}

export class Event {
  Id: number;
  Title: string;
  StartDate: Date;
  FinishDate: Date;
  Labels?: Array<Label>;

  public constructor(init?: Partial<Event>) {
    Object.assign(this, init);
  }
}

export class Task {
  Id: number;
  Name: string;
  FinishDate: Date;
  RepeatDays?: number;
  Description?: string;
  Labels?: Array<Label>;

  public constructor(init?: Partial<Task>) {
    Object.assign(this, init);
  }
}

export class DataFile {
  LABELS: Array<Label>;
  EVENTS: Array<Event>;
  TASKS: Array<Task>;
}
