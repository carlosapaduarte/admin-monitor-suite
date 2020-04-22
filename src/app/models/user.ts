interface IUser {
  UserId: number;
  Email: string;
  Type: string;
  Register_Date: Date;
  Last_Login: Date;
}

export class User implements IUser {
  UserId: number;
  Email: string;
  Type: string;
  Register_Date: Date;
  Last_Login: Date;

  constructor(UserId: number, Email: string, Type: string, Register_Date: Date, Last_Login: Date) {
    this.UserId = UserId;
    this.Email = Email;
    this.Type = Type;
    this.Register_Date = Register_Date;
    this.Last_Login = Last_Login;
  }
}
