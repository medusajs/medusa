import {
  FulfillmentWorkflow,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderClaimDTO,
  OrderDTO,
} from "@medusajs/types"
import {
  ChangeActionType,
  Modules,
  OrderChangeStatus,
  ReturnStatus,
} from "@medusajs/utils"
import {
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../../common"
import { reserveInventoryStep } from "../../../definition/cart/steps/reserve-inventory"
import { confirmVariantInventoryWorkflow } from "../../../definition/cart/workflows/confirm-variant-inventory"
import { createReturnFulfillmentWorkflow } from "../../../fulfillment/workflows/create-return-fulfillment"
import { previewOrderChangeStep, updateReturnsStep } from "../../steps"
import { createOrderClaimItemsFromActionsStep } from "../../steps/claim/create-claim-items-from-actions"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { createReturnItemsFromActionsStep } from "../../steps/return/create-return-items-from-actions"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

type WorkflowInput = {
  claim_id: string
}

const validationStep = createStep(
  "validate-confirm-claim-request",
  async function ({
    order,
    orderChange,
    orderClaim,
  }: {
    order: OrderDTO
    orderClaim: OrderClaimDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

function prepareFulfillmentData({
  order,
  items,
  shippingOption,
  deliveryAddress,
  isReturn,
}: {
  order: OrderDTO
  items: any[]
  shippingOption: {
    id: string
    provider_id: string
    service_zone: {
      fulfillment_set: {
        location?: {
          id: string
          address: Record<string, any>
        }
      }
    }
  }
  deliveryAddress?: Record<string, any>
  isReturn?: boolean
}) {
  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    order.items!.map((i) => [i.id, i])
  )
  const fulfillmentItems = items.map((i) => {
    const orderItem = orderItemsMap.get(i.item_id) ?? i.item
    return {
      line_item_id: i.item_id,
      quantity: !isReturn ? i.quantity : undefined,
      return_quantity: isReturn ? i.quantity : undefined,
      title: orderItem.variant_title ?? orderItem.title,
      sku: orderItem.variant_sku || "",
      barcode: orderItem.variant_barcode || "",
    } as FulfillmentWorkflow.CreateFulfillmentItemWorkflowDTO
  })

  const locationId = shippingOption.service_zone.fulfillment_set.location?.id!

  // delivery address is the stock location address
  const address =
    deliveryAddress ??
    shippingOption.service_zone.fulfillment_set.location?.address ??
    {}

  delete address.id

  return {
    input: {
      location_id: locationId,
      provider_id: shippingOption.provider_id,
      shipping_option_id: shippingOption.id,
      items: fulfillmentItems,
      delivery_address: address,
      order: order,
    },
  }
}

function transformActionsToItems({ orderChange }) {
  const claimItems: OrderChangeActionDTO[] = []
  const returnItems: OrderChangeActionDTO[] = []

  const actions = orderChange.actions ?? []
  actions.forEach((item) => {
    if (item.action === ChangeActionType.RETURN_ITEM) {
      returnItems.push(item)
    } else if (
      item.action === ChangeActionType.ITEM_ADD ||
      item.action === ChangeActionType.WRITE_OFF_ITEM
    ) {
      claimItems.push(item)
    }
  })

  return {
    claimItems: {
      changes: claimItems,
      claimId: claimItems?.[0]?.claim_id!,
    },
    returnItems: {
      changes: returnItems,
      returnId: returnItems?.[0]?.return_id!,
    },
  }
}

function extractShippingOption({ orderPreview, orderClaim, returnId }) {
  if (!orderPreview.shipping_methods?.length) {
    return
  }

  let returnShippingMethod
  let claimShippingMethod
  for (const shippingMethod of orderPreview.shipping_methods) {
    const modifiedShippingMethod_ = shippingMethod as any
    if (!modifiedShippingMethod_.actions) {
      continue
    }

    for (const action of modifiedShippingMethod_.actions) {
      if (action.action === ChangeActionType.SHIPPING_ADD) {
        if (action.return_id === returnId) {
          returnShippingMethod = shippingMethod
        } else if (action.claim_id === orderClaim.id) {
          claimShippingMethod = shippingMethod
        }
      }
    }
  }

  return {
    returnShippingMethod,
    claimShippingMethod,
  }
}

export const confirmClaimRequestWorkflowId = "confirm-claim-request"
export const confirmClaimRequestWorkflow = createWorkflow(
  confirmClaimRequestWorkflowId,
  function (input: WorkflowInput): WorkflowResponse<OrderDTO> {
    const orderClaim: OrderClaimDTO = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: [
        "id",
        "version",
        "canceled_at",
        "items.id",
        "items.title",
        "items.variant_title",
        "items.variant_sku",
        "items.variant_barcode",
        "shipping_address.*",
      ],
      variables: { id: orderClaim.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "actions.id",
        "actions.claim_id",
        "actions.return_id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, orderClaim, orderChange })

    const { claimItems, returnItems } = transform(
      { orderChange },
      transformActionsToItems
    )

    const orderPreview = previewOrderChangeStep(order.id)

    const [createClaimItems, createdReturnItems] = parallelize(
      createOrderClaimItemsFromActionsStep(claimItems),
      createReturnItemsFromActionsStep(returnItems),
      confirmOrderChanges({ changes: [orderChange], orderId: order.id })
    )

    const returnId = transform(
      { createdReturnItems },
      ({ createdReturnItems }) => {
        return createdReturnItems?.[0]?.return_id
      }
    )

    updateReturnsStep([
      {
        id: returnId,
        status: ReturnStatus.REQUESTED,
        requested_at: new Date(),
      },
    ])

    const claimId = transform({ createClaimItems }, ({ createClaimItems }) => {
      return createClaimItems?.[0]?.claim_id
    })

    const { returnShippingMethod, claimShippingMethod } = transform(
      { orderPreview, orderClaim, returnId },
      extractShippingOption
    )

    when({ claimShippingMethod }, ({ claimShippingMethod }) => {
      return !!claimShippingMethod
    }).then(() => {
      const claim: OrderClaimDTO = useRemoteQueryStep({
        entry_point: "order_claim",
        fields: [
          "id",
          "version",
          "canceled_at",
          "order.sales_channel_id",
          "additional_items.quantity",
          "additional_items.raw_quantity",
          "additional_items.item.id",
          "additional_items.item.variant.manage_inventory",
          "additional_items.item.variant.allow_backorder",
          "additional_items.item.variant.inventory_items.inventory_item_id",
          "additional_items.item.variant.inventory_items.required_quantity",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.id",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.name",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.sales_channels.id",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.sales_channels.name",
        ],
        variables: { id: claimId },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "claim-query" })

      const { variants, items } = transform({ claim }, ({ claim }) => {
        const allItems: any[] = []
        const allVariants: any[] = []
        claim.additional_items.forEach((claimItem) => {
          const item = claimItem.item
          allItems.push({
            id: item.id,
            variant_id: item.variant_id,
            quantity: claimItem.raw_quantity ?? claimItem.quantity,
          })
          allVariants.push(item.variant)
        })

        return {
          variants: allVariants,
          items: allItems,
        }
      })

      const formatedInventoryItems = confirmVariantInventoryWorkflow.runAsStep({
        input: {
          skipInventoryCheck: true,
          sales_channel_id: (claim as any).order.sales_channel_id,
          variants,
          items,
        },
      })

      reserveInventoryStep(formatedInventoryItems)
    })

    when({ returnShippingMethod }, ({ returnShippingMethod }) => {
      return !!returnShippingMethod
    }).then(() => {
      const returnShippingOption = useRemoteQueryStep({
        entry_point: "shipping_options",
        fields: [
          "id",
          "provider_id",
          "service_zone.fulfillment_set.location.id",
          "service_zone.fulfillment_set.location.address.*",
        ],
        variables: {
          id: returnShippingMethod.shipping_option_id,
        },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "claim-return-shipping-option" })

      const fulfillmentData = transform(
        {
          order,
          items: order.items!,
          shippingOption: returnShippingOption,
          isReturn: true,
        },
        prepareFulfillmentData
      )

      const returnFulfillment =
        createReturnFulfillmentWorkflow.runAsStep(fulfillmentData)

      const returnLink = transform(
        { returnId, fulfillment: returnFulfillment },
        (data) => {
          return [
            {
              [Modules.ORDER]: { return_id: data.returnId },
              [Modules.FULFILLMENT]: { fulfillment_id: data.fulfillment.id },
            },
          ]
        }
      )

      createRemoteLinkStep(returnLink).config({
        name: "claim-return-shipping-fulfillment-link",
      })
    })

    return new WorkflowResponse(orderPreview)
  }
)
