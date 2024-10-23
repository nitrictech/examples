<p align="center"><a href="https://nitric.io" target="_blank"><img src="https://raw.githubusercontent.com/nitrictech/nitric/main/docs/assets/nitric-logo.svg" height="120"></a></p>

# Nitric TypeScript + Deno Starter Template

This is a TypeScript starter template for Nitric projects. It includes a simple HTTP function that returns a JSON response, which uses Deno for package management and runtime.

## About Nitric

This is a [Nitric](https://nitric.io) TypeScript project, but Nitric is a framework for rapid development of cloud-native and serverless applications in many languages.

## Learning Nitric

Nitric provides [documentation](https://nitric.io/docs) and [guides](https://nitric.io/docs/guides?langs=python) to help you get started quickly.

If can also join [Discord](https://nitric.io/chat) to chat with the community, or view the project on [GitHub](https://github.com/nitrictech/nitric).

## Running this project

To run this project you'll need the [Nitric CLI](https://nitric.io/docs/get-started/installation) installed, then you can use the CLI commands to run, build or deploy the project. You'll also need to install [Deno](https://docs.deno.com/runtime/getting_started/installation/) for dependency management.

Install the dependencies:

```bash
deno install
```

Next, start nitric services.

> This will automatically restart when you make changes to your functions

```bash
nitric start
```

You'll see your services connect in the terminal output.
