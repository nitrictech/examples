package main

import (
	"context"
	"fmt"

	"github.com/nitrictech/go-sdk/nitric"
	"github.com/nitrictech/go-sdk/nitric/keyvalue"
	"github.com/nitrictech/go-sdk/nitric/websockets"
)

func main() {
	// Create a WebSocket endpoint named "public".
	ws := nitric.NewWebsocket("public")

	// Initialize a KV store named "connections" with Get, Set, and Delete permissions.
	connections := nitric.NewKv("connections").Allow(keyvalue.KvStoreGet, keyvalue.KvStoreSet, keyvalue.KvStoreDelete)

	// Handle new WebSocket connections by storing the connection ID in the KV store.
	ws.On(websockets.EventType_Connect, func(ctx *websockets.Ctx) {
		err := connections.Set(context.Background(), ctx.Request.ConnectionID(), map[string]interface{}{
			"connectionId": ctx.Request.ConnectionID(),
		})
		if err != nil {
			return
		}
	})

	ws.On(websockets.EventType_Disconnect, func(ctx *websockets.Ctx) {
		err := connections.Delete(context.Background(), ctx.Request.ConnectionID())
		if err != nil {
			return
		}
	})

	ws.On(websockets.EventType_Message, func(ctx *websockets.Ctx) {
		connectionStream, err := connections.Keys(context.Background())
		if err != nil {
			return
		}

		senderId := ctx.Request.ConnectionID()

		for {
			connectionId, err := connectionStream.Recv()
			if err != nil {
				break
			}

			if connectionId == senderId {
				continue
			}

			message := fmt.Sprintf("%s: %s", senderId, ctx.Request.Message())
			err = ws.Send(context.Background(), connectionId, []byte(message))
			if err != nil {
				return
			}
		}
	})

	nitric.Run()
}
