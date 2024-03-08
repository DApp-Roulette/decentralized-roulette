import { Login, Register, UpdatedPassword } from "../models/Auth";
import { ServiceAuth } from "../services/Auth";
import { BodyParams, Controller, Post, Description, Delete, QueryParams, Email, HeaderParams, Get } from "@tsed/common";

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

  @Delete("/logout")
  @Description("Endpoint para criar uma conta")
  async Logout(@QueryParams("session") session: string) {
    return await ServiceAuth.logout(session);
  }

}
