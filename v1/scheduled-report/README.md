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

Create a scheduled service which will run on a daily basis to create and share a Google Sheets document with another user.

## Usage

### Step 1: Install Nitric

Follow the steps in the [installation guide](https://nitric.io/docs/installation)

### Step 2: Run your Nitric project locally

```bash
nitric new reports py-starter
pipenv install google-auth google-api-python-client
pipenv install --dev
```

### Step 3: Creating your credentials file in the Google Cloud Console

1. Login into Google Cloud and create a new project.
2. Ensure the Google Sheets and Drive APIs are enabled for your project.
3. Navigate to "IAM & Admin" > "Service Accounts".
   Click "Create Service Account", enter the account details, and confirm by clicking "Create".
4. Inside the service account details, go to the "Keys" section.
   Select "Add Key" > "Create new key", choose "JSON", and click "Create" to download the credentials file.
5. update our environment variables, create a file named `.env` and set the following values.

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-file.json
ADMIN_EMAIL=admin@example.com
```

### Step 4: Test it!

Use the Nitric Dashboard to trigger the task immediately, rather than waiting for the scheduled frequency.

```bash
nitric start
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
