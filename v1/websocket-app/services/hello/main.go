package main

import (
	"context"
	"fmt"

	"github.com/nitrictech/go-sdk/handler"
	"github.com/nitrictech/go-sdk/nitric"
)

func main() {
	ws, err := nitric.NewWebsocket("public")
	if err != nil {
		fmt.Println("Error creating WebSocket:", err)
		return
	}

	connections, err := nitric.NewKv("connections").Allow(nitric.KvStoreGet, nitric.KvStoreSet, nitric.KvStoreDelete)
	if err != nil {
		fmt.Println("Error creating KV store:", err)
		return
	}

	ws.On(handler.WebsocketConnect, func(ctx *handler.WebsocketContext, next handler.WebsocketHandler) (*handler.WebsocketContext, error) {
		err := connections.Set(context.TODO(), ctx.Request.ConnectionID(), map[string]interface{}{
			"connectionId": ctx.Request.ConnectionID(),
		})
		if err != nil {
			return ctx, err
		}

		return next(ctx)
	})

	ws.On(handler.WebsocketDisconnect, func(ctx *handler.WebsocketContext, next handler.WebsocketHandler) (*handler.WebsocketContext, error) {
		err := connections.Delete(context.TODO(), ctx.Request.ConnectionID())
		if err != nil {
			return ctx, err
		}

		return next(ctx)
	})

	ws.On(handler.WebsocketMessage, func(ctx *handler.WebsocketContext, next handler.WebsocketHandler) (*handler.WebsocketContext, error) {
		connectionStream, err := connections.Keys(context.TODO())
		if err != nil {
			return ctx, err
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
			err = ws.Send(context.TODO(), connectionId, []byte(message))
			if err != nil {
				return ctx, err
			}
		}

		return next(ctx)
	})

	if err := nitric.Run(); err != nil {
		fmt.Println("Error running Nitric service:", err)
	}
}
