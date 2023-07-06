<p align="center">
  <a href="https://www.medusajs.com">
    <img alt="Medusa" src="https://user-images.githubusercontent.com/7554214/153162406-bf8fd16f-aa98-4604-b87b-e13ab4baf604.png" width="100" />
  </a>
</p>
<h1 align="center">
  @medusajs/event-bus-kafka
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
An open source composable commerce engine built for developers.
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://circleci.com/gh/medusajs/medusa">
    <img src="https://circleci.com/gh/medusajs/medusa.svg?style=shield" alt="Current CircleCI build status." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Overview

This module adds Kafka as the pub/sub layer in the Medusa's EventBus. The module pushes all Medusa events to a Topic and consumes the events to process Medusa subsrcibers.

Using the Kafka Event Bus connector enables easy composition of Medusa with other services. 3rd party services can directly consume Medusa events in the Kafka Topic and perform operations as events are made available.

## Getting started

Install the module:

```bash
yarn add @medusajs/event-bus-kafka
```

Add the module to your `medusa-config.js`:

```js
module.exports = {
  // ...
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-kafka",
      options: {
        kafkaConfig: {...}
      },
    },
  },
  // ...
}
```

## Configuration

The module can be configured with the following options:

| Option                | Type       | Description                                                                                                                                                             | Default            |
| --------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `kafkaConfig`         | `object`   | The configuration for the Kafka client. See [KafkaJS documentation](https://kafka.js.org/docs/configuration) for all options.                                           | -                  |
| `kafkaConfig.brokers` | `string[]` | An array of strings with the broker addresses in the format `hostname:port`. This is required.                                                                          | -                  |
| `noConsumer`          | `boolean?` | If set to `true`, a consumer is not created. This is useful for services that only need to publish events and don't have to process events published by other services. | `false`            |
| `topic`               | `string?`  | The topic to which messages are published and from which they are consumed.                                                                                             | `medusa-event-bus` |

Info: See how the options are applied in the KafkaEventBusService and loader.

If you do not provide a kafkaConfig in the module options, the server will fail to start.

The Kafka configuration object (kafkaConfig) should follow the format defined in the KafkaJS documentation. Here's an example:

```js
kafkaConfig: {
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
}
```

This is where you provide the list of brokers for your Kafka cluster and the client ID for the Kafka client.

Note: If the Kafka event bus is used in a service that only produces events and doesn't need to consume them, you can set noConsumer to true. This will prevent the service from creating and starting a Kafka consumer. This is useful for services that only need to publish events and don't have to process events published by other services.
