package main

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"

	"github.com/nitrictech/go-sdk/nitric"
	"github.com/nitrictech/go-sdk/nitric/apis"
	"github.com/nitrictech/go-sdk/nitric/keyvalue"
	"github.com/nitrictech/go-sdk/nitric/topics"
	"github.com/nitrictech/templates/go-starter/resources"
)

func generateShortCode() string {
	s := ""
	for i := 0; i < 6; i++ {
		s += string(rand.Intn(26) + 97) // Generate a lowercase letter
	}

	return s
}

var shortenData struct {
	Url string `json:"url"`
}

func main() {
	// Initialize the resources defined in resources.go
	urlKvStore := resources.Get().UrlKvStore.Allow(keyvalue.KvStoreSet, keyvalue.KvStoreGet)

	topicPublish := resources.Get().NotifyTopic.Allow(topics.TopicPublish)

	// POST /shorten - Shorten a given URL
	resources.Get().MainApi.Post("/shorten", func(ctx *apis.Ctx) {
		err := json.Unmarshal(ctx.Request.Data(), &shortenData)
		if err != nil || strings.TrimSpace(shortenData.Url) == "" {
			ctx.Response.Status = http.StatusBadRequest
			ctx.Response.Body = []byte("Invalid or missing URL")
			return
		}

		shortCode := generateShortCode()
		// Store the mapping of short code -> original URL
		err = urlKvStore.Set(context.Background(), shortCode, map[string]interface{}{
			"url": shortenData.Url,
		})
		if err != nil {
			ctx.Response.Status = 500
			ctx.Response.Body = []byte("Error shortening URL")
			return
		}

		// notify the topic
		err = topicPublish.Publish(context.Background(), map[string]interface{}{
			"shortCode": shortCode,
			"url":       shortenData.Url,
		})
		if err != nil {
			ctx.Response.Status = 500
			ctx.Response.Body = []byte("Error notifying topic")
		}

		// Extract the origin from headers (for demonstration), then return the short URL
		origin := ""
		if val, ok := ctx.Request.Headers()["X-Forwarded-For"]; ok {
			origin = val[0]
		} else if val, ok := ctx.Request.Headers()["x-forwarded-for"]; ok {
			origin = val[0]
		}

		ctx.Response.Body = []byte(fmt.Sprintf("%s/%s", origin, shortCode))
	})

	// GET /:code - Redirect to the original URL associated with the short code
	resources.Get().MainApi.Get("/:code", func(ctx *apis.Ctx) {
		code := ctx.Request.PathParams()["code"]

		data, err := urlKvStore.Get(context.Background(), code)
		if err == nil {
			ctx.Response.Headers["Location"] = []string{data["url"].(string)}
			ctx.Response.Status = 301
		} else {
			fmt.Println("Error getting URL: ", err)
			ctx.Response.Status = 404
		}
	})

	nitric.Run()
}
