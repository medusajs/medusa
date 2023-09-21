---
description: 'Learn what Customer Groups are and how they can be used in the Medusa backend. Customer Groups allow to combine customers with similar attributes into a single group.'
---

# Customer Groups

In this document, you’ll learn about Customer Groups and how they can be used in Medusa.

## Introduction

Customer groups allow you to combine customers with similar attributes such as purchase habits, region, or for any reason that works for your business model.

You can then assign different prices for customer groups using price lists.

### Examples Use Cases

The customer groups feature can be used in a variety of use cases including:

- Implement a B2B business model by assigning a specific customer group for wholesale customers.
- Combine customers that make purchases frequently into a group and give them a special discount.
- Create different customer groups based on different buyer personas.

---

## CustomerGroup Entity Overview

A customer group is stored in the database as a [CustomerGroup](../../references/entities/classes/CustomerGroup.md) entity. This entity has two attributes other than the `id`: `name` and `metadata`.

Similar to all entities in Medusa, you can use the `metadata` object attribute to store any custom data you want. For example, you can add some flag or tag to the customer group for a custom use case:

```js noReport
metadata: {
	is_seller: true
}
```

---

## Relations to Other Entities

### Customer

A customer can belong to multiple customer groups, and a customer group can have more than one customer. After creating a customer group, you can manage customers in that group.

The relation between the `Customer` and `CustomerGroup` entities is available on both entities:

- You can access the customer groups of a customer by expanding the `groups` relation and accessing `customer.groups`.
- You can access the customers in a customer group by expanding the `customers` relation and accessing `customerGroup.customers`.

### PriceList

A price list can have multiple conditions to define in which cases it should be applied. One of those conditions is customer groups. You can specify more than one customer group to apply the prices on.

The relation between the `PriceList` and `CustomerGroup` entities is available on both entities:

- You can access the customer groups of a price list by expanding the `customer_groups` relation and accessing `price_list.customer_groups`.
- You can access the price lists that are applied to a customer group by expanding the `price_lists` relation and accessing `customerGroup.price_lists`.

---

## See Also

- [Manage customer groups using the Admin APIs](./admin/manage-customer-groups.mdx)
