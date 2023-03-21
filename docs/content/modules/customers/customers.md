---
description: 'Learn about what Customers are in Medusa and how they are implemented. Customers are individuals that make purchases in your store.'
---

# Customers

In this document, you’ll learn about Customers and their relation to other entities in Medusa.

## Introduction

Customers are individuals that make purchases in your store. In Medusa, there are two types of customers: registered customers and guests or unregistered customers.

Both registered and unregistered customers can make purchases. However, only registered customers can log into their accounts and manage their details and orders.

An admin user can view and manage their customers, their details, their orders, and what customer group they’re in.

---

## Customer Entity Overview

A customer is stored in the database as a `Customer` entity. A customer has attributes related to the customer’s details such as `first_name`, `last_name`, and `phone`. However, the only required attribute is `email`.

### has_account Attribute

As mentioned earlier, customers can be either registered or unregistered. The type of customer is identified in the `has_account` attribute. This is a boolean attribute that indicates whether the customer is registered.

For example, when a guest customer places an order, a new `Customer` record is created with the email used (if it doesn’t already exist) and the value for `has_account` is `false`. When the unregistered customer creates an account using the same email, a new `Customer` record will be created with the value of `has_account` set to `true`.

### Email Uniqueness

An email is unique to a type of customer. So, an email can be associated with only one registered customer (where `has_account` is `true`), and one unregistered customer (where `has_account` is `false`).

In the example mentioned above, after the unregistered customer places an order with an email, then creates an account with the same email, two `Customer` records are created. Each of these records have different `has_account` value.

:::info

This architecture allows creating the Claim Order flow, where a registered customer can claim an order they placed as an unregistered customer. You can learn more about it in [this documentation](../orders/storefront/implement-claim-order.mdx).

:::

---

## Relations to Other Entities

### CustomerGroup

Customer groups allow dividing customers into groups of similar attributes, then apply special pricing or rules for these customer groups.

:::info

You can learn more about customer groups in [this documentation](./customer-groups.md).

:::

A customer can belong to more than one customer group. The relation between the `Customer` and `CustomerGroup` entities is available on both entities:

- You can access the customer groups of a customer by expanding the `groups` relation and accessing `customer.groups`.
- You can access the customers in a customer group by expanding the `customers` relation and accessing `customerGroup.customers`.

### Orders

Customers can have more than one order. The relation between the `Customer` and `Order` entities is available on both entities:

- You can access the orders of a customer by expanding the `orders` relation and accessing `customer.orders`.
- You can access the customer that placed an order by expanding the `customer` relation and accessing `order.customer`.

### Address

A customer can have a billing address and more than one shipping address. Both billing and shipping addresses are represented by the `Address` entity.

The relation between the `Customer` and `Address` entities is available on both entities:

- You can access the billing address of a customer by expanding the `billing_address` relation and accessing `customer.billing_address`. You can also access the shipping addresses of a customer by expanding the `shipping_addresses` relation and accessing `customer.shipping_addresses`.
- Likewise, you can access the customer that an address is associated with by expanding the `customer` relation and accessing `address.customer`.

---

## See Also

- [Implement customer profiles in the storefront](./storefront/implement-customer-profiles.mdx)
- [Manage customers using the admin APIs](./admin/manage-customers.mdx)
