# Quickstart using Docker

In this document, you will learn how to make a container of Medusa's app on Docker. Docker is an open source platform for building, deploying, and managing containerized applications.

## Prerequisites

### Node.js
Medusa supports Node versions 14 and 16. You can check which version of Node you have by running the following command:

```bash
node -v
```

You can install Node from the [official website](https://nodejs.org/en/).

### Docker Desktop

It is assumed that you have Docker installed on your system. You can install it from [Docker's website](https://docs.docker.com/get-docker/).

## Create Medusa Server with Docker

### 1. Clone Medusa's starter project from GitHub

```bash
git clone https://github.com/medusajs/medusa-starter-default.git my-medusa-starter
```

### 2. Change to the newly created project directory
```bash
cd my-medusa-starter
```

### 3.  Rename the environment variables(.env) file

```bash
mv .env.template .env
```

### 4. Start your server

Make sure the Docker Desktop app is running. Then, run the following command:

```bash
docker-compose up --build
```

:::note

If you get the error `ERROR: for postgres  Cannot start service postgres: Ports are not available`, change the ports used for PostgreSQL in `docker-compose.yml` to something like this:

```yml
  postgres:
    ports:
      - "5433:5433"
```

:::

Running the above command does the following:

1. Build images for your Medusa project, a PostgreSQL database, and a Redis server
2. Run migrations for your newly created database


## Test Your Server

Once done, your server will be accessible at `http://localhost:9000`.

You can test out your server using tools like Postman or by sending a cURL request:

```bash
curl -X GET localhost:9000/store/products | python -m json.tool
```

:::note

This command uses Python to format the result of the request better in your command line. If you don't want to use Python you can simply send a request without the formatting:

```bash
curl localhost:9000/store/products
```

:::

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
- Install [plugins](https://github.com/medusajs/medusa/tree/master/packages) for features like Payment, CMS, and Notifications, among other features.
