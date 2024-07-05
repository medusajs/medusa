# Pricing Concepts

In this document, you’ll learn about the main concepts in the Pricing Module, and how data is stored and related.

## Money Amount

A `MoneyAmount` represents a price.

Money amounts can be conditioned by the `min_quantity` and `max_quantity` attributes, which are helpful when calculating the price for a specific quantity.

If a money amount has its `min_quantity` or `max_quantity` attributes set, they’re only considered for the price calculation if they have a lower `min_quantity` or a higher `max_quantity` than the quantity specified for calculation.

---

## Price Set

A `PriceSet` represents a collection of money amounts that are linked to a resource (for example, a product or a shipping option). The Price Set and Money Amount relationship is represented by the `PriceSetMoneyAmount` entity.

![A diagram showcasing the relation between the price set and money amount](https://res.cloudinary.com/dza7lstvk/image/upload/v1700573983/Medusa%20Docs/Diagrams/price-set-money-amount_xpwria.jpg)

---

## Prices with Rules

### Rule Type

Each money amount within a price set can be a price that’s applied for different conditions. These conditions are represented as rule types.

A `RuleType` defines custom conditions. Each rule type has a unique `rule_attribute`, referenced in rule values, such as when setting a rule of a money amount.

### Price Rule

Each rule of a money amount within a price set is represented by the `PriceRule` entity, which holds the value of a rule type. The `PriceSetMoneyAmount` has a `rules_count` attribute, which indicates how many rules, represented by `PriceRule`, are applied to the money amount.

![A diagram showcasing the relation between the PriceRule, PriceSet, MoneyAmount, RuleType, and PriceSetMoneyAmount](https://res.cloudinary.com/dza7lstvk/image/upload/v1702395550/Medusa%20Docs/Diagrams/price-rule-1_h7mdwg.jpg)

For example, you can create a `zip_code` rule type. Then, a money amount within the price set can have the rule value `zip_code: 10557`, indicating that the money amount can only be applied within the `10557` zip code.

Each money amount within the price set can have different values for the same rule type.

For example, this diagram showcases two money amounts having different values for the same rule type:

![A diagram showcasing the relation between the PriceRule, PriceSet, MoneyAmount, RuleType, and PriceSetMoneyAmount with two money amounts.](https://res.cloudinary.com/dza7lstvk/image/upload/v1702395596/Medusa%20Docs/Diagrams/price-rule-2_x5be7v.jpg)

Each money amount can have multiple rules applied to it as well.

For example, a money amount can have the rules `zip_code` and `region_id` applied to it. In this case, the value of each rule is represented by a `PriceRule`.

![A diagram showcasing the relation between the PriceRule, PriceSet, MoneyAmount, RuleType, and PriceSetMoneyAmount with multiple rules.](https://res.cloudinary.com/dza7lstvk/image/upload/v1702395641/Medusa%20Docs/Diagrams/price-rule-3_uvwjj5.jpg)

### PriceSetRuleType

The `PriceSetRuleType` entity indicates what rules the money amounts can have within a price set. It creates a relation between the `PriceSet` and `RuleType` entities.

For example, to use the `zip_code` rule type on a money amount in a price set, the rule type must first be enabled on the price set through the `PriceSetRuleType`.

![A diagram showcasing the relation between the PriceSet, PriceRule, MoneyAmount, PriceSetMoneyAmount, RuleType, and PriceSetRuleType](https://res.cloudinary.com/dza7lstvk/image/upload/v1702395692/Medusa%20Docs/Diagrams/price-set-rule-type_tmxbdw.jpg)

---

## Price List

A `PriceList` is a group of prices only enabled if their rules are satisfied. A price list has optional `start_date` and `end_date` attributes, which indicate the date range in which a price list can be applied.

Its associated prices are represented by the `PriceSetMoneyAmount` entity, which is used to store the money amounts of a price set.

Each rule that can be applied to a price list is represented by the `PriceListRule` entity. The `rules_count` attribute of a `PriceList` indicates how many rules are applied to it.

Each rule of a price list can have more than one value, representing its values by the `PriceListRuleValue` entity.

![A diagram showcasing the relation between the PriceSet, PriceList, MoneyAmount, PriceSetMoneyAmount, RuleType, and PriceListRuleValue](https://res.cloudinary.com/dza7lstvk/image/upload/v1702395768/Medusa%20Docs/Diagrams/price-list_bjbknv.jpg)

---

## Use Case Example: Pricing and Product Modules

In a real use case, you would use the Pricing Module with your custom logic or other Medusa Commerce Modules, such as the Product Module.

When used with the Product Module, a product variant’s prices are stored as money amounts belonging to a price set. A relation is formed between the `ProductVariant` and the `PriceSet` when the modules are linked.

![A diagram showcasing an example of how resources from the Pricing and Product module are linked. The PriceSet is linked to the ProductVariant of the Pricing Module.](https://res.cloudinary.com/dza7lstvk/image/upload/v1700574189/Medusa%20Docs/Diagrams/pricing-product_jcsjt0.jpg)

So, when you want to add prices for a product variant, you create a price set and add the prices as money amounts to it. You can then benefit from adding rules to prices or using the `calculatePrices` method to retrieve the price of a product variant within a specified context.
