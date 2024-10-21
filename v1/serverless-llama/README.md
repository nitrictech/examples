<p align="center"><a href="https://nitric.io" target="_blank"><img src="https://raw.githubusercontent.com/nitrictech/nitric/main/docs/assets/nitric-logo.svg" height="120"></a></p>

# Using an Llama model with serverless compute

This guide will walk you through setting up a lightweight translation service using the Llama model, combined with Nitric for API routing and bucket storage.

By leveraging serverless compute, you'll be able to deploy and run a machine learning model with minimal infrastructure overhead, making it a great fit for handling dynamic workloads such as real-time text translation.

## About Nitric

This is a [Nitric](https://nitric.io) Python project, but Nitric is a framework for rapid development of cloud-native and serverless applications in many languages.

## Learning Nitric

Nitric provides [documentation](https://nitric.io/docs) and [guides](https://nitric.io/docs/guides?langs=python) to help you get started quickly.

If can also join [Discord](https://nitric.io/chat) to chat with the community, or view the project on [GitHub](https://github.com/nitrictech/nitric).

## Running this project

To run this project you'll need the [Nitric CLI](https://nitric.io/docs/get-started/installation) installed, then you can use the CLI commands to run, build or deploy the project. You'll also need to install [uv](https://github.com/astral-sh/uv) for dependency management.

Install the dependencies:

```bash
uv sync
```

Next, start nitric services.

> This will automatically restart when you make changes to your functions

```bash
nitric start
```

You'll see your services connect in the terminal output.
