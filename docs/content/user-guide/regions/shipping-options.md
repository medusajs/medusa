---
sidebar_position: 4
---

# Manage Shipping Options

In this document, you’ll learn how to manage a region’s shipping options in your Medusa Admin.

## Types of Shipping Options

There are two types of shipping options in a region:

1. Shipping Options are used when a customer places an order or when an admin creates a draft order.
2. Return Shipping Options are used when a customer requests a return or swap for their order, or when an admin registers an exchange, a claim, or a return for an order.

A shipping option can’t be used for both cases. In a region, you can create an unlimited amount of shipping options and return shipping options.

## Manage Shipping Options in a Region

### Add Shipping Option to a Region

To add a shipping option:

1. Go to Settings → Regions.
2. Select a region to edit.
3. Scroll down to the Shipping Options section in the Details form.
4. Click on Add Option.
5. A new window will open with a form with the following fields:
    - **Name (Required):** The name of the shipping option. The customer will see this name on the storefront if the “Show on Website” field is checked.
    - **Currency:** This is a read-only field and its value depends on the currency of the region.
    - **Price (Required):** The price of the shipping option.
    - **Show on Website:** Whether or not this option should be available on the website. This is useful if you want to create a shipping option only for use on the Medusa Admin (for example, to create draft orders).
    - **Shipping Profile (Required):** The shipping profile this option belongs to.
    - **Fulfillment Method (Required):** the fulfillment provider that will handle fulfilling this shipping option.
    - **Requirements:** You can use this to specify a condition for when this shipping option should be available. The first field indicates the minimum cart subtotal, and the second field indicates the maximum cart subtotal. For example, you can fill in the first field “100” to only allow using this shipping option if the cart’s subtotal is at least $100.
6. Once you’re done, click Save.

### Edit a Shipping Option

To edit a shipping option:

1. Go to Settings → Regions.
2. Select a region to edit.
3. Scroll down to the Shipping Options section in the Details form.
4. Find the shipping option you want to edit and click on Edit at the right of its name.
5. A new window will open with the fields that you can edit. You can edit all of the fields you chose while adding the shipping option except for the Shipping Profile and Fulfillment Method.
6. Once done, click Save.

### Delete a Shipping Option

:::warning

If you delete a shipping option, you can’t restore it or its data, customers can’t use it during checkout, and admins can’t use it for draft orders.

:::

To delete a shipping option:

1. Go to Settings → Regions.
2. Select a region to edit.
3. Scroll down to the Shipping Options section in the Details form.
4. Find the shipping option you want to edit and click on Edit at the right of its name.
5. A new window will open. Click on Delete under the Danger Zone section.
6. Confirm deleting the shipping option by clicking the “Yes, remove” button in the pop-up.

---

## Manage Return Shipping Options in a Region

### Add Return Shipping Option to a Region

To add a return shipping option:

1. Go to Settings → Regions.
2. Select a region to edit.
3. Scroll down to the Return Shipping Options section in the Details form.
4. Click on Add Return.
5. A new window will open with a form with the following fields:
    - **Name (Required):** The name of the return shipping option. The customer will see this name on the storefront if the “Show on Website” field is checked.
    - **Currency:** This is a read-only field and its value depends on the currency of the region.
    - **Price (Required):** The price of the return shipping option.
    - **Show on Website:** Whether or not this option should be available on the website. This is useful if you want to create a return shipping option only for use on the Medusa Admin (for example, to create claims or return requests from the Medusa Admin).
    - **Fulfillment Method (Required):** the fulfillment provider that will handle fulfilling this return shipping option.
6. Once you’re done, click Save.

### Edit a Return Shipping Option

To edit a return shipping option:

1. Go to Settings → Regions.
2. Select a region to edit.
3. Scroll down to the Return Shipping Options section in the Details form.
4. Find the return shipping option you want to edit and click on Edit at the right of its name.
5. A new window will open with the fields that you can edit. You can edit all of the fields you chose while adding the shipping profile except for the Fulfillment Method.
6. Once done, click Save.

### Delete a Return Shipping Option

:::warning

If you delete a return shipping option, you can’t restore it or its data, customers can’t use it when they request a return or an exchange, and admins can’t use it when requesting a return for an order or registering an exchange or claim for an order.

:::

To delete a return shipping option:

1. Go to Settings → Regions.
2. Select a region to edit.
3. Scroll down to the Return Shipping Options section in the Details form.
4. Find the return shipping option you want to edit and click on Edit at the right of its name.
5. A new window will open. Click on Delete under the Danger Zone section.
6. Confirm deleting the return shipping option by clicking the “Yes, remove” button in the pop-up.