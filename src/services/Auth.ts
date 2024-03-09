import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';

import { Login } from "../models/Auth";
import { Functions } from "../functions";
import { getEnv } from '../config/env';

import { MessageToSigns } from '../database/MessageToSigns';
import { Users } from '../database/Users';

const { JWT_KEY } = getEnv();

export class ServiceAuth {

  /**
    * Starts the session.
    * @returns {Object} An object containing the status, message, and session.
    */
  static async start(): Promise<object> {
    try {
      const session = Functions.generateRandomToken(20);
      const message = `Sign this message to validate your session\nSession:${session}`;
      await MessageToSigns.create({ session, message, date_time: new Date });
      return { status: 200, message, session };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  static async authorization(session: string) {
    try {
      const token = session?.split(' ')[1];
      var decoded: any = jwt.verify(token, JWT_KEY);
      if (decoded) {
        const user = await Users.findByPk(decoded.user);
        return { status: 200, user };
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  /**
   * Autentica um usuário com base nas informações fornecidas.
   *
   * @param data - As informações de autenticação do usuário.
   * @returns Um objeto contendo o status da autenticação, uma possível mensagem de erro e uma sessão (se a autenticação for bem-sucedida).
   */
  static async login(data: Login) {
    try {
      const { session, address, signature } = data;

      const response = await MessageToSigns.findOne({ where: { session } });

      if (response) {

        const { message } = response.dataValues;
        const verify = ethers.verifyMessage(message, signature);
        if (!verify) {
          throw new Error("It seems that it wasn't you who signed the message");
        }

        await MessageToSigns.destroy({ where: { session } });

        const user = await Users.findOne({ where: { address } });

        if (user) {
          const session = this.generateSession({ user: user.id, address });
          return { status: 200, session };
        } else {
          const user = await Users.create({ address, user_name: address, registration_date: new Date });
          const { id } = user;
          const session = this.generateSession({ user: id, address });
          return { status: 200, session };
        }
      } else {
        throw new Error("email not found");
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }


  static generateSession(payload: any) {
    try {
      return jwt.sign(payload, JWT_KEY, { expiresIn: '7d' });
    } catch (error) {
      throw error;
    }
  }
}
