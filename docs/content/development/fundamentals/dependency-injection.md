---
description: 'Learn what the dependency container is and how to use it in Medusa. Learn also what dependency injection is, and what the resources regsitered and their names are.'
---

# Dependency Container and Injection

In this document, you’ll learn what the dependency container is and how you can use it in Medusa with dependency injection.

## Introduction

### What is Dependency Injection

Dependency Injection is the act of delivering the required resources to a class. These resources are the class’s dependencies. This is usually done by passing (or injecting) the dependencies in the constructor of the class.

Generally, all resources are registered in a container. Then, whenever a class depends on one of these resources, the system retrieves the resources from the container and injects them into the class’s constructor.

### Medusa’s Dependency Container

Medusa uses a dependency container to register essential resources of the backend. You can then access these resources in classes and endpoints using the dependency container.

For example, if you create a custom service, you can access any other service registered in Medusa in your service’s constructor. That includes Medusa’s core services, services defined in plugins, or other services that you create on your backend.

You can load more than services in your Medusa backend. You can load the Entity Manager, logger instance, and much more.

### MedusaContainer

To manage dependency injections, Medusa uses [Awilix](https://github.com/jeffijoe/awilix). Awilix is an NPM package that implements dependency injection in Node.js projects.

When you run the Medusa backend, a container of the type `MedusaContainer` is created. This type extends the [AwilixContainer](https://github.com/jeffijoe/awilix#the-awilixcontainer-object) object.

The backend then registers all important resources in the container, which makes them accessible in classes and endpoints.

---

## Registered Resources

The Medusa backend scans the core Medusa package, plugins, and your files in the `dist` directory and registers the following resources:

:::tip

The Lifetime column indicates the lifetime of a service. Other resources that aren't services don't have a lifetime, which is indicated with the `-` in the column. You can learn about what a lifetime is in the [Create a Service](../services/create-service.md) documentation.

:::

<table class="reference-table table-col-4">
<thead>
<tr>
<th>

Resource

</th>
<th>

Description

</th>

<th>

Registration Name

</th>
<th>

Lifetime

</th>
</tr>
</thead>
<tbody>
<tr>
<td>

Configurations

</td>
<td>

The configurations that are exported from `medusa-config.js`.

</td>
<td>

`configModule`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Services

</td>
<td>

Services that extend the `TransactionBaseService` class.

</td>
<td>

Each service is registered under its camel-case name. For example, the `ProductService` is registered as `productService`.

</td>
<td>

Core services by default have the `SINGLETON` lifetime. However, some have a different lifetime which is indicated in this table. Custom services, including services in plugins, by default have the `TRANSIENT` lifetime, unless defined differently within the custom service.

</td>
</tr>

<tr>
<td>

Entity Manager

</td>
<td>

An instance of Typeorm’s Entity Manager.

</td>
<td>

`manager`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Logger

</td>
<td>

An instance of Medusa CLI’s logger. You can use it to log messages to the terminal.

</td>
<td>

`logger`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Single Payment Processor

</td>
<td>

An instance of every payment processor that extends the `AbstractPaymentService` or the `AbstractPaymentProcessor` classes.

</td>
<td>

Every payment processor is registered under two names:

- Its camel-case name of the processor. For example, the `StripeProviderService` is registered as `stripeProviderService`.
- `pp_` followed by its identifier. For example, the `StripeProviderService` is registered as `pp_stripe`.

</td>
<td>

By default, it's `TRANSIENT` unless defined differently within the payment processor service.

</td>
</tr>

<tr>
<td>

All Payment Processors

</td>
<td>

An array of all payment processor that extend the `AbstractPaymentService` or `AbstractPaymentProcessor` class.

</td>
<td>

`paymentProviders`

</td>
<td>

`paymentProviders` is `TRANSIENT`, and each item in it is `TRANSIENT`.

</td>
</tr>

<tr>
<td>

Single Fulfillment Provider

</td>
<td>

An instance of every fulfillment provider that extends the `FulfillmentService` class.

</td>
<td>

Every fulfillment provider is registered under two names:

- Its camel-case name. For example, the `WebshipperFulfillmentService` is registered as `webshipperFulfillmentService`.
- `fp_` followed by its identifier. For example, the `WebshipperFulfillmentService` is registered as `fp_webshipper`.

</td>
<td>

By default, it's `SINGLETON` unless defined differently within the fulfillemnt provider service.

</td>
</tr>

<tr>
<td>

All Fulfillment Providers

</td>
<td>

An array of all fulfillment providers that extend the `FulfillmentService` class.

</td>
<td>

`fulfillmentProviders`

</td>
<td>

`fulfillmentProviders` is `TRANSIENT`, and each item in it is `TRANSIENT`.

</td>
</tr>

<tr>
<td>

Single Notification Provider

</td>
<td>

An instance of every notification provider that extends the `AbstractNotificationService` or the `BaseNotificationService` classes.

</td>
<td>

Every notification provider is registered under two names:

- Its camel-case name. For example, the `SendGridService` is registered as `sendGridService`.
- `noti_` followed by its identifier. For example, the `SendGridService` is registered as `noti_sendgrid`.

</td>
<td>

By default, it's `SINGLETON` unless defined differently within the notification provider service.

</td>
</tr>

<tr>
<td>

All Notification Providers

</td>
<td>

An array of all notification providers that extend the `AbstractNotificationService` or the `BaseNotificationService` classes.

</td>
<td>

`notificationProviders`

</td>
<td>

`notificationProviders` is `TRANSIENT`, and each item in it is `TRANSIENT`.

</td>
</tr>

<tr>
<td>

File Service

</td>
<td>

An instance of the class that extends the `FileService` class, if any.

</td>
<td>

The file service is registered under two names:

- Its camel-case name. For example, the `MinioService` is registered as `minioService`.
- `fileService`

</td>
<td>

By default, it's `TRANSIENT` unless defined differently within the file service.

</td>
</tr>

<tr>
<td>

Search Service

</td>
<td>

An instance of the class that extends the `AbstractSearchService` or the `SearchService` classes, if any.

</td>
<td>

The search service is registered under two names:

- Its camel-case name. For example, the `AlgoliaService` is registered as `algoliaService`.
- `searchService`

</td>
<td>

By default, it's `TRANSIENT` unless defined differently within the search service.

</td>
</tr>

<tr>
<td>

Single Tax Provider

</td>
<td>

An instance of every tax provider that extends the `AbstractTaxService` class.

</td>
<td>

The tax provider is registered under two names:

- Its camel-case name.
- `tp_` followed by its identifier.

</td>
<td>

By default, it's `SINGLETON` unless defined differently within the tax provider service.

</td>
</tr>

<tr>
<td>

All Tax Providers

</td>
<td>

An array of every tax provider that extends the `AbstractTaxService` class.

</td>
<td>

`taxProviders`

</td>
<td>

`taxProviders` is `TRANSIENT`, and each item in it is `TRANSIENT`.

</td>
</tr>

<tr>
<td>

Oauth Services

</td>
<td>

An instance of every service that extends the `OauthService` class.

</td>
<td>

Each Oauth Service is registered under its camel-case name followed by `Oauth`.

</td>
<td>

By default, it's `TRANSIENT` unless defined differently within the Oauth service.

</td>
</tr>

<tr>
<td>

Feature Flag Router

</td>
<td>

An instance of the `FlagRouter`. This can be used to list feature flags, set a feature flag’s value, or check if they’re enabled.

</td>
<td>

`featureFlagRouter`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Redis

</td>
<td>

An instance of the Redis client. If Redis is not configured, a fake Redis client is registered.

</td>
<td>

`redisClient`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Single Entity

</td>
<td>

An instance of every entity.

</td>
<td>

Each entity is registered under its camel-case name followed by Model. For example, the `CustomerGroup` entity is stored under `customerGroupModel`.

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

All Entities

</td>
<td>

An array of all database entities that is passed to Typeorm when connecting to the database.

</td>
<td>

`db_entities`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Repositories

</td>
<td>

An instance of each repository.

</td>
<td>

Each repository is registered under its camel-case name. For example, `CustomerGroupRepository` is stored under `customerGroupRepository`.

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Single Batch Job Strategy

</td>
<td>

An instance of every class extending the `AbstractBatchJobStrategy` class.

</td>
<td>

Each batch job strategy is registered under three names:

- Its camel-case name. For example, `ProductImportStrategy` is registered as `productImportStrategy`.
- `batch_` followed by its identifier. For example, the `ProductImportStrategy` is registered under `batch_product-import-strategy`.
- `batchType_` followed by its batch job type. For example, the `ProductImportStrategy` is registered under `batchType_product-import`.

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

All Batch Job Strategies

</td>
<td>

An array of all classes extending the `AbstractBatchJobStrategy` abstract class.

</td>
<td>

`batchJobStrategies`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Tax Calculation Strategy

</td>
<td>

An instance of the class implementing the `ITaxCalculationStrategy` interface.

</td>
<td>

`taxCalculationStrategy`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Cart Completion Strategy

</td>
<td>

An instance of the class extending the `AbstractCartCompletionStrategy` class.

</td>
<td>

`cartCompletionStrategy`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Price Selection Strategy

</td>
<td>

An instance of the class implementing the `IPriceSelectionStrategy` interface.

</td>
<td>

`priceSelectionStrategy`

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

Strategies

</td>
<td>

An instance of strategies that aren’t of the specific types mentioned above and that are under the `strategies` directory.

</td>
<td>

Its camel-case name.

</td>
<td>

\-

</td>
</tr>
</tbody>
</table>

---

## Loading Resources

This section covers how to load resources that the Medusa backend registers when it starts running.

### In Endpoints

To load resources, such as services, in endpoints, use the `req.scope.resolve` function. The function receives the registration name of the resource as a parameter.

For example:

```ts
const logger = req.scope.resolve("logger")
```

Please note that in endpoints some resources, such as repositories, are not available.

### In Classes

In classes such as services, strategies, or subscribers, you can load resources in the constructor function using dependency injection. The constructor receives an object of dependencies as a first parameter. Each dependency in the object should use the registration name of the resource that should be injected to the class.

For example:

```ts
import { OrderService } from "@medusajs/medusa"

class OrderSubscriber {
  protected orderService: OrderService

  constructor({ orderService }) {
    this.orderService = orderService
  }
}
```

---

## See Also

- [Create services](../services/create-service.md)
- [Create subscribers](../events/create-subscriber.md)
