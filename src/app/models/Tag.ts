export class Tag {
  public id: string;
  public name: string;
  public enabled: boolean;

  public constructor(init?: Partial<Tag>) {
    this.id = '';
    this.name = '';
    this.enabled = false;

    if (init) {
      Object.assign(this, init);
    }
  }
}
