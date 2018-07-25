interface ITag {
  Name: string;
  Pages: Array<number>;
}

export class Tag implements ITag {
  Name: string;
  Pages: Array<number>;

  constructor(Name: string, Pages: Array<number>) {
    this.Name = Name;
    this.Pages = Pages;
  }
}
