import { getEnv } from './config/env';
const { PORT_SOCKET } = getEnv();
import * as WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8000 });


export default wss;
