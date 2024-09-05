package main

import (
	"context"
	"fmt"

	"github.com/nitrictech/go-sdk/handler"
	"github.com/nitrictech/go-sdk/nitric"
)

func main() {
	helloTypescriptTopic, _ := nitric.NewTopic("hello-typescript").Allow(nitric.TopicPublish)
	helloGolangTopic := nitric.NewTopic("hello-golang")
	api, err := nitric.NewApi("main")

	if err != nil {
		fmt.Println(err)
		return
	}

	helloGolangTopic.Subscribe(func(ctx *handler.MessageContext, next handler.MessageHandler) (*handler.MessageContext, error) {
		fmt.Println("Received message from Typescript")
		return next(ctx)
	})

	api.Get("/hello-typescript", func(ctx *handler.HttpContext, next handler.HttpHandler) (*handler.HttpContext, error) {
		ctx.Response.Body = []byte("Saying hello to typescript from Golang")

		helloTypescriptTopic.Publish(context.TODO(), map[string]interface{}{
			"message": "Hello from Golang",
		})

		return next(ctx)
	})

	if err := nitric.Run(); err != nil {
		fmt.Println(err)
	}

	fmt.Println("Service has started")
}
