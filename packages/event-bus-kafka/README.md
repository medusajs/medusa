# @medusajs/event-bus-kafka

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
