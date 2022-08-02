# Quickstart w. Docker
In this document you will learn how to deploy Medusa server on Docker. Docker is an open-source project for automating the deployment of applications as portable, self-sufficient containers that can run on the cloud or on-premises.

#Prerequisites
This quick start is intended for developers, that have already configured their local development environment and familiarised them selves with all the technologies and frameworks used throughout the Medusa eco-system.

If this is not the case, please head over to our [Getting Started](https://docs.medusajs.com/quickstart/quick-start) tutorial for a thorough walkthrough.

## Introduction

With all the tools and technologies in place, let's get started by setting up a default project. Our starter is shipped with a very basic configuration, that includes the following plugins:

- Stripe as payment provider
- SendGrid as email notification provider
- Manual fulfilment as fulfilment provider

Additionally, we will spin up a PostgreSQL database and a Redis server, both required for Medusa to run. In this quick start, we will use docker to seamlessly set up these resources.

## Get started

1. Clone the starter project from Github

```bash
git clone https://github.com/medusajs/medusa-starter-default.git my-medusa-starter
```

2. Once cloned, you will jump into the project directory and get started with our configuration.

```bash
cd my-medusa-starter
```

3. Get your environment variables ready using our template

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
docker-compose up --build
```

You will use docker-compose and Docker to start up our development environment. Running the above command will do the following:

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

Let's try out the Medusa server by fetching some products.

```bash
curl -X GET localhost:9000/store/products | python -m json.tool
```

## What's next?

- Learn how to [deploy your Medusa admin](https://docs.medusajs.com/deployments/admin/)
- Learn how to [deploy your storefront](https://docs.medusajs.com/deployments/storefront/)
- Build a storefront using our [Gatsby Starter](https://github.com/medusajs/gatsby-starter-medusa)
