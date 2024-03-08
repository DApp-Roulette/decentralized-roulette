import { Login } from "../models/Auth";
import { ServiceAuth } from "../services/Auth";
import { BodyParams, Controller, Post, Description, HeaderParams, Get } from "@tsed/common";

@Controller('/api/auth')
export class AuthController {

  @Get("/start")
  @Description("Endpoint to create a session")
  async Start() {
    return await ServiceAuth.start();
  }

  @Get("/session")
  @Description("Endpoint to validate session")
  async Session(@HeaderParams("Authorization") session: string) {
    return await ServiceAuth.authorization(session);
  }

  @Post("/login")
  @Description("Endpoint for login authentication")
  async Auth(@BodyParams() data: Login) {
    return await ServiceAuth.login(data);
  }

}
