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

This sample project create a survey (questionnaire) using zod and auth0 passwordless to handle login.
Users can save and resume their survey before submitting.

## Usage

### Step 1: Install Nitric

Follow the steps in the [installation guide](https://nitric.io/docs/installation)

### Step 2: Setup Auth0

> Note: If you don't want to use Auth, you can use the ui-noauth version of the UI. Without Auth0, there is no user session, and therefore save and resume functionality is disabled. Skip to step 4 and use the ui-noauth solution for all steps involving the UI project.

1. Create an Auth0 account.
2. Create a regular web application
3. Disable all existing connections
4. In Authentication -> Passwordless enable email
5. Now head back to connections in your existing connections and enable passwordless -> email.

### Step 3: Setup your creds in .env

Create a copy of the env.local file in the ui project and update the value from your Auth0 profile.

AUTH0_SECRET=\***\*\*\*\*\*\*\***
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=**\*\***\*\***\*\***
AUTH0_CLIENT_ID=**\*\***\*\***\*\***
AUTH0_CLIENT_SECRET=**\*\*\*\***\***\*\*\*\***

Then add the API BASE URL - this is defaulted, but may change if you have multiple APIs in play.

NEXT_PUBLIC_API_BASE_URL=http://localhost:4001

### Step 4: Run your API project locally with Nitric

```bash
cd src
yarn install
nitric start
```

### Step 5: Run the UI

```bash
cd ui
yarn install
yarn dev
```

### Step 5: Test the survey application by accessing the UI

Navigate to http://localhost:3000 with your favourite browser.

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

- Join our [Discord](https://nitric.io/chat) to chat with the community

- Find us on [Twitter](https://twitter.com/nitric_io)

- Send us an [email](mailto:maintainers@nitric.io)
