const { Customer } = require("@medusajs/medusa");

module.exports = async (connection, data = {}) => {
  const manager = connection.manager;

  await manager.insert(Customer, {
    id: "test-customer-1",
    email: "test1@email.com",
  });

  await manager.insert(Customer, {
    id: "test-customer-2",
    email: "test2@email.com",
  });

  await manager.insert(Customer, {
    id: "test-customer-3",
    email: "test3@email.com",
  });
};
