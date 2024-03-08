import { $log } from "@tsed/common";

import { Messages } from "../database/Messages";


interface MessageData {
  user: number;
  content: string;
}

export class Message {

  static async save(data: MessageData) {
    try {
      await Messages.create({ userId: data.user, content: data.content, date_sent: new Date })
    } catch (error) {
      $log.error(error.message);
    }
  }

  static async list(limit: number) {
    try {
      const messages = await Messages.findAll({
        order: [['date_sent', 'DESC']],
        limit: limit
      });
      return messages;
    } catch (error) {
      $log.error(error.message);
    }
  }

}
