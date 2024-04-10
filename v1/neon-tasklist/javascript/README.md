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

This project demonstrates how to combine the power of an auto-scaling api with an auto-scaling postgres db.

Neon is a fully managed serverless PostgreSQL. Neon separates storage and compute and offers modern developer features such as serverless, branching, bottomless storage, and more.

## Usage

### Step 1: Install Nitric

Follow the steps in the [installation guide](https://nitric.io/docs/installation)

### Step 2: Create a Neon project

If you do not have one already, create a [Neon project](https://neon.tech).

Navigate to the Projects page in the Neon Console -> Click New Project.

Now you can create your table using the SQL Editor:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  completed BOOLEAN
);
```

### Step 3: Configure db env

Create a .env file from .env.template and update the db url, you'll want to use the pooled url since Neon suggests that this will work better with serverless functions.

You can find the url in the dashboard, it will look something like this:

```
postgres://username:password@*********.us-east-2.aws.neon.tech/neondb
```

### Step 4: Run your project locally Nitric

```bash
yarn install
nitric start
```

### Step 5: Test the API

The best way to test your API is to use the Nitric Dev Dashboard, you can find a link to this in the window which you ran 'yarn dev' e.g. http://localhost:49153/

> Note: The port might differ

Once in the dashboard in your browser, you can send requests to your API easily.

To create a new task you'll need to pass a task description in the request body.

```json
{
  "description": "run a mile"
}
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
