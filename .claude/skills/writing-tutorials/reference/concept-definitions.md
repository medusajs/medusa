# Concept Definitions

When a concept is introduced for the first time in a tutorial step, include a 1-2 sentence definition before the implementation details. Use these verbatim (or adapt minimally for context). Always follow the definition with a `<Note>` linking to further documentation.

---

## Module

> **IMPORTANT:** If the Module is a Module Provider, use the definition for the specific provider instead. DO NOT add both definitions.

```mdx
In Medusa, you can build custom features in a [module](!docs!/learn/fundamentals/modules). A module is a reusable package with functionalities related to a single feature or domain. Medusa integrates the module into your application without affecting your setup.

In the module, you define the data models necessary for a feature and the logic to manage these data models. Later, you can build commerce flows around your module.

<Note title="Tip">

Refer to the [Modules documentation](!docs!/learn/fundamentals/modules) to learn more.

</Note>
```

---

## Data Model

```mdx
A data model represents a table in the database. You create data models using Medusa's Data Model Language (DML), which simplifies defining a table's columns, relations, and indexes with straightforward methods and configurations.

<Note title="Tip">

Learn more about data models in the [Data Models documentation](!docs!/learn/fundamentals/data-models).

</Note>
```

---

## Service

```mdx
A service is a TypeScript or JavaScript class that the module exports. In the service's methods, you can connect to the database to manage your data models, or connect to a third-party service, which is useful when integrating with external systems.
```

---

## Migration

```mdx
Since data models represent tables in the database, you define how to create them in the database using migrations. A migration is a TypeScript or JavaScript file that defines database changes made by a module.
```

---

## Module Links

```mdx
Medusa integrates modules into your application without side effects by isolating them from one another. This means you can't directly create relationships between data models in your module and data models in other modules.

Instead, Medusa provides a mechanism to define links between data models and to retrieve and manage linked records while maintaining module isolation. Links are useful for defining associations between data models in different modules or for extending a model in another module to associate custom properties with it.

<Note>

Refer to the [Module Isolation documentation](!docs!/learn/fundamentals/modules/isolation) to learn more.

</Note>
```

---

## Workflow

```mdx
To build custom commerce features in Medusa, you create a [workflow](!docs!/learn/fundamentals/workflows). A workflow is a series of queries and actions, called steps, that complete a task. You can track the workflow's execution progress, define rollback logic, and configure other advanced features.

<Note>

Learn more about workflows in the [Workflows documentation](!docs!/learn/fundamentals/workflows).

</Note>
```

---

## Workflow Hook

```mdx
A hook is a specific point in a workflow where you can inject custom functionality.

<Note>

Refer to the [Workflow Hooks documentation](!docs!/learn/fundamentals/workflows/workflow-hooks) to learn more.

</Note>
```

---

## API Route

```mdx
An API route is created in a `route.ts` file under a sub-directory of the `src/api` directory. The path of the API route is the file's path relative to `src/api`.

<Note>

Refer to the [API routes](!docs!/learn/fundamentals/api-routes) documentation to learn more about them.

</Note>
```

---

## Subscriber

```mdx
A subscriber is an asynchronous function that runs in the background when specific events are emitted.

<Note>

Refer to the [Subscribers documentation](!docs!/learn/fundamentals/events-and-subscribers) to learn more.

</Note>
```

---

## Admin Dashboard Customization (intro paragraph)

Use this when first introducing any Admin customization in a step:

```mdx
The Medusa Admin dashboard is customizable, allowing you to insert widgets into existing pages, or create new pages.

<Note title="Tip">

Refer to the [Admin Development](!docs!/learn/fundamentals/admin) documentation to learn more.

</Note>
```

---

## Admin UI Route (Page)

Use this when creating a new admin page:

```mdx
A UI route is a React component that specifies the content to be shown in a new page in the Medusa Admin dashboard.

<Note>

Refer to the [UI Routes documentation](!docs!/learn/fundamentals/admin/ui-routes) to learn more.

</Note>
```

---

## Scheduled Job

```mdx
A scheduled job is a function that runs at a specified interval in the background of your Medusa application.

<Note>

Refer to the [Scheduled Jobs documentation](!docs!/learn/fundamentals/scheduled-jobs) to learn more.

</Note>
```

---

---

## Integration: Generic Module Provider Intro

