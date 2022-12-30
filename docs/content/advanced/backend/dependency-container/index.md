# Dependency Container

In this document, you’ll learn what the dependency container is and how you can use it in Medusa.

## Introduction

### What is Dependency Injection

Dependency Injection is the act of delivering the required resources to a class. These resources are the class’s dependencies. This is usually done by passing (or injecting) the dependencies in the constructor of the class.

Generally, all resources are registered in a container. Then, whenever a class depends on one of these resources, the system retrieves the resources from the container and injects them into the class’s constructor.

### Medusa’s Dependency Container

Medusa uses a dependency container to register essential resources of your server. You can then access these resources in classes and endpoints using the dependency container.

For example, if you create a custom service, you can access any other service registered in Medusa in your service’s constructor. That includes Medusa’s core services, services defined in plugins, or other services that you create on your server.

You can load more than services in your Medusa server. You can load the Entity Manager, logger instance, and much more.

### MedusaContainer

To manage dependency injections, Medusa uses [Awilix](https://github.com/jeffijoe/awilix). Awilix is an NPM package that implements dependency injection in Node.js projects.

When you run the Medusa server, a container of the type `MedusaContainer` is created. This type extends the [AwilixContainer](https://github.com/jeffijoe/awilix#the-awilixcontainer-object) object.

The server then registers all important resources in the container, which makes them accessible in classes and endpoints.

---

## Registered Resources

The Medusa server scans the core Medusa package, plugins, and your files in the `dist` directory and registers the following resources:

:::note

Many resources are registered under their camel-case name. These resources are formatted by taking the name of the file, transforming it to camel case, then appending the folder name to the name. So, the `services/product.ts` service is registered as `productService`.

:::

<table class="reference-table">
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
</tr>
</thead>
<tbody>
<tr>
<td>

Configurations

</td>
<td>

The configurations that are exported from medusa-config.js.

</td>
<td>

`configModule`

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
</tr>

<tr>
<td>

Single Payment Provider

</td>
<td>

An instance of every payment provider that extends the `AbstractPaymentService` class.

</td>
<td>

Every payment provider is registered under two names:

- Its camel-case name. For example, the `StripeProviderService` is registered as `stripeProviderService`.
- `pp_` followed by its identifier. For example, the `StripeProviderService` is registered as `pp_stripe`.

</td>
</tr>

<tr>
<td>

All Payment Providers

</td>
<td>

An array of all payment providers that extend the `AbstractPaymentService` class.

</td>
<td>

`paymentProviders`

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
</tr>
</tbody>
</table>

---

## Loading Resources

This section covers how to load resources that the Medusa server registers when it starts running.

### In Endpoints

To load resources, such as services, in endpoints, use the `req.scope.resolve` function. The function receives the registration name of the resource as a parameter.

For example:

```ts
const logger = req.scope.resolve("logger")
```

Please note that in endpoints some resources, such as repositories, are not available.

### In Classes

In classes such as services, strategies, or subscribers, you can load resources in the constructor function. The constructor receives an object of dependencies as a first parameter. Each dependency in the object should use the registration name of the resource that should be injected to the class.

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

- [Create services](../services/create-service.md).
- [Create subscribers](../subscribers/create-subscriber.md).
