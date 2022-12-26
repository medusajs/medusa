# Toggle Feature Flags

In this document, you’ll learn about what feature flags are and how to toggle them.

## Overview

Feature flags are used in Medusa to guard beta features that aren’t ready for live and production servers. This allows the Medusa team to keep publishing releases more frequently, while also working on necessary future features behind the scenes.

To use these beta features, you must enable their feature flags.

---

## Available Feature Flags

You can view a list of available feature flags that you can toggle in [the Medusa GitHub mono-repository](https://github.com/medusajs/medusa/tree/master/packages/medusa/src/loaders/feature-flags). In each feature flag file, you can find the default value of the feature flag, its name, environment variable name, and more.

:::info

If a feature flag is enabled/disabled by default, you don’t need to manually enable/disable it. Only set the feature flag’s value if it’s different than the default.

:::

---

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

### Method Two: Using Server Settings

You can enable a feature by using the server settings in `medusa-config.js`. You can find [a feature flag’s key in the loader file](https://github.com/medusajs/medusa/tree/master/packages/medusa/src/loaders/feature-flags) it’s defined in. It is defined under the property `key` in the exported object.

For example, to enable the Tax-Inclusive Pricing beta feature, add the following to the exported object in `medusa-config.js`:

```jsx title=medusa-config.js
module.exports = {
  featureFlags: {
    tax_inclusive_pricing: true
  },
  //...
}
```

### Note About Precedence

The environment variable’s value has higher precedence over the server settings. So, if you use both these methods on your server, the value of the environment variable will be used.

For example, if the value of the environment variable is set to `false`, but the value of the feature flag in the server settings is set to `true`, the feature flag will take the value of the environment variable and will be disabled.

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

Disabling feature flags follows the same process as enabling the feature flags. All you have to do is change the value in the environment variables or the server settings to `false`.

Once you disable a feature flag, all endpoints, entities, services, or other related classes and functionalities are disabled.

### Revert Migrations

If you had the feature flag previously enabled, and you want to disable this feature flag completely, you might need to revert the migrations you ran when you enabled it.

You can follow [this documentation to learn how to revert the last migration you ran](https://docs.medusajs.com/cli/reference#migrations).

---

## See Also

- [Migrations Overview](../migrations/overview.md).
- [Configure your Medusa server](../../../usage/configurations.md).
