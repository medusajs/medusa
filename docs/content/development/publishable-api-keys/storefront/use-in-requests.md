---
description: 'Learn how to use Publishable API Keys in Client Requests using Medusa JS Client, Medusa React, or other methods.'
---

# Use Publishable API Keys in Client Requests

In this document, you'll learn how to use Publishable API Keys in client requests.

:::note

[Publishable API keys](../index.mdx) are only for client-side use. They can be publicly accessible in your code, as they are not authorized for the Admin API.

:::

## Using Medusa JS Client

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

## Using Medusa React

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

## Using Other Methods

For other ways of sending requests to your Medusa backend, such as using the Fetch API, you must pass `x-publishable-api-key` in the header of every request. Its value is the publishable API key’s `id`.

```ts
fetch(`<BACKEND_URL>/store/products`, {
  credentials: "include",
  headers: {
    "x-publishable-api-key": publishableApiKey,
  },
})
```

---

## See Also

- [Manage publishable keys as an admin](../admin/manage-publishable-api-keys.mdx)