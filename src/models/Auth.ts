import { Property } from "@tsed/common";

export class Login {
  @Property()
  signature: string;
  @Property()
  address: string;
}
export class Register {
  @Property()
  name: string;
  @Property()
  email: string;
  @Property()
  password: string;
}


export class UpdatedPassword {
  @Property()
  code: string;
  @Property()
  password: string;
}
