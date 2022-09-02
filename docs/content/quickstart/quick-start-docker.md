# Quickstart with Docker

This quick start is intended for developers, assuming that you have already configured your local development environment and familiarised yourself with all the technologies and frameworks used throughout the Medusa eco-system.

If this is not the case, please head over to our Getting Started tutorial for a thorough walkthrough.

## Introduction

With all the tools and technologies in place, get started by setting up a default project. Our starter is shipped with a very basic configuration, that includes the following plugins:

- Stripe as payment provider
- SendGrid as email notification provider
- Manual fulfilment as fulfilment provider

Additionally, you will spin up a PostgreSQL database and a Redis server, both are required for Medusa to run. In this quick start, you will use Docker to seamlessly set up these resources.

## Get started

1. Clone Medusa's starter project from GitHub:

```bash
git clone https://github.com/medusajs/medusa-starter-default.git my-medusa-starter
```

2. Once cloned, jump into your project directory and get started with the configuration:

```bash
cd my-medusa-starter
```

3. Get your environment variables ready using the template:

```bash
mv .env.template .env
```

4. Setup accounts for included plugins. This step is optional but required for placing orders.

Create a Stripe account and add your API key and webhook secret to `.env`
Create a SendGrid account and add your API key to `.env`

```bash
...
STRIPE_API_KEY="some_stripe_key"
STRIPE_WEBHOOK_SECRET="some_webhook_secret"
SENDGRID_API_KEY="some_sendgrid_key"
..
```

5. Start your server

```bash
docker compose up --build
```

Running the above command does the following:

1. Build images for your Medusa project, a PostgreSQL database and a Redis server
2. Run migrations for your newly created database
3. Seed your database with some entities, that will allow us to easily get started.

   These include:

   - A user with email `admin@medusa-test.com` and password `supersecret`
   - A region called Default Region with a small subset of countries
   - A shipping option called Standard Shipping, that costs 10 EUR
   - A product called Cool Test Product
   - A variant of that product that costs 195 EUR

Once done, your server will be accessible at `http://localhost:9000`.

## Test Your Server

Let's try out your Medusa server by fetching some products.

```bash
curl -X GET localhost:9000/store/products | python -m json.tool
```

## What's next?

Add custom endpoint to your Medusa project

Install and configure additional plugins

Build a storefront using our [Gatsby Starter](https://github.com/medusajs/gatsby-starter-medusa)
