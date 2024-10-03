package main

import (
	"fmt"

	"github.com/nitrictech/go-sdk/nitric"
	"github.com/nitrictech/go-sdk/nitric/apis"
)

func main() {
	api := nitric.NewApi("main")

	api.Get("/hello/:name", func(ctx *apis.Ctx) {
		name := ctx.Request.PathParams()["name"]
		ctx.Response.Body = []byte(fmt.Sprintf("Hello %s", name))
	})

	nitric.Run()
}
