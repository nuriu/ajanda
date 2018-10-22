export class SettingsSchema {
  public locale: string;
  public recentlyOpenedFiles: Array<string>;

  public constructor(init?: Partial<SettingsSchema>) {
    this.locale = 'en';
    this.recentlyOpenedFiles = new Array<string>();

    if (init) {
      Object.assign(this, init);
    }
  }
}
