import { OrderEditItemChangeService } from "../../../services"

export async function validateOrderEditItemChange(req, res, next) {
  const orderEditId = req.params.id
  const orderEdiItemChangeId = req.params.change_id
  const orderEditItemChangeService: OrderEditItemChangeService =
    req.scope.resolve("orderEditItemChangeService")

  try {
    req.order_edit_item_change =
      await orderEditItemChangeService.retrieveItemChangeByOrderEdit(
        orderEdiItemChangeId,
        orderEditId
      )
  } catch (error) {
    return next(error)
  }

  next()
}
