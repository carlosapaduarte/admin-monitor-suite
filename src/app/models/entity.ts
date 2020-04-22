interface IEntity {
  EntityId: number;
  Short_Name: string;
  Long_Name: string;
  Creation_Date: Date;
}

export class Entity implements IEntity {
  EntityId: number;
  Short_Name: string;
  Long_Name: string;
  Creation_Date: Date;

  constructor(EntityId: number, Short_Name: string, Long_Name: string, Creation_Date: Date) {
    this.EntityId = EntityId;
    this.Short_Name = Short_Name;
    this.Long_Name = Long_Name;
    this.Creation_Date = Creation_Date;
  }
}
