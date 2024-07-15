package main

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"

	"github.com/nitrictech/examples/v1/url-shortener/resources"
	"github.com/nitrictech/go-sdk/handler"
	"github.com/nitrictech/go-sdk/nitric"
)

func generateShortCode() string {
	s := ""
	for i := 0; i < 6; i++ {
		s += string(rand.Intn(26) + 97)
	}

	return s
}

var shortenData struct {
	Url string `json:"url"`
}

func main() {
	urlKvStore, err := resources.Get().UrlKvStore.Allow(nitric.KvStoreSet, nitric.KvStoreGet)
	if err != nil {
		panic(err)
	}

	topicPublish, err := resources.Get().NotifyTopic.Allow(nitric.TopicPublish)
	if err != nil {
		panic(err)
	}

	resources.Get().MainApi.Post("/shorten", func(ctx *handler.HttpContext, next handler.HttpHandler) (*handler.HttpContext, error) {
		err := json.Unmarshal(ctx.Request.Data(), &shortenData)
		if err != nil {
			ctx.Response.Status = http.StatusBadRequest
			ctx.Response.Body = []byte("Invalid JSON")
			return next(ctx)
		}

		if strings.TrimSpace(shortenData.Url) == "" {
			ctx.Response.Status = 400
			ctx.Response.Body = []byte("URL is required")
			return next(ctx)
		}

		shortCode := generateShortCode()

		err = urlKvStore.Set(context.Background(), shortCode, map[string]interface{}{
			"url": shortenData.Url,
		})
		if err != nil {
			ctx.Response.Status = 500
			ctx.Response.Body = []byte("Error shortening URL")
			return next(ctx)
		}

		// notify the topic
		err = topicPublish.Publish(context.Background(), map[string]interface{}{
			"shortCode": shortCode,
			"url":       shortenData.Url,
		})
		if err != nil {
			ctx.Response.Status = 500
			ctx.Response.Body = []byte("Error notifying topic")
			return next(ctx)
		}

		for key, val := range ctx.Request.Headers() {
			fmt.Println(key, val)
		}

		origin := ""
		if val, ok := ctx.Request.Headers()["X-Forwarded-For"]; ok {
			origin = val[0]
		} else if val, ok := ctx.Request.Headers()["x-forwarded-for"]; ok {
			origin = val[0]
		}

		ctx.Response.Body = []byte(fmt.Sprintf("%s/%s", origin, shortCode))

		return next(ctx)
	})

	resources.Get().MainApi.Get("/:code", func(ctx *handler.HttpContext, next handler.HttpHandler) (*handler.HttpContext, error) {
		code := ctx.Request.PathParams()["code"]

		data, err := urlKvStore.Get(context.Background(), code)
		// perform a 301 redirect to the long URL
		if err == nil {
			ctx.Response.Headers["Location"] = []string{data["url"].(string)}
			ctx.Response.Status = 301
		} else {
			fmt.Println("Error getting URL: ", err)
			ctx.Response.Status = 404
		}

		return next(ctx)
	})

	if err := nitric.Run(); err != nil {
		fmt.Println(err)
	}

	fmt.Println("Shortner service has started")
}
