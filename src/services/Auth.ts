import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';

import { Login, Register, UpdatedPassword } from "../models/Auth";
import { Functions } from "../functions";
import { User } from "./User";

import { getEnv } from '../config/env';

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
      return { status: 200, message, session };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }


  static async authorization(session: string) {
    try {
      const token = session?.split(' ')[1];
      var decoded: any = jwt.verify(token, JWT_KEY);
      let user = await User.byId(decoded?.userId);
      if (user && user.length > 0) {
        user = user[0];
        return { status: 200, user: { id: user.user_id, name: user.user_name } };
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
      const response = await User.byEmail(data.address);
      if (response && response.length > 0) {
        const user = response[0];
        const validPassword = await Functions.comparePasswords(data.password, user.user_password);
        if (!validPassword) {
          throw new Error("invalid password");
        }

        const session = this.generateSession({ userId: user.user_id });

        return { status: 200, session };
      } else {
        throw new Error("email not found");
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }


  /**
   * Cria a conta do usuario
   * @param data dados de cadastro do usuario
   * @returns caso a conta seja criado com sucesso faz login e retorna status e sessao
   */
  static async register(data: Register) {
    try {
      if (!data.name) {
        throw new Error("enter name first");
      }
      if (!data.email) {
        throw new Error("enter email first");
      }

      if (!EmailValidator.validate(data.email)) {
        throw new Error("Invalid email");
      }
      if (!data.password) {
        throw new Error("enter password first");
      }

      const response = await User.byEmail(data.email);
      if (response && response.length > 0) {
        throw new Error("an account already uses this email");
      }
      const user = await User.save(data);
      if (user.insertId) {
        const session = this.generateSession({ userId: user.insertId });

        return { status: 200, session };
      } else {
        throw new Error("Error saving to DB");
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
