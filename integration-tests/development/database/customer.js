const { Customer } = require("@medusajs/medusa")

module.exports = async (connection) => {
  const manager = connection.manager

  const customer = await manager.create(Customer, {
    id: "customer-1",
    email: "test1@email.com",
    first_name: "John",
    last_name: "Doe",
    password_hash:
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN",
    // password matching "test"
    has_account: true,
  })
  await manager.save(customer)
}
