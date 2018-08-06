interface IWebsite {
  WebsiteId: number;
  Name: string;
}

export class Website implements IWebsite {
  WebsiteId: number;
  Name: string;

  constructor(WebsiteId: number, Name: string) {
    this.WebsiteId = WebsiteId;
    this.Name = Name;
  }
}