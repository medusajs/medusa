---
sidebar_position: 2
description: 'This user guide explains how to manage taxes on the Medusa Admin. Learn how to edit their configurations.'
addHowToData: true
---

# Manage Taxes

In this document, you’ll learn how to view and manage taxes in your Medusa Admin.

## View Taxes

To view taxes:

1. Click on Settings in the sidebar.
2. Choose Taxes from the list of settings.

This opens the Taxes page where you can find a list of regions. This is because every time you create a region, a default tax rate is associated with that region.

---

## Edit a Region’s Taxes

To edit a region’s taxes:

1. Go to Settings → Taxes.
2. Click on the region you want to edit the taxes for in the Regions section.

This opens a Details form to the right where you can edit the taxes calculation settings and [manage the tax rates](./tax-rates.mdx).

---

## Change Tax Calculation Settings

:::tip

The save button only appears when you make changes to the settings.

:::

### Change Tax Provider

The tax provider that you choose defines how taxes are calculated for products and shipping options on checkout. Medusa provides a default tax provider with the name “System Tax Provider”.

If you have integrated a custom tax provider and want to use it to calculate taxes in a region:

1. Go to Settings → Taxes.
2. Select a region whose taxes you want to edit.
3. Change the selected tax provider in the Tax Provider field.
4. Click Save at the bottom right.

### Disable Automatic Taxes Calculation

By default, taxes are calculated automatically by Medusa. They’re calculated in different places during checkout, such as when a shipping method is chosen or when a new product is added to the cart.

If you use a third-party tax provider and you want to avoid sending too many requests to the tax provider, you can disable this behavior.

:::warning

If you switch off automatic taxes calculation, the taxes must be calculated manually on checkout. If you’re unsure how that works, please contact your technical team.

:::

To disable automatic taxes calculation:

1. Go to Settings → Taxes.
2. Select a region whose tax you want to edit.
3. Check off the “Calculate taxes automatically” input.
4. Click Save at the bottom right.

### Disable Taxes for Gift Cards

To disable applying taxes for Gift Cards:

1. Go to Settings → Taxes.
2. Select a region whose tax you want to edit.
3. Check off the “Apply tax to gift cards” input.
4. Click Save at the bottom right.

Enabling taxes for Gift Cards follows the same process, except you check the input.
