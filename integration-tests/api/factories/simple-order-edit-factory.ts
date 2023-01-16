import { DataSource } from "typeorm"
import { OrderFactoryData, simpleOrderFactory } from "./simple-order-factory"
import { OrderEdit } from "@medusajs/medusa"

export type OrderEditFactoryData = {
  id?: string
  order?: OrderFactoryData
  order_id?: string
  internal_note?: string
  declined_reason?: string
  payment_collection_id?: string
  confirmed_at?: Date | string
  confirmed_by?: string
  created_at?: Date | string
  created_by?: string
  requested_at?: Date | string
  requested_by?: string
  canceled_at?: Date | string
  canceled_by?: string
  declined_at?: Date | string
  declined_by?: string
}

export const simpleOrderEditFactory = async (
  dataSource: DataSource,
  data: OrderEditFactoryData = {}
): Promise<OrderEdit> => {
  const manager = dataSource.manager

  if (!data.order_id) {
    const order = await simpleOrderFactory(dataSource, data.order)
    data.order_id = order.id
  }

  const orderEdit = manager.create<OrderEdit>(OrderEdit, {
    id: data.id,
    order_id: data.order_id,
    internal_note: data.internal_note,
    declined_reason: data.declined_reason,
    declined_at: data.declined_at,
    declined_by: data.declined_by,
    canceled_at: data.canceled_at,
    canceled_by: data.canceled_by,
    requested_at: data.requested_at,
    requested_by: data.requested_by,
    created_at: data.created_at,
    created_by: data.created_by,
    confirmed_at: data.confirmed_at,
    confirmed_by: data.confirmed_by,
    payment_collection_id: data.payment_collection_id,
  })

  return await manager.save<OrderEdit>(orderEdit)
}
