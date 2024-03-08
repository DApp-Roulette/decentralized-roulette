import { BodyParams, Controller, Post, Description, Delete, QueryParams, Email, HeaderParams, Get } from "@tsed/common";

import { Message } from "../services/Message";

@Controller('/api/message')
export class MessageController {

  @Get("/list")
  @Description("Listar as mensagens recentes")
  async Session() {
    return await Message.list(50);
  }
}
