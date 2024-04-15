<p align="center">
  <a href="https://nitric.io">
    <img src="https://raw.githubusercontent.com/nitrictech/nitric/main/docs/assets/nitric-logo.svg" width="120" alt="Nitric Logo"/>
  </a>
</p>

<p align="center">
  A fast & fun way to build portable cloud-native applications
</p>

<p align="center">
  <img alt="GitHub release (latest SemVer)" src="https://img.shields.io/github/v/release/nitrictech/nitric?sort=semver" />
  <a href="https://twitter.com/nitric_io">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/nitric_io?label=Follow&style=social" />
  </a>
  <a href="https://nitric.io/chat"><img alt="Discord" src="https://img.shields.io/discord/955259353043173427?label=discord" /></a>
</p>

# Nitric Examples

This repository serves as the Nitric Examples repository, housing both starter templates for the languages supported by the Nitric Framework as well as a variety of example projects to show how Nitric can be used for different use cases.

Each example is designed to be deployed using Nitric for AWS, GCP, and Azure, or alternatively, can be run locally. The examples are organized within the [v1 directory](./v1/), which represents our latest version.

> Note: Refer to the README of each project for setup instructions and more info as sometimes they are reliant on cloud services.

## Starter Templates

When utilizing the `nitric new` command to initiate a new project, the available templates listed in the `cli-templates.yaml` file are presented as options for constructing your application.

> Want another language that isn't currently available? Chat to us on [Discord](https://nitric.io/chat).

## Examples Overview

### TypeScript / JavaScript

| Name                                             | Description                                                                                         | Features                                                |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [typescript-starter](./v1/typescript-starter/)   | TypeScript REST API Starter                                                                         | APIs                                                    |
| [javascript-starter](./v1/javascript-starter/)   | JavaScript REST API Starter                                                                         | APIs                                                    |
| [auth-firebase](./v1/auth-firebase/)             | Integrate with Firebase Auth                                                                        | APIs, Auth, Frontend                                    |
| [website-status](./v1/website-status/)           | Perform a ping to check to see if URL is available                                                  | APIs                                                    |
| [openai-embeddings](./v1/openai-embeddings/)     | Populate and query a vector db with embeddings of the nitric docs from openai using Supabase        | APIs, AI, SQL Database                                  |
| [middleware demo](./v1/middleware-demo/)         | A simple example of middleware handlers                                                             | APIs                                                    |
| [inventory](./v1/product-inventory/)             | Simple inventory with image upload and labels generation with AWS Rekognition                       | APIs, Storage, Key Value Stores, Topics, Emails         |
| [user-onboarding](./v1/user-onboarding/)         | Onboard a user and send them an email with AWS SES                                                  | APIs, Topics, Key Value Stores, Emails                  |
| [uptime-monitoring](./v1/uptime-monitoring/)     | A website uptime monitor using Events, APIs and Schedules                                           | APIs, Topics, Schedules, Key Value Stores, Frontend     |
| [dynamic-load](./v1/dynamic-load/)               | A simple example of loading a node js resource dynamically within an API                            | APIs                                                    |
| [upload-secure-url](./v1/upload-secure-url/)     | Generate URLs to upload and download securely and directly from a Bucket                            | APIs, Storage                                           |
| [graphql-profile-api](./v1/profile-api-graphql/) | Use GraphQL to Create a reliable, scalable, and performant HTTP endpoint                            | APIs, Key Value Stores, GraphQL                         |
| [stripe-payments](./v1/stripe-payments/)         | Simple example of setting up and redirecting to a stripe payment gateway                            | APIs, Stripe Payments                                   |
| [cockroach-example](./v1/cockroach-example/)     | Simple example of connecting to and adding entries into a cockroach db                              | APIs, SQL Database                                      |
| [scheduled-tasks](./v1/scheduled-tasks/)         | Delete the items in a bucket (e.g. S3) every 3 days                                                 | APIs, Storage, Schedules                                |
| [neon-postgres](./v1/neon/)                      | Simple example of connecting to and querying a neon postgres auto-scaling db                        | APIs, SQL Database                                      |
| [neon-tasklist](./v1/neon-tasklist/)             | Create a task list with a Neon pg database.                                                         | APIs, SQL Database                                      |
| [cloudflare-lb](./v1/cloudflare-lb/)             | Deploy a multi-cloud application with a cloudflare loadbalanced application                         | APIs, Multi-Cloud                                       |
| [surveys-auth0](./v1/surveys-auth0/)             | A survey app with NextJS frontend with and without Auth0 integration to save and resume application | APIs, Topics, Key Value Stores, Storage, Auth, Frontend |
| [nitric-express](./v1/nitric-express/)           | A secure URL upload demonstrating usage with Nitric and Express framework                           | Existing API Frameworks, Storage                        |
| [nitric-koa](./v1/nitric-koa/)                   | A secure URL upload demonstrating usage with Nitric and KOA framework                               | Existing API Frameworks, Storage                        |
| [nitric-hono](./v1/nitric-hono/)                 | A secure URL upload demonstrating usage with Nitric and Hono                                        | Existing API Frameworks, Storage                        |
| [nitric-fastify](./v1/nitric-fastify/)           | A secure URL upload demonstrating usage with Nitric and fastify                                     | Existing API Frameworks, Storage                        |
| [websockets](./v1/websockets/)                   | A basic websockets example                                                                          | APIs, Key Value Stores                                  |
| [real-time-chat](./v1/realtime-chat-app/)        | A realtime chat using Websockets, Next.js, Nitric and Clerk Auth                                    | APIs, WebSockets, Frontend, Auth                        |
| [scheduled-report](./v1/scheduled-report/)       | A scheduled report generated with Google Sheets and shared with Google Drive                        | APIs, Schedules                                         |

### Python

| Name                                         | Description                          | Features             |
| -------------------------------------------- | ------------------------------------ | -------------------- |
| [python-starter](./v1/python-starter/)       | REST API Starter                     | APIs                 |
| [auth-firebase](./v1/auth-firebase/)         | Integrate with Firebase Auth         | APIs, Auth, Frontend |
| [python-prediction](./v1/python-prediction/) | Text Prediciton API using Tensorflow | APIs                 |
| [scheduled-report](./v1/scheduled-report/)   | Scheduled Google Sheet Reports       | APIs, Schedules      |

### Dart

| Name                               | Description      | Features |
| ---------------------------------- | ---------------- | -------- |
| [dart-starter](./v1/dart-starter/) | REST API Starter | APIs     |

## About Nitric

[Nitric](https://nitric.io) is a framework for rapid development of cloud-native and serverless applications in many languages.

Using Nitric you define your apps in terms of the resources they need, then write the code for serverless function based APIs, event subscribers and scheduled jobs.

Apps built with Nitric can be deployed to AWS, Azure or Google Cloud all from the same code base so you can focus on your products, not your cloud provider.

Nitric makes it easy to:

- Create smart [serverless functions and APIs](https://nitric.io/docs/apis)
- Build reliable distributed apps that use [events](https://nitric.io/docs/messaging/topics) and/or [queues](https://nitric.io/docs/messaging/queues)
- Securely store, retrieve and rotate [secrets](https://nitric.io/docs/secrets)
- Read and write files from [buckets](https://nitric.io/docs/storage)

Learn more about Nitric from the main [repository](https://github.com/nitrictech/nitric) or [documentation](https://nitric.io/docs).
