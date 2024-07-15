package main

import (
	"fmt"

	"github.com/nitrictech/examples/v1/url-shortener/resources"
	"github.com/nitrictech/go-sdk/handler"
	"github.com/nitrictech/go-sdk/nitric"
)

func main() {
	resources.Get().NotifyTopic.Subscribe(func(ctx *handler.MessageContext, next handler.MessageHandler) (*handler.MessageContext, error) {
		fmt.Println("Received message: ", ctx.Request.Message())
		// notify on discord or slack etc

		return ctx, nil
	})

	if err := nitric.Run(); err != nil {
		fmt.Println(err)
	}

	fmt.Println("Notify service has started")
}
