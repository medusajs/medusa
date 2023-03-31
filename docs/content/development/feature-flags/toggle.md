---
description: 'Learn how to toggle feature flags in Medusa. This guide explains the steps required to toggle a feature flag.'
addHowToData: true
---

# How to Toggle Feature Flags

In this document, you’ll learn about how to toggle feature flags.

:::info

If a feature flag is enabled/disabled by default, you don’t need to manually enable/disable it. Only set the feature flag’s value if it’s different than the default.

:::

## Enable Feature Flags

:::caution

Features guarded by feature flags are experimental and beta features. Enable them with caution.

:::

There are two ways to enable a feature flag.

### Method One: Using Environment Variables

You can enable a feature by setting the value of its environment variable to `true`. You can find [the name of a feature flag’s environment variable in the loader file](https://github.com/medusajs/medusa/tree/master/packages/medusa/src/loaders/feature-flags) it’s defined in. It is defined under the property `env_key` in the exported object.

For example, to enable the Tax-Inclusive Pricing beta feature, add the following environment variable:

```jsx
MEDUSA_FF_TAX_INCLUSIVE_PRICING=true
```

### Method Two: Using Backend Configurations

You can enable a feature by using the backend configurations in `medusa-config.js`. You can find [a feature flag’s key in the loader file](https://github.com/medusajs/medusa/tree/master/packages/medusa/src/loaders/feature-flags) it’s defined in. It is defined under the property `key` in the exported object.

For example, to enable the Tax-Inclusive Pricing beta feature, add the following to the exported object in `medusa-config.js`:

```jsx title=medusa-config.js
module.exports = {
  featureFlags: {
    tax_inclusive_pricing: true,
  },
  // ...
}
```

### Note About Precedence

The environment variable’s value has higher precedence over the backend configurations. So, if you use both these methods on your backend, the value of the environment variable will be used.

For example, if the value of the environment variable is set to `false`, but the value of the feature flag in the backend configurations is set to `true`, the feature flag will take the value of the environment variable and will be disabled.

### Running Migrations

As feature flags generally include adding new entities or making changes to entities in the database, you must run the migrations after enabling the feature flag:

```bash
medusa migrations run
```

:::info

You can learn more about migrations in this documentation.

:::

---

## Disable Feature Flags

Disabling feature flags follows the same process as enabling the feature flags. All you have to do is change the value in the environment variables or the backend configurations to `false`.

Once you disable a feature flag, all endpoints, entities, services, or other related classes and functionalities are disabled.

### Revert Migrations

If you had the feature flag previously enabled, and you want to disable this feature flag completely, you might need to revert the migrations you ran when you enabled it.

You can follow [this documentation to learn how to revert the last migration you ran](../../cli/reference.md#migrations).