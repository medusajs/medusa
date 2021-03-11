const { Customer, Region, Cart } = require("@medusajs/medusa");

module.exports = async (connection, data = {}) => {
  const manager = connection.manager;

  await manager.insert(Region, {
    id: "test-region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  });

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
