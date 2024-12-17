import { websocket, kv } from "@nitric/sdk";

// Initialize KV store for connections and a WebSocket
const kvStore = kv("connections").allow("get", "set", "delete");
const socket = websocket("example-websocket");

// Handle new connections
socket.on("connect", async (ctx) => {
  await kvStore.set(ctx.req.connectionId, {
    /* connection meta data here */
  });
});

// Handle disconnections
socket.on("disconnect", async (ctx) => {
  const disconnectedId = ctx.req.connectionId;
  await kvStore.delete(disconnectedId);
});

// Send messages
socket.on("message", async (ctx) => {
  const message = ctx.req.text();
  const connections = kvStore.keys();

  // Send the message to each connection
  try {
    for await (const connectionId of connections) {
      console.log(`send to ${connectionId} - ${message}`);
      await socket.send(connectionId, message);
    }
  } catch (error) {
    console.error("Error during message broadcasting:", error);
  }
});
