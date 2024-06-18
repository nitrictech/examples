package main

import (
	"fmt"

	"github.com/nitrictech/go-sdk/handler"
	"github.com/nitrictech/go-sdk/nitric"
)

func main() {
	api, err := nitric.NewApi("main")
	if err != nil {
		return
	}

	api.Get("/hello/:name", func(ctx *handler.HttpContext, next handler.HttpHandler) (*handler.HttpContext, error) {
		name := ctx.Request.PathParams()["name"]
		ctx.Response.Body = []byte(fmt.Sprintf("Hello %s", name))

		return next(ctx)
	})

	if err := nitric.Run(); err != nil {
		fmt.Println(err)
	}

	fmt.Println("Service has started")
}
