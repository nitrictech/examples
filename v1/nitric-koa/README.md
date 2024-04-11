<p align="center">
  <a href="https://nitric.io">
    <img src="https://raw.githubusercontent.com/nitrictech/nitric/main/docs/assets/nitric-logo.svg" width="120" alt="Nitric Logo"/>
  </a>
</p>

<p align="center">
  A fast & fun way to build portable cloud-native applications
</p>

<p align="center">
  <img alt="GitHub release (latest SemVer)" src="https://img.shields.io/github/v/release/nitrictech/nitric?sort=semver">
  <a href="https://twitter.com/nitric_io">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/nitric_io?label=Follow&style=social">
  </a>
  <a href="https://nitric.io/chat"><img alt="Discord" src="https://img.shields.io/discord/955259353043173427?label=discord"></a>
</p>

## Project Description

Simple & secure direct-to-bucket (e.g. S3) file uploads from modern browsers with signed URLs using the Koa framework for APIs and the Nitric SDK for bucket and file access.

## Usage

### Step 1: Install Nitric

Follow the steps in the [installation guide](https://nitric.io/docs/installation)

### Step 2: Run your Nitric project locally

```bash
yarn install
nitric start
```

### Step 3: Test the API

Upload url -

```bash
curl localhost:4001/upload/1234

{"url":"http://localhost:38501/images/images/abc/photo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dummykey%2F20230427%2F%2Fs3%2Faws4_request&X-Amz-Date=20230427T185305Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&x-id=PutObject&X-Amz-Signature=fbf8413a9af86fc7f0a1d69a82d8044f0405f10b0fdba14689c4cb69f07aab6e"}
```

## About Nitric

[Nitric](https://nitric.io) is a framework for rapid development of cloud-native and serverless applications. Define your apps in terms of the resources they need, then write the code for serverless function based APIs, event subscribers and scheduled jobs.

Apps built with Nitric can be deployed to AWS, Azure or Google Cloud all from the same code base so you can focus on your products, not your cloud provider.

Nitric makes it easy to:

- Create smart serverless functions and APIs
- Build reliable distributed apps that use events and/or queues
- Securely store and retrieve secrets
- Read and write files from buckets

## Documentation

The full documentation is available at [nitric.io/docs](https://nitric.io/docs).

We're completely open-source and encourage [code contributions](https://nitric.io/docs/contributions).

## Get in touch

- Ask questions in [GitHub discussions](https://github.com/nitrictech/nitric/discussions)

- Find us on [Twitter](https://twitter.com/nitric_io)

- Send us an [email](mailto:maintainers@nitric.io)

- Jump into our [Discord server](https://nitric.io/chat)
