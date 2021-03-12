const {
  ShippingProfile,
  Customer,
  MoneyAmount,
  LineItem,
  Country,
  ShippingOption,
  ShippingMethod,
  Product,
  ProductOption,
  ProductVariant,
  Region,
  Order,
} = require("@medusajs/medusa");

module.exports = async (connection, data = {}) => {
  const manager = connection.manager;

  const defaultProfile = await manager.findOne(ShippingProfile, {
    type: "default",
  });

  const prodOption = manager.create(ProductOption, {
    title: "Size",
  });
  const newProdOption = await manager.save(prodOption);

  const prod = manager.create(Product, {
    title: "test product",
    profile_id: defaultProfile.id,
    options: [newProdOption],
  });
  const newProd = await manager.save(prod);

  const prodVar = manager.create(ProductVariant, {
    title: "test variant",
    product_id: newProd.id,
    inventory_quantity: 1,
    options: [
      {
        option_id: newProdOption.id,
        value: "Size",
      },
    ],
  });
  const newProdVar = manager.save(prodVar);

  const ma = manager.create(MoneyAmount, {
    variant_id: newProdVar.id,
    currency_code: "usd",
    amount: 8000,
  });
  await manager.save(ma);

  const region = manager.create(Region, {
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  });
  const newReg = await manager.save(region);

  await manager.query(
    `UPDATE "country" SET region_id='${newReg.id}' WHERE iso_2 = 'us'`
  );

  const customer = manager.create(Customer, {
    email: "test@email.com",
  });
  const newCustomer = await manager.save(customer);

  const shipOpt = manager.create(ShippingOption, {
    name: "test-option",
    provider_id: "test-ful",
    region_id: newReg.id,
    profile_id: defaultProfile.id,
    price_type: "flat_rate",
    amount: 1000,
    data: {},
  });
  const newShipOpt = await manager.save(shipOpt);

  const order = manager.create(Order, {
    customer_id: newCustomer.id,
    email: "test@email.com",
    billing_address: {
      first_name: "lebron",
    },
    shipping_address: {
      first_name: "lebron",
      country_code: "us",
    },
    region_id: newReg.id,
    currency_code: "usd",
    tax_rate: 0,
    discounts: [
      {
        id: "test-discount",
        code: "TEST134",
        is_dynamic: false,
        rule: {
          id: "test-rule",
          description: "Test Discount",
          type: "percentage",
          value: 10,
          allocation: "total",
        },
        is_disabled: false,
        regions: [
          {
            id: newReg.id,
          },
        ],
      },
    ],
    payments: [
      {
        id: "test-payment",
        amount: 10000,
        currency_code: "usd",
        amount_refunded: 0,
        provider_id: "test",
        data: {},
      },
    ],
    items: [
      {
        id: "test-item",
        fulfilled_quantity: 1,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 1,
        variant_id: newProdVar.id,
      },
    ],
    ...data,
  });

  const newOrder = await manager.save(order);

  const shipMeth = manager.create(ShippingMethod, {
    order_id: newOrder.id,
    shipping_option_id: newShipOpt.id,
    price: 1000,
    data: {},
  });

  await manager.save(shipMeth);

  return newOrder;
};
