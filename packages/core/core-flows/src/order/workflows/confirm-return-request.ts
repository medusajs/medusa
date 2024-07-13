import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  ReturnDTO,
} from "@medusajs/types"
import { ChangeActionType, ModuleRegistrationName } from "@medusajs/utils"
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../utils/order-validation"

const validationStep = createStep(
  "validate-create-return-shipping-method",
  async function ({
    order,
    orderChanges,
    orderReturn,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChanges: OrderChangeDTO[]
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange: orderChanges })
  }
)

const createReturnItems = createStep(
  "create-return-teism",
  async (
    input: { changes: OrderChangeActionDTO[]; returnId: string },
    { container }
  ) => {
    const orderModuleService = container.resolve(ModuleRegistrationName.ORDER)

    const orderItems = input.changes.filter(
      (action) => action.action === ChangeActionType.RETURN_ITEM
    )

    const returnItems = orderItems.map((item) => {
      return {
        return_id: item.reference_id,
        item_id: item.details?.reference_id,
        quantity: item.details?.quantity as number,
        note: item.internal_note,
        metadata: (item.details?.metadata as Record<string, unknown>) ?? {},
      }
    })

    // TODO: For some reason, this call is throwing: 'Return with id \"\" not found' even though the return ID is passed
    const createdReturnItems = await orderModuleService.updateReturns(
      input.returnId,
      { items: returnItems }
    )
  }
)

const confirmOrderChanges = createStep(
  "confirm-order-changes",
  async (input: { changes: OrderChangeActionDTO[] }, { container }) => {
    const orderModuleService = container.resolve(ModuleRegistrationName.ORDER)

    await orderModuleService.confirmOrderChange(
      input.changes.map((action) => action.id)
    )
  }
)

export const confirmReturnRequestWorkflowId = "confirm-return-request"
export const confirmReturnRequestWorkflow = createWorkflow(
  confirmReturnRequestWorkflowId,
  function (input: { return_id: string }): WorkflowData<string> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "items"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    // TODO: For some reason, this call is only returning a single order change with a single action 'RETURN_ITEM'
    //  even though there are multiple actions in the order change with the passed (order_id, return_id)
    const orderChanges: OrderChangeDTO[] = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "actions.id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      variables: {
        order_id: orderReturn.order_id,
        return_id: orderReturn.id,
      },
    }).config({ name: "order-change-query" })

    const changes = transform({ orderChanges }, (data) => {
      return data.orderChanges
        .map((change) => {
          return change.actions.map((action) => action)
        })
        .flat()
    })

    validationStep({ order, orderReturn, orderChanges })

    createReturnItems({ returnId: orderReturn.id, changes })

    confirmOrderChanges({ changes })

    // @ts-ignore
    return order.id
  }
)
