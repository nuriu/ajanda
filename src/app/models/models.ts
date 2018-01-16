/**
 * Labels for classifying events and tasks.
 */
export class Label {
  /**
   * Unique identifier.
   */
  Id: number;
  /**
   * Name of the label.
   */
  Name: string;
  /**
   * Color code for label background.
   */
  ColorCode: string;
  /**
   * Description of label.
   */
  Description?: string;

  /**
   * Class initializer.
   * @param init Initialization values.
   */
  public constructor(init?: Partial<Label>) {
    Object.assign(this, init);
  }
}

/**
 * Events with name that has start and finish dates.
 */
export class Event {
  /**
   * Unique identifier.
   */
  Id: number;
  /**
   * Title of the event.
   */
  Title: string;
  /**
   * Starting date.
   */
  StartDate: Date;
  /**
   * Due date.
   */
  FinishDate: Date;
  /**
   * Labels that this event has.
   */
  Labels?: Array<Label>;

  /**
   * Class initializer.
   * @param init Initialization values.
   */
  public constructor(init?: Partial<Event>) {
    Object.assign(this, init);
  }
}

/**
 * Tasks that has deadlines.
 */
export class Task {
  /**
   * Unique identifier.
   */
  Id: number;
  /**
   * Task name.
   */
  Name: string;
  /**
   * Due date.
   */
  FinishDate: Date;
  /**
   * Repeat after days.
   */
  RepeatDays?: number;
  /**
   * Task description.
   */
  Description?: string;
  /**
   * Labels given to this task.
   */
  Labels?: Array<Label>;

  /**
   * Class initializer.
   * @param init Initialization values.
   */
  public constructor(init?: Partial<Task>) {
    Object.assign(this, init);
  }
}

/**
 * Base data file for storing everything.
 */
export class DataFile {
  LABELS: Array<Label>;
  EVENTS: Array<Event>;
  TASKS: Array<Task>;
}

/**
 * Day.
 */
export class Day {
  /**
   * Number of day at month. (1-31)
   */
  Nu: number;
  /**
   * Events assigned to day.
   */
  Events: Array<Event>;
  /**
   * Tasks assigned to day.
   */
  Tasks: Array<Task>;

  /**
   * Class initializer.
   * @param init Initialization values.
   */
  public constructor(init?: Partial<Day>) {
    Object.assign(this, init);
  }
}

/**
 * Month.
 */
export class Month {
  /**
   * Year that month belongs to.
   */
  Year: number;
  /**
   * Number of month at year. (1-12)
   */
  Month: number;
  /**
   * Days in month.
   */
  Days: Array<Day>;

  /**
   * Class initializer.
   * @param init Initialization values.
   */
  public constructor(init?: Partial<Month>) {
    Object.assign(this, init);
  }
}
