package main

import (
	"fmt"

	"github.com/nitrictech/go-sdk/nitric"
	"github.com/nitrictech/go-sdk/nitric/topics"
	"github.com/nitrictech/templates/go-starter/resources"
)

func main() {
	resources.Get().NotifyTopic.Subscribe(func(ctx *topics.Ctx) {
		fmt.Println("Received message: ", ctx.Request.Message())
		// notify on discord or slack etc
	})

	nitric.Run()

	fmt.Println("Notify service has started")
}
