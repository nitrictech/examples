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

Create an API which captures profile information using REST and handles profile images and analysis with Rekognition.

## Usage

### Step 1: Install Nitric

Follow the steps in the [installation guide](https://nitric.io/docs/installation)

### Step 2: AWS Configuration

Update env settings

```bash
mv env-template .env
```

```
AWS_SES_REGION="us-east-1"
AWS_SES_ACCESS_KEY_ID="..."
AWS_SES_SECRET_ACCESS_KEY="..."

SENDER_EMAIL="..."
SYS_ADMIN_EMAIL="..."
```

> Note: Get the {{bucket-id}} from the created resource in S3 AWS Console - this is required by the request to Rekognition.
> Note: You'll need to whitelist these emails with amazon to send emails.

### Step 3: Run your project locally Nitric

Refer to the README located in the language specific version of this project.

### Step 4: Test the API

Create a product

```bash
curl --location --request POST 'https://XXXXXXXXXXXXXX.amazonaws.com/products' \
--header 'Content-Type: text/plain' \
--data-raw '{
    "name": "Dog",
    "description" : "Best friend!"
}'
```

```bash
{
    "msg": "Product with id {{id}} created."
}
```

Get the photo upload URL

```bash
curl --location --request GET 'https://{{url}}/products/{{id}}/image/upload'
```

```bash
{
    "url": "..."
}
```

Get product info (with Rekognition labels)

```bash
curl --location --request GET 'https://{{url}}/products/{{id}}'
```

```bash
{
    "description": "Best friend.",
    "labels": {
        "Labels": [
            {
                "Name": "Dog",
                "Confidence": 99.73765563964844,
                "Instances": [
                    {
                        "BoundingBox": {
                            "Width": 0.7164074778556824,
                            "Height": 0.8895376324653625,
                            "Left": 0.1641775667667389,
                            "Top": 0.10807080566883087
                        },
                        "Confidence": 99.73765563964844
                    }
                ]
                ...
                ...
        "LabelModelVersion": "2.0"
    },
    "name": "Dog",
    "rekognition": true,
    "url": "..."
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
