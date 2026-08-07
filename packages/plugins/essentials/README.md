<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Essentials Plugin
</h1>

Default features for starters.

## Features

- Sends invite emails on `invite.created` and `invite.resent`
- Sends password reset emails on `auth.password_reset`

Preview email templates locally with:

```bash
yarn preview:emails
```

## Prerequisites

A [Notification Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/notification) should be configured for the `email` channel. Without one, notification creation fails with a not-found error.

## Installation

```bash
yarn add @medusajs/essentials-plugin
```

```ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  plugins: [
    {
      resolve: "@medusajs/essentials-plugin",
      options: {
        features: "all",
        storeName: "Acme",
      },
    },
  ],
})
```

## Options

| Option      | Type                                     | Default | Description                                                                                  |
| ----------- | ---------------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `features`  | `"all" \| "none" \| EssentialsFeature[]` | `"all"` | Which email features to enable                                                               |
| `storeName` | `string`                                 | —       | Optional display name used in email copy                                                     |

## Compatibility

Compatible with versions >= 2.18.0 of `@medusajs/medusa`.

## Learn more

- [Plugins documentation](https://docs.medusajs.com/learn/fundamentals/plugins)
- [Invite user email](https://docs.medusajs.com/resources/commerce-modules/user/invite-user-subscriber)
- [Reset password email](https://docs.medusajs.com/resources/commerce-modules/auth/reset-password)

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can ask for support, discuss roadmap, and share ideas.

Join our [Discord server](https://discord.com/invite/medusajs) to meet other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)
