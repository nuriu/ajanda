export class Tag {
  public id: string;
  public name: string;

  public constructor(init?: Partial<Tag>) {
    this.id = '';
    this.name = '';

    if (init) {
      Object.assign(this, init);
    }
  }
}
