import { OrderEditItemChangeType, OrderItemChange } from "@medusajs/medusa"
import { DataSource } from "typeorm"

type OrderItemChangeData = {
  id: string
  type: OrderEditItemChangeType
  order_edit_id: string
  original_line_item_id?: string
  line_item_id?: string
}

export const simpleOrderItemChangeFactory = async (
  dataSource: DataSource,
  data: OrderItemChangeData
) => {
  const manager = dataSource.manager
  const change = manager.create<OrderItemChange>(OrderItemChange, {
    id: data.id,
    type: data.type,
    order_edit_id: data.order_edit_id,
    line_item_id: data.line_item_id,
    original_line_item_id: data.original_line_item_id,
  })

  return await manager.save<OrderItemChange>(change)
}
