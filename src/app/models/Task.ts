export class Task {
  public id: string;
  public title: string;
  public body: string;
  public start: string;
  public end: string;
  public tags: Array<string>;
  public isDone: boolean;

  public constructor(init?: Partial<Task>) {
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
