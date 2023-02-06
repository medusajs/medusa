---
description: 'Learn what publishable API keys are and how they can be used in the Medusa server. Publishable API keys can be used to scope API calls with an API key.'
---

# Publishable API Keys Overview

In this document, you’ll learn about Publishable API Keys and their usage.

## Introduction

While using Medusa’s APIs, you might have to pass some query parameters for certain resources with every or most requests.

Taking Sales Channels as an example, you have to pass the Sales Channel’s ID as a query parameter to all the necessary endpoints, such as the List Products endpoint.

This is a tedious and error-prone process. This is where Publishable API Keys are useful.

Publishable API Keys can be used to scope API calls with an API key, determining what resources are retrieved when querying the API. Currently, they can be associated only with Sales Channels.

For example, you can associate an API key with a B2B channel, then, on the storefront, retrieve only products available in that channel using the API key.

---

## PublishableApiKey Entity Overview

The `PublishableApiKey` entity represents a publishable API key that is stored in the database. Some of its important attributes include:

- `id`: The ID of the publishable API key. This is the API key you’ll use in your API requests.
- `created_by`: The ID of the user that created this API key.
- `revoked_by`: The ID of the user that revoked this API key. A revoked publishable API key cannot be used in requests.

---

## Relation to Other Entities

### Sales Channels

A publishable API key can be associated with more than one sales channel, and a sales channel can be associated with more than one publishable API key.

The relation is represented by the entity `PublishableApiKeySalesChannel`.

---

## Using Publishable API Keys in Requests

:::note

Publishable API keys are only for client-side use. They can be publicly accessible in your code, as they are not authorized for the Admin API.

:::

### Using Medusa JS Client

When using [Medusa’s JS Client](../../../js-client/overview.md), you can pass it to the client only once when you create the instance of the client:

```ts
const medusa = new Medusa({
  maxRetries: 3,
  baseUrl: "https://api.example.com",
  publishableApiKey,
})
```

This will add the API key as in the header parameter `x-publishable-api-key` on all requests.

You can also use the `setPublishableKey` method to set it at a later point:

```ts
const medusa = new Medusa({
  // ...
})

// at a later point
medusa.setPublishableKey(publishableApiKey)
```

### Using Medusa React

You can pass the publishable API key to the `MedusaProvider` component:

```tsx
const App = () => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
      // ...
      publishableApiKey={publishableApiKey}
    >
      <MyStorefront />
    </MedusaProvider>
  )
}
```

Then, the API key will be passed in the header parameter `x-publishable-api-key` of every request.

### Using Other Methods

For other ways of sending requests to your Medusa server, such as using the Fetch API, you must pass `x-publishable-api-key` in the header of every request. Its value is the publishable API key’s `id`.

```ts
fetch(`<SERVER_URL>/store/products`, {
  credentials: "include",
  headers: {
    "x-publishable-api-key": publishableApiKey,
  },
})
```

---

## See Also

- [How to manage publishable keys as an admin](../../admin/manage-publishable-api-keys.mdx)
- [Publishable API keys admin API reference](/api/admin/#tag/PublishableApiKey)
