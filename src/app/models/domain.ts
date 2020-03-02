interface IDomain {
  DomainId: number;
  Url: string;
  Active: number;
  Start_Date: Date;
  End_Date: Date;
}

export class Domain implements IDomain {
  DomainId: number;
  Url: string;
  Active: number;
  Start_Date: Date;
  End_Date: Date;

  constructor(DomainId: number, Url: string, Active: number, Start_Date: Date, End_Date: Date) {
    this.DomainId = DomainId;
    this.Url = Url;
    this.Active = Active;
    this.Start_Date = Start_Date;
    this.End_Date = End_Date;
  }
}
