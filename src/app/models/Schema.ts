import { Calendar } from './Calendar';
import { Tag } from './Tag';
import { Task } from './Task';

export class Schema {
  public name: string;
  public password: string;
  public calendars: Array<Calendar>;
  public tags: Array<Tag>;
  public tasks: Array<Task>;

  public constructor(init?: Partial<Schema>) {
    this.name = '';
    this.password = '';
    this.calendars = new Array<Calendar>();
    this.tags = new Array<Tag>();
    this.tasks = new Array<Task>();

    if (init) {
      Object.assign(this, init);
    }
  }
}
