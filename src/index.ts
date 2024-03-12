import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import jwt from 'jsonwebtoken';
import * as WebSocket from "ws";

import { Server } from "./Server";
import { connect } from "./database";
import synchronizeDB from "./database/Synchronize";

import wss from "./ServerSocket";

import { Message } from "./services/Message";

import { getEnv } from './config/env';

const { JWT_KEY } = getEnv();

const clients: WebSocket[] = [];

async function socket() {

  wss.on("connection", (ws: WebSocket, req: any) => {

    const session = new URLSearchParams(req.url?.split("?")[1]).get("session");

    clients.push(ws);

    ws.on("message", async (message: any) => {
      if (session) {
        try {
          var decoded: any = jwt.verify(session, JWT_KEY);
          if (decoded.user) {

            if (message instanceof Buffer) {
              message = JSON.parse(message?.toString());
            }

            if (message && message?.message) {
              await Message.save({ user: decoded.user, content: message?.message });
              const senderIndex = clients.indexOf(ws);
              clients.forEach((client, index) => {
                if (index !== senderIndex) {
                  client.send(JSON.stringify({ event: "message", message }));
                }
              });
            }
          }
        } catch (error) {
          $log.error("error socket", error.mensagem);
        }
      }
    });

    ws.on("close", () => {
      $log.info("Cliente desconectado do servidor WebSocket");
    });

  });


  function enviarEventosLoop() {
    // Evento: Liberado para apostar
    sendToAll(JSON.stringify({ event: "roulette", name: 'liberado', status: 'apostar' }));

    setTimeout(() => {
      // Evento: Encerrado para apostar
      sendToAll(JSON.stringify({ event: "roulette", name: 'encerrado', status: 'apostar' }));

      setTimeout(() => {
        // Evento: Começou a rodada
        sendToAll(JSON.stringify({ event: "roulette", name: 'comecou', status: 'rodada' }));

        setTimeout(() => {
          const number = Math.floor(Math.random() * 37);

          // Evento: Rodada finalizada
          sendToAll(JSON.stringify({ event: "roulette", name: 'finalizada', status: 'rodada', number }));

          setTimeout(enviarEventosLoop, 12000); // Reiniciar após 12 segundos
        }, 5000); // Tempo de espera após a rodada antes de reiniciar
      }, 10000); // Tempo de espera após liberar apostas antes de encerrar
    }, 8000); // Tempo de espera antes de liberar apostas
  }

  enviarEventosLoop();



}

function sendToAll(message: string) {
  clients.forEach(client => {
    client.send(message);
  });
}


async function bootstrap() {
  try {
    console.log("start server")
    const platform = await PlatformExpress.bootstrap(Server);

    await platform.listen();

    await socket();

    await connect();

    await synchronizeDB();

  } catch (error) {
    console.error("error status server", error)
  }
}

bootstrap(); 
