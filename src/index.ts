import { PlatformExpress } from "@tsed/platform-express";
import { Server } from "./Server";
import Database from "./database";
import wss from "./ServerSocket";
import * as WebSocket from "ws";

declare global {
  var database: Database;
  var clientsMapWebSocket: any;
}

const clients: WebSocket[] = [];

async function socket() {

  const clientsMapWebSocket = new Map<string, WebSocket>();

  wss.on("connection", (ws: WebSocket, req: any) => {

    const session = new URLSearchParams(req.url?.split("?")[1]).get("session");

    clients.push(ws);

    console.log("Cliente conectado ao servidor WebSocket");

    ws.on("message", (message: WebSocket.Data) => {
      if (message instanceof Buffer) {
        message = JSON.parse(message?.toString());
      }

      const senderIndex = clients.indexOf(ws);

      clients.forEach((client, index) => {
        if (index !== senderIndex) {
          client.send(JSON.stringify({ event: "message", message }));
        }
      });
      
    });

    ws.on("close", () => {
      console.log("Cliente desconectado do servidor WebSocket");
      global.clientsMapWebSocket = clientsMapWebSocket;
    });

  });


  function enviarEventosLoop() {
    sendToAll(JSON.stringify({ event: "roulette", name: 'start' }));
    setTimeout(() => {
      const number = Math.floor(Math.random() * 37);
      sendToAll(JSON.stringify({ event: "roulette", name: 'stop', number }));
      setTimeout(enviarEventosLoop, 9000);
    }, 5000);
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
    global.database = new Database();

  } catch (error) {
    console.error("error status server", error)
  }
}

bootstrap(); 
