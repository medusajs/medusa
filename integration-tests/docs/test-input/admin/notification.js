const { Notification } = require("@medusajs/medusa")

module.exports = {
  operationId: "GetNotification",
  buildEndpoint: (_) => `/admin/notifications`,
  setup: async (manager, api) => {
    let res
    try {
      res = manager.create(Notification, {
        resource_type: "order",
        resource_id: "order_01F0BF66ZBXNJ98WDQ9SCWH8Y7",
        event_name: "order.placed",
        to: "test@email.com",
        provider_id: "test-not",
        data: { test_name: "GetNotification" },
        resends: [],
      })
    } catch (err) {
      console.log(err)
    }

    manager.save(res)

    console.log(res)

    return {}
  },
  snapshotMatch: {
    offset: 0,
    limit: 50,
    notifications: [
      {
        id: expect.stringMatching(/^noti_*/),
        resource_type: "order",
        resource_id: "order_01F0BF66ZBXNJ98WDQ9SCWH8Y7",
        event_name: "order.placed",
        to: "test@email.com",
        provider_id: "test-not",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        resends: [],
      },
    ],
  },
}
