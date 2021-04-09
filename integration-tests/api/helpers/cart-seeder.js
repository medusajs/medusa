const {
  Customer,
  Region,
  Cart,
  DiscountRule,
  Discount,
} = require("@medusajs/medusa");

module.exports = async (connection, data = {}) => {
  const manager = connection.manager;

  const r = manager.create(Region, {
    id: "test-region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  });

  await manager.insert(DiscountRule, {
    id: "test-discount-rule",
    description: "Dynamic rule",
    type: "percentage",
    value: 10,
    allocation: "total",
  });

  await manager.insert(Discount, {
    id: "test-discount",
    code: "DYNAMIC",
    rule_id: "test-discount-rule",
    is_dynamic: true,
    usage_count: 0,
    usage_limit: 1,
    is_disabled: false,
  });

  const d = await manager.create(Discount, {
    id: "test-discount",
    code: "CREATED",
    is_dynamic: false,
    is_disabled: false,
  });

  const dr = await manager.create(DiscountRule, {
    id: "test-discount-rule",
    description: "Created",
    type: "fixed",
    value: 10000,
    allocation: "total",
  });

  d.rule = dr;
  d.regions = [r];

  await manager.save(d);

  await manager.query(
    `UPDATE "country" SET region_id='test-region' WHERE iso_2 = 'us'`
  );

  await manager.insert(Customer, {
    id: "test-customer",
    email: "test@email.com",
  });

  await manager.insert(Customer, {
    id: "test-customer-2",
    email: "test-2@email.com",
  });

  await manager.insert(Customer, {
    id: "some-customer",
    email: "some-customer@email.com",
  });

  const cart = manager.create(Cart, {
    id: "test-cart",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    shipping_address: {
      id: "test-shipping-address",
      first_name: "lebron",
      country_code: "us",
    },
    region_id: "test-region",
    currency_code: "usd",
    items: [],
  });

  await manager.save(cart);
};
