const { User } = require("@medusajs/medusa")

module.exports = {
  operationId: "GetAdminUser",
  buildEndpoint: (id) => `/admin/users/${id}`,
  setup: async (manager, api) => {
    const adminUser = await manager.create(User, {
      email: "testAdmin@mail.com",
      password: "test",
      api_token: "test_token",
    })
    await manager.save(adminUser)
    return adminUser.id
  },
  snapshotMatch: {
    user: {
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
