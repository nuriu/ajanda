import { Entity } from './Entity';

export class Task extends Entity {
  public title: string;
  public body: string;
  public start: string;
  public end: string;
  public tags: Array<string>;
  public isDone: boolean;

  public constructor(init?: Partial<Task>) {
    super();

    this.id = '';
    this.title = '';
    this.body = '';
    this.start = '';
    this.end = '';
    this.tags = new Array<string>();
    this.isDone = false;

    if (init) {
      Object.assign(this, init);
    }
  }
}
