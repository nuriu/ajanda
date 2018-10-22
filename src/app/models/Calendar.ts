export class Calendar {
  public id: string;
  public name: string;
  public colorCode: string;
  public tasks: Array<string>;

  public constructor(init?: Partial<Calendar>) {
    this.id = '';
    this.name = '';
    this.colorCode = '';
    this.tasks = new Array<string>();

    if (init) {
      Object.assign(this, init);
    }
  }
}
