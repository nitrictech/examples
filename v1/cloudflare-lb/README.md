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

This project demonstrates how to load balance the same application across multiple clouds with Nitric and Cloudflare.

## Usage

### Step 1: Install Nitric

Follow the steps in the [installation guide](https://nitric.io/docs/installation)

### Step 2: Setup Cloud Flare

You'll need to obtain a domain, which you can purchase from cloudflare if you wish.

Create an API Token with the following permissions (this is the summary view so it should match up). Here you are granting permissions for our Pulumi script to edit LB, Zone and DNS.

```
All accounts - Load Balancing: Monitors And Pools:Edit
    user's Account
    All zones - Zone:Edit, Load Balancers:Edit, DNS:Edit
```

You'll also need to enable 'Load Balancing' for your domain in Traffic -> Loadbalancing.

### Step 3: Configure your env file with cloudflare details

Create a copy of the .env.template file in the ui project and update the value from your Auth0 profile.

CLOUDFLARE_ACCOUNT_ID=XXXXXXXXXXXXXXXXX
CLOUDFLARE_API_TOKEN=XXXXXXXXXXXXXXX
DOMAIN=your-url.com
SUBDOMAIN=prefix

### Step 4: Resolve dependencies

```bash
yarn install
```

### Step 5: Deploy to multiple clouds

Folowing these guides to set up credentials if you haven't deployed to [AWS](https://nitric.io/docs/reference/providers/aws) or [GCP](https://nitric.io/docs/reference/providers/gcp) before.

Update the `nitric-prod-aws.yaml` stack file to set the region you would like to deploy to. From there you can simply run.

```bash
nitric up
```

Select `prod-aws` as your stack and watch the deployment happen.

Repeat the above for `nitric-prod-gcp.yaml` and select `prod-gcp`

e.g.

```bash
nitric up

? Which stack? prod-gcp
 SUCCESS  Images Built (4s)
 SUCCESS  Configuration gathered (2s)
 SUCCESS
          API  | Endpoint
          main | https://XXXXXXX.gateway.dev
 Deployed  build results written to: /Users/rs/.nitric/stacks/cloudflare-lb-prod-gcp.results Deployed  Stack (7m2s)
```

### Step 6: Deploy your Cloud Flare loadbalancer

There are two commands provided in your package.json

```
    "deploy:lb": "ts-node ./infra/up.ts",
    "destroy:lb": "ts-node ./infra/down.ts"
```

Example of using them -

```bash
yarn deploy:lb

API available at: https://prefix.your-url.com
✨  Done in 8.46s.
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
