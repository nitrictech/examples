package resources

import (
	"sync"

	"github.com/nitrictech/go-sdk/nitric"
	"github.com/nitrictech/go-sdk/nitric/apis"
	"github.com/nitrictech/go-sdk/nitric/keyvalue"
)

type Resource struct {
	MainApi    apis.Api
	UrlKvStore keyvalue.KvStore
}

var (
	resource     *Resource
	resourceOnce sync.Once
)

func Get() *Resource {
	resourceOnce.Do(func() {
		mainApi := nitric.NewApi("main")

		resource = &Resource{
			MainApi:    mainApi,
			UrlKvStore: nitric.NewKv("urls"),
		}
	})

	return resource
}
