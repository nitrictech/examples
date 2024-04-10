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

Query a custom knowledge base by using vector simliarity queries on a vector database (supabase).

- Generate embeddings for sections of text in the Nitric documentation which has been written in markdown.
- Store embeddings in database
- Query embeddings by doing a simliarity test on vectorized query with database entries
- Process all results with OpenAPI completion model for human friendly output in MD format.

> This sample project inspires from the supabase ClippyGPT, making it possible to search Nitric base documenation, or BYO markdown content via an API.

## Usage

### Step 1: Install Nitric

Follow the steps in the [installation guide](https://nitric.io/docs/installation)

### Step 2: Create a supabase postgres database

Create the following tables:

page -

| Name | Description    | Data Type | Format |
| ---- | -------------- | --------- | ------ |
| id   | No description | bigint    | int8   |
| path | No description | text      | text   |

page_section -

| Name        | Description    | Data Type    | Format |
| ----------- | -------------- | ------------ | ------ |
| id          | No description | bigint       | int8   |
| content     | No description | text         | text   |
| token_count | No description | bigint       | int8   |
| embedding   | No description | USER-DEFINED | vector |
| page_id     | No description | bigint       | int8   |
| heading     | No description | text         | text   |

#### Create the following function: 'match_page_sections' with arguments:

| Name               | Type    |
| ------------------ | ------- |
| embedding          |         |
| match_threshold    |         |
| match_count        | integer |
| min_content_length | integer |

#### Plpgsql definition:

```plpgsql
#variable_conflict use_variable
begin
  return query
  select
    page.path,
    page_section.content,
    (page_section.embedding <#> embedding) * -1 as similarity
  from page_section
  join page
    on page_section.page_id = page.id

  -- We only care about sections that have a useful amount of content
  where length(page_section.content) >= min_content_length

  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (page_section.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by page_section.embedding <#> embedding

  limit match_count;
end;
```

### Step 3: Update env variables

You'll need an open-api access key and a supabase database url and access key which can be found in their respective portals.

```yaml
OPENAI_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

### Step 4: Run your project locally Nitric

```bash
yarn install
nitric start
```

### Step 5: Test the API

Populate the 'pages' subdirectory with your documentation. We've left our top level docs in there as a sample.
The code splits the pages into sections based on headings using `##`

Learn

```bash
curl --location 'localhost:4001/learn'
```

Query

curl --location 'localhost:4001/query' \
--header 'Content-Type: text/plain' \
--data '{
"query" : "what is nitric?"
}'

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
