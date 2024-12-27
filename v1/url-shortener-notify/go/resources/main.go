package resources

import (
	"sync"

	"github.com/nitrictech/go-sdk/nitric"
	"github.com/nitrictech/go-sdk/nitric/apis"
	"github.com/nitrictech/go-sdk/nitric/keyvalue"
	"github.com/nitrictech/go-sdk/nitric/topics"
)

type Resource struct {
	MainApi     apis.Api
	UrlKvStore  keyvalue.KvStore
	NotifyTopic topics.SubscribableTopic
}

var (
	resource     *Resource
	resourceOnce sync.Once
)

func Get() *Resource {
	resourceOnce.Do(func() {
		mainApi := nitric.NewApi("main")

		resource = &Resource{
			MainApi:     mainApi,
			UrlKvStore:  nitric.NewKv("urls"),
			NotifyTopic: nitric.NewTopic("notify"),
		}
	})

	return resource
}
