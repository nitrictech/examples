package resources

import (
	"sync"

	"github.com/nitrictech/go-sdk/nitric"
)

type Resource struct {
	MainApi     nitric.Api
	UrlKvStore  nitric.KvStore
	NotifyTopic nitric.SubscribableTopic
}

var (
	resource     *Resource
	resourceOnce sync.Once
)

func Get() *Resource {
	resourceOnce.Do(func() {
		mainApi, err := nitric.NewApi("main")
		if err != nil {
			panic(err)
		}

		resource = &Resource{
			MainApi:     mainApi,
			UrlKvStore:  nitric.NewKv("urls"),
			NotifyTopic: nitric.NewTopic("notify"),
		}
	})

	return resource
}
