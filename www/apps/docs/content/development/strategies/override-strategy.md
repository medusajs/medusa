---
description: "Learn how to override a strategy in a Medusa backend or plugin."
addHowToData: true
---

# How to Override a Strategy

In this document, you’ll learn how to override a strategy in a Medusa backend or plugin.

## Overview

The Medusa core defines and uses strategies for certain functionalities, which allows developers to override these functionalities and implement them as fits for their use case.

For example, the cart completion process is implemented within a `CartCompletionStrategy` that is used inside the Complete Cart API Route. If you need to change the cart completion process, you can override the `CartCompletionStrategy` and implement your own strategy. The Medusa backend will then use your strategy instead of the one defined in the core.

### Hierarchy of Strategy Resolution

When the Medusa backend starts, the strategies defined in the core are registered in the dependency container first.

If a strategy is overridden in a plugin, it will be registered in the dependency container in place of the original strategy.

If a strategy is overridden in the Medusa backend codebase, it will be registered in the dependency container in place of the original strategy.

So, if a strategy is overridden within a plugin and in the Medusa backend codebase, the one in the codebase is registered and used instead of the one in the plugin.

:::tip

You can learn more about the dependency container and injection [here](../fundamentals/dependency-injection.md).

:::

### Existing Resources

This guide explains how to override a strategy in general. It doesn’t explain how to override specific strategies.

There are other resources that provide steps specific to a strategy type:

- [How to override the Cart Completion Strategy](../../modules/carts-and-checkout/backend/cart-completion-strategy.md)
- [How to override the Tax Calculation Strategy](../../references/tax_calculation/classes/tax_calculation.AbstractTaxCalculationStrategy.mdx)
- [How to override the Price Selection Strategy](/modules/price-lists/price-selection-strategy)
- [How to override a Batch Job Strategy](../batch-jobs/customize-import.md)

---

## Step 1: Create Strategy Class

A strategy class is created in a TypeScript or JavaScript file in the `src/strategies` directory of your Medusa backend or plugin.

The class must extend or implement a strategy interface or class from within the core, depending on what strategy you’re overriding. For example, if you’re overriding the `CartCompletionStrategy`, you must extend the `AbstractCartCompletionStrategy`.

---

## Step 2: Implement Functionalities

Each strategy class is required to implement certain methods defined by the interface it implements or the abstract class it extends. Depending on what the strategy is used for, you must implement the functionalities in each of the required methods.

For example, if you’re overriding the `CartCompletionStrategy`, you must implement the `complete` method using the signature defined in `AbstractCartCompletionStrategy`.

---

## Step 3: Run Build Command

In the directory of the Medusa backend, run the `build` command to transpile the files in the `src` directory into the `dist` directory:

```bash npm2yarn
npm run build
```

---

## Test it Out

Run your backend to test it out:

```bash npm2yarn
npx medusa develop
```

You can test now whether your strategy is working by performing the actions that run your strategy.

For example, if you’re overriding the `CartCompletionStrategy`, you can simulate the cart completion flow and see if your strategy is being used.
