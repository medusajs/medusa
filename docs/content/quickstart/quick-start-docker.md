<!-- vale off -->
# Quickstart using Docker
In this document you will learn how to make a container of Medusa's app on Docker. Docker is an open source platform for building, deploying, and managing containerized applications.


## Prerequisites
This quick start is intended for developers, assuming that you have already configured your local development environment and familiarised yourselves with all the technologies and frameworks used throughout the Medusa eco-system.
If this is not the case, please head over to our [Getting Started](https://docs.medusajs.com/quickstart/quick-start) tutorial for a thorough walkthrough.
It is assumed that you have docker installed on you system. If that is not the case please go and install [Docker](https://docs.docker.com/get-docker/).

## Introduction

With all the tools and technologies in place, let's get started by setting up a default project. Our starter is shipped with a very basic configuration, that includes the following plugins:

- Stripe as payment provider
- SendGrid as email notification provider
- Manual fulfilment as fulfilment provider

Additionally, we will spin up a PostgreSQL database and a Redis server, both required for Medusa to run. In this quick start, we will use docker to seamlessly set up these resources.

## Get started

### 1. Clone Medusa's starter project from Github

```bash
git clone https://github.com/medusajs/medusa-starter-default.git my-medusa-starter
```

### 2. Once cloned, you will jump into your project directory and get started with your configuration.

```bash
cd my-medusa-starter
```

### 3. Get your environment variables ready using our template

```bash
mv .env.template .env
```

### 4. Setup accounts for included plugins. This step is optional but required for placing orders.

Create a Stripe account and add your API key and webhook secret to `.env`
Create a SendGrid account and add your API key to `.env`

```bash
...
STRIPE_API_KEY="some_stripe_key"
STRIPE_WEBHOOK_SECRET="some_webhook_secret"
SENDGRID_API_KEY="some_sendgrid_key"
..
```

### 5. Start your server

```bash
docker-compose up --build
```

Running the above command does the following:

1. Build images for your Medusa project, a PostgreSQL database and a Redis server
2. Run migrations for your newly created database
3. Seed your database with some entities, that will allow you to easily get started.

   These include:

   - A user with email `admin@medusa-test.com` and password `supersecret`
   - A region called Default Region with a small subset of countries
   - A shipping option called Standard Shipping, that costs 10 EUR
   - A product called Cool Test Product
   - A variant of that product that costs 195 EUR

Once done, your server will be accessible at `http://localhost:9000`.

## Try it out

Let's try out your Medusa server by fetching some products.

```bash
curl -X GET localhost:9000/store/products | python -m json.tool
```
## Additional steps

### File Service Plugin

To upload product images to your Medusa server, you must install and configure one of the following file service plugins:

- [MinIO](../add-plugins/minio.md) (Recommended for local development)
- [S3](../add-plugins/s3.md)
- [DigitalOcean Spaces](../add-plugins/spaces.md)

### Server Configurations

It's important to configure your Medusa server properly and learn how environment variables are loaded.

You can learn more about configuring your server and loading environment variables in the [Configure your Server documentation](../usage/configurations.md).

## What's next :rocket:

- Install the [Next.js](../starters/nextjs-medusa-starter.md) or [Gatsby](../starters/gatsby-medusa-starter.md) storefronts to set up your ecommerce storefront quickly.
- Install the [Medusa Admin](../admin/quickstart.md) to supercharge your ecommerce experience with easy access to configurations and features.
- Check out the [API reference](https://docs.medusajs.com/api/store) to learn more about available endpoints available on your Medusa server.
- Install [plugins](https://github.com/medusajs/medusa/tree/master/packages) for features like Payment, CMS, Notifications, among other features.

<!-- vale on -->
