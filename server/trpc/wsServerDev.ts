import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
import { appRouter } from "./appRouter";
import { createContext } from "./trpc";

const WS_PORT = parseInt(process.env.NEXT_PUBLIC_WS_PORT!);

const wss = new ws.Server({ port: WS_PORT });

const handler = applyWSSHandler({ wss, router: appRouter, createContext });
wss.on("connection", (ws) => {
  console.log(`➕ Web Socket Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖ Web Socket Connection (${wss.clients.size})`);
  });
});

console.log(`✅ WebSocket Server listening on port ${WS_PORT}`);

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
