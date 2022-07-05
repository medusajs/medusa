import { SalesChannel } from "@medusajs/medusa/dist/models/sales-channel"

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  const salesChannel = manager.create(SalesChannel, {
    id: "sales_channel_1",
    name: "sales channel 1 name",
    description: "sales channel 1 description",
    is_disabled: false
  })
  await manager.save(salesChannel)
}
