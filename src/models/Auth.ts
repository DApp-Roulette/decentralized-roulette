import { Property } from "@tsed/common";

export class Login {
  @Property()
  signature: string;
  @Property()
  address: string;
  @Property()
  session: string;
}
 