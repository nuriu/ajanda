import { Entity } from './Entity';

export class Tag extends Entity {
  public name: string;
  public colorCode: string;
  public enabled: boolean;

  public constructor(init?: Partial<Tag>) {
    super();

    this.id = '';
    this.name = '';
    this.colorCode = '';
    this.enabled = false;

    if (init) {
      Object.assign(this, init);
    }
  }
}
