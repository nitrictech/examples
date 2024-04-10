<p align="center"><a href="https://nitric.io" target="_blank"><img src="https://raw.githubusercontent.com/nitrictech/nitric/main/docs/assets/nitric-logo.svg" height="120"></a></p>

## About Nitric

This is a [Nitric](https://nitric.io) Python project, but Nitric is a framework for rapid development of cloud-native and serverless applications in many languages.

Using Nitric you define your apps in terms of the resources they need, then write the code for serverless function based APIs, event subscribers and scheduled jobs.

Apps built with Nitric can be deployed to AWS, Azure or Google Cloud all from the same code base so you can focus on your products, not your cloud provider.

Nitric makes it easy to:

- Create smart [serverless functions and APIs](https://nitric.io/docs/apis)
- Build reliable distributed apps that use [events](https://nitric.io/docs/messaging/topics) and/or [queues](https://nitric.io/docs/messaging/queues)
- Securely store, retrieve and rotate [secrets](https://nitric.io/docs/secrets)
- Read and write files from [buckets](https://nitric.io/docs/storage)

## Learning Nitric

Nitric provides detailed and intuitive [documentation](https://nitric.io/docs) and [guides](https://nitric.io/docs/getting-started) to help you get started quickly.

If you'd rather chat with the maintainers or community, come and join our [Discord](https://discord.gg/Webemece5C) server, [GitHub Discussions](https://github.com/nitrictech/nitric/discussions) or find us on [Twitter](https://twitter.com/nitric_io).

## Running this project

To run this project you'll need the [Nitric CLI](https://nitric.io/docs/installation) installed, then you can use the CLI commands to run, build or deploy the project.

Start by making sure the project's dependencies have been installed.

```bash
pipenv install --dev
```

Next, start nitric services.

```bash
nitric start
```

In another terminal, run your project.

> This will automatically restart when you make changes to your functions

```bash
pipenv run dev
```

You'll see your services connect in your nitric start terminal.