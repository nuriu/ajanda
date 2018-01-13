export interface Label {
  Id: Number;
  Name: String;
  ColorCode: String;
  Description?: String;
}

export interface Event {
  Id: Number;
  Title: String;
  StartDate: Date;
  FinishDate: Date;
  Labels?: Array<Label>;
}

export interface Task {
  Id: Number;
  Name: String;
  FinishDate: Date;
  RepeatDays?: Number;
  Description?: String;
  Labels?: Array<Label>;
}