Use this paragraph when first introducing the idea of creating a module to integrate a third-party service. Place it at the top of the step that creates the module provider:

```mdx
To integrate third-party services into Medusa, you create a custom module. A module is a reusable package with functionalities related to a single feature or domain. Medusa integrates the module into your application without implications or side effects on your setup.

<Note>

Learn more about modules in [this documentation](!docs!/learn/fundamentals/modules).

</Note>
```

---

## Integration: Notification Module Provider

Use after the generic module intro when the provider implements the Notification Module:

```mdx
Medusa's Notification Module delegates sending notifications to other modules, called module providers. In this step, you'll create a [Service Name] Module Provider that implements sending notifications through the [channel, e.g., email] channel.

A Notification Module Provider's service must extend the `AbstractNotificationProviderService`. It has a `send` method that you'll implement to send notifications. The service must also have an `identifier` static property, which is a unique identifier that the Medusa application uses to register the provider in the database.

<Note>

Refer to the [Create Notification Module Provider](/references/notification/provider) guide for more details.

</Note>
```

---

## Integration: Payment Module Provider

Use after the generic module intro when the provider implements the Payment Module:

```mdx
Medusa's [Payment Module](../../../commerce-modules/payment/page.mdx) provides an interface to process payments in your Medusa application. It delegates the actual payment processing to the underlying providers.

A Payment Module Provider's service must extend the `AbstractPaymentProvider` class. It must also have a static `identifier` property that uniquely identifies the provider.

<Note>

Refer to the [Create Payment Provider](/references/payment/provider) guide for more details about the methods to implement.

</Note>
```

---

## Integration: Fulfillment Module Provider

Use after the generic module intro when the provider implements the Fulfillment Module:

```mdx
Medusa's Fulfillment Module delegates processing fulfillments and shipments to other modules, called module providers. In this step, you'll create a [Service Name] Module Provider that implements all functionalities required for fulfillment.

A Fulfillment Module Provider's service must extend the `AbstractFulfillmentProviderService` class.

<Note>

Refer to the [Create Fulfillment Provider](/references/fulfillment/provider) guide for more details about the methods to implement.

</Note>
```

---

## Integration: Analytics Module Provider

Use after the generic module intro when the provider implements the Analytics Module:

```mdx
Medusa's [Analytics Module](../../../infrastructure-modules/analytics/page.mdx) provides an interface to track events in your Medusa application. It delegates the actual tracking to the configured Analytics Module Provider.

An Analytics Module Provider's service must extend the `AbstractAnalyticsProviderService` class. It must also have an `identifier` static property with the unique identifier of the provider.

<Note>

Refer to the [Create Analytics Module Provider](/references/analytics/provider) guide for more details about the methods to implement.

</Note>
```

---

## Integration: Auth Module Provider

Use after the generic module intro when the provider implements the Auth Module:

```mdx
Medusa's [Auth Module](../../../commerce-modules/auth/page.mdx) provides the interface to authenticate users. It delegates the actual authentication logic to the underlying Auth Module Provider.

An Auth Module Provider's service must extend the `AbstractAuthModuleProvider` class. It must also have a `DISPLAY_NAME` static property for display in the UI, and an `identifier` static property with the unique identifier of the provider.

<Note>

Refer to the [Create Auth Module Provider](/references/auth/provider) guide for more details about the methods to implement.

</Note>
```

---

## Integration: Custom Module (non-provider)

Use when the integration is built as a standalone custom module rather than a built-in module provider (e.g., a CMS, search engine, or custom third-party service):

```mdx
To integrate third-party services into Medusa, you create a custom module. A module is a reusable package with functionalities related to a single feature or domain. Medusa integrates the module into your application without implications or side effects on your setup.

In this step, you'll create a custom module that provides the necessary functionalities to integrate [Service Name] with Medusa.

<Note>

Refer to the [Modules documentation](!docs!/learn/fundamentals/modules) to learn more.

</Note>
```

---

## Usage Guidelines

- Only include a definition the **first time** the concept appears in the tutorial.
- Subsequent steps that use the same concept (e.g., a second workflow) do NOT repeat the definition.
- Adapt the definition sentence minimally for context — for example, replace "a tier" with the tutorial's actual entity name.
- Always follow definitions with a `<Note>` linking to the relevant documentation page.
- For integration guides: always use the **Generic Module Provider Intro** first, then add the module-specific definition below it (Notification, Payment, etc.).
