---
description: 'Learn about the discount architecture in the Medusa backend. Discounts are used to offer promotions to the user for marketing purposes.'
---

# Discounts Architecture

In this document, you’ll learn about Discounts architecture and how it works.

## What are Discounts

Discounts allow you to offer promotions to your users generally for marketing purposes. Customers can apply a discount code to their checkout flow to use the discount if it’s valid for them.

Discounts can be limited by a set of configurations and conditions. For example, you can indicate how many times a discount can be used or by which customer group. You can also specify which products this discount can be used with, among other conditions.

### Discount Types

There are three types of discounts:

1. Percentage discount: remove a percentage of the price every product in the cart that the discount can be applied to.
2. Fixed discount: remove a fixed amount either of the customer’s total checkout amount or of the price every product in the cart that the discount can be applied to.
3. Free shipping discount: remove any shipping amount from the customer’s order during checkout.

### Example Use Cases

Discounts can be used in many use cases including:

1. Applying discounted amounts for wholesale or B2B customers.
2. Creating a sale within a specific period of time (for example, a summer sale).
3. Give your customers free shipping for a limited time.

---

## Discount Entity Overview

A discount is represented by the [`Discount`](../../references/entities/classes/Discount.md) entity. Some of its important attributes are:

- `code` is a unique code that you specify when you create the discount. Customers use this code to apply the discount during checkout. The code can only include upper-case letters and numbers.
- `rule_id` is the ID of the rule of this discount. The `rule` attribute is the expanded object of the `DiscountRule` entity. You can use the `rule` attribute to get details regarding the discount type. You can learn more about this in the [`DiscountRule` entity overview](#discountrule-entity-overview) later.
- `is_disabled` is a boolean value that indicates whether this discount is published or not.
- `regions` are the regions this discount can be used in.
- `starts_at` and `ends_at` are timestamps that indicate when the discount starts and ends. If no expiry date is set for the discount, `ends_at` will be `null`.
- `usage_limit` is the number of times the discount can be used. If there is no limit the value will be `null`.
- `usage_count` is the number of times the discount has been used.

### Dynamic Discounts

Dynamic discounts are a set of discount conditions and configurations that you can reuse across many discounts.

After creating a dynamic discount, you can use it to create “child” discounts. Child discounts have the same conditions and configurations as the “parent” dynamic discount but with a different discount code.

The `is_dynamic` attribute in the `Discount` entity is a boolean value that determines whether the discount is dynamic or not. Child discounts are related to the parent discount using the `parent_discount_id` attribute which is a foreign key to the same `Discount` entity.

---

## DiscountRule Entity Overview

Every `Discount` entity belongs to a [`DiscountRule`](../../references/entities/classes/DiscountRule.md) entity. `DiscountRule` includes details such as the type of discount, the amount to be discounted, and more.

Some of the `DiscountRule` entity’s important attributes are:

- `type` is an enum string indicating the type of the discount. It must be either `fixed`, `percentage`, or `free_shipping`.
- `value` is the value to be discounted. The value of this depends on the value of `type`:
    - If `type` is `fixed`, `value` will be the amount to be removed either from the total or from each product this discount is applied to.
    - If `type` is `percentage`, `value` will be the percentage to be removed from each product this discount is applied to.
    - If `type` is `free_shipping`, `value` will be 0.
- `conditions` is an array of all discount conditions, if there are any.

---

## DiscountCondition Entity Overview

A discount can optionally have discount conditions. Discount conditions are used to further add limitations on when the discount can be applied.

A [`DiscountCondition`](../../references/entities/classes/DiscountCondition.md) belongs to a `DiscountRule` entity. The `discount_rule_id` attribute indicates the ID of the `DiscountRule` it belongs to.

Discount conditions have an attribute `type` that indicates the condition’s type. Its value must be one of the following:

- `products` means the condition applies to products.
- `product_types` means the condition applies to product types.
- `product_collections` means the condition applies to product collections.
- `product_tags` means the condition applies to product tags.
- `customer_groups` means the condition applies to customer groups.

Each condition type can be used for one condition in a discount. For example, you can add only one `product` discount condition to a discount.

Discount conditions also have an attribute `operator` that indicates how the condition should be applied. It must have one of the following values:

- `in` means the discount can be applied only for the items specified in the condition. For example, if the `type` is `product` and the `operator` is `in`, it means this condition defines which products must be available in the customer’s cart for the discount to apply.
- `not_in` means the discount can be applied for all items except those specified in the condition. For example, if the `type` is `product` and the `operator` is `not_in`, it means that the discount can be applied to any item in the cart that's not specified in the condition.

### Condition Type Relations

Based on the value of `type`, one of the following relations can be used to retrieve the condition’s items:

- `products` is an array of products that this condition applies to if the condition’s `type` is `products`. Each item of the array would be a [`DiscountConditionProduct`](../../references/entities/classes/DiscountConditionProduct.md).
- `product_types` is an array of product types that this condition applies to if the condition’s `type` is `product_types`. Each item of the array would be a [`DiscountConditionProductType`](../../references/entities/classes/DiscountConditionProductType.md).
- `product_collections` is an array of product types that this condition applies to if the condition’s `type` is `product_collections`. Each item of the array would be a [`DiscountConditionProductCollection`](../../references/entities/classes/DiscountConditionProductCollection.md).
- `product_tags` is an array of product types that this condition applies to if the condition’s `type` is `product_tags`. Each item of the array would be a [`DiscountConditionProductTag`](../../references/entities/classes/DiscountConditionProductTag.md).
- `customer_groups` is an array of product types that this condition applies to if the condition’s `type` is `customer_groups`. Each item of the array would be a [`DiscountConditionCustomerGroup`](../../references/entities/classes/DiscountConditionCustomerGroup.md).

![Discounts Architecture](https://res.cloudinary.com/dza7lstvk/image/upload/v1678372360/Medusa%20Docs/Diagrams/discounts_ioivrl.png)

---

## See Also

- [Manage discounts using the admin APIs](./admin/manage-discounts.mdx)
- [Use discounts on the storefront](./storefront/use-discounts-in-checkout.mdx)
