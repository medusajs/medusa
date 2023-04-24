import React, { FC, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  Location,
  Order,
} from "@medusajs/medusa"
import { useAdminFulfillClaim, useAdminFulfillSwap } from "medusa-react"
import Checkbox from "../../../../components/atoms/checkbox"
import Button from "../../../../components/fundamentals/button"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import BodyCard from "../../../../components/organisms/body-card"
import { useAdminCreateManualFulfillment } from "../../../../hooks/admin/fulfillments"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { useBasePath } from "../../../../utils/routePathing"
import CreateFulfillmentItemsTable from "../../details/create-fulfillment/item-table"
import { FormattedAddress } from "./formatted-address"
import { ShippingPackageItemsQuantityMap } from "../../shipping-labels/types"

export interface FulfillmentFormProps {
  // TODO: Need to support claims and swaps in the future.
  // order: Order | ClaimOrder | Swap
  order: Order
}

export const ManualFulfillmentForm: FC<FulfillmentFormProps> = ({ order }) => {
  const navigate = useNavigate()
  const basePath = useBasePath()
  const notification = useNotification()

  const [toFulfill, setToFulfill] = useState<string[]>([])
  const [quantities, setQuantities] = useState<ShippingPackageItemsQuantityMap>(
    {}
  )
  const [sendNotifications, setSendNotifications] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createOrderFulfillment = useAdminCreateManualFulfillment(order.id)
  const createSwapFulfillment = useAdminFulfillSwap(order.id)
  const createClaimFulfillment = useAdminFulfillClaim(order.id)

  const { shipping_address: toAddress } = order
  // TODO: Need to support claims and swaps in the future.
  // const items = "items" in order ? order.items : order.additional_items
  const orderItems = order.items
  const orderDisplayID = "display_id" in order ? order.display_id : order.id

  const hasItems = useMemo(
    () =>
      toFulfill.length > 0 &&
      Object.values(quantities).some((quantity: number) => quantity > 0),
    [toFulfill, quantities]
  )

  const canCreateFulfilliment = hasItems && !isSubmitting

  const handleCancel = () => {
    navigate(`${basePath}/orders/${order.id}`)
  }

  const handleSubmit = () => {
    const [type] = order.id.split("_")

    setIsSubmitting(true)

    type actionType =
      | typeof createOrderFulfillment
      | typeof createSwapFulfillment
      | typeof createClaimFulfillment

    let action: actionType = createOrderFulfillment
    let successText = "Successfully fulfilled order"
    let requestObj

    switch (type) {
      case "swap":
        action = createSwapFulfillment
        successText = "Successfully fulfilled swap"
        requestObj = {
          swap_id: order.id,
          no_notification: !sendNotifications,
        } as AdminPostOrdersOrderSwapsSwapFulfillmentsReq
        break

      case "claim":
        action = createClaimFulfillment
        successText = "Successfully fulfilled claim"
        requestObj = {
          claim_id: order.id,
          no_notification: !sendNotifications,
        } as AdminPostOrdersOrderClaimsClaimFulfillmentsReq
        break

      default:
        requestObj = {
          no_notification: !sendNotifications,
        } as AdminPostOrdersOrderFulfillmentsReq
        requestObj.items = toFulfill
          .map((itemId) => ({ item_id: itemId, quantity: quantities[itemId] }))
          .filter((t) => !!t)
        break
    }

    action.mutate(requestObj, {
      onSuccess: () => {
        notification("Success", successText, "success")
        handleCancel()
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
        setIsSubmitting(false)
      },
    })
  }

  return (
    <form className="grid grid-cols-12 gap-4">
      <div className="col-span-7">
        <BodyCard
          title="Manually Fulfill Items"
          subtitle={
            <div className="flex gap-2 text-base">
              <span>Order # {orderDisplayID}</span>
              <span>|</span>
              <span>
                {new Date(order.created_at).toLocaleDateString("us", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          }
          className="min-h-0"
        >
          <div className="flex mt-2 space-x-6 divide-x">
            <div className="grow">
              <div className="inter-small-regular text-grey-50 mb-1 whitespace-pre">
                Shipping method
              </div>

              <div className="text-grey-90 active:text-violet-90 gap-x-1 flex items-center">
                <span>
                  {order.shipping_methods[0]?.shipping_option.name ?? "None"}
                </span>
              </div>
            </div>

            <div className="pl-6 grow">
              <div className="inter-small-regular text-grey-50 mb-1">
                Shipping to
              </div>
              <FormattedAddress address={toAddress} />
            </div>
          </div>

          <div className="mt-12">
            <CreateFulfillmentItemsTable
              items={orderItems}
              toFulfill={toFulfill}
              setToFulfill={setToFulfill}
              quantities={quantities}
              setQuantities={setQuantities}
            />
          </div>
        </BodyCard>
      </div>

      <div className="col-span-5">
        <BodyCard
          title="Complete fulfillment"
          className="sticky top-0 h-auto min-h-0 grow-0"
        >
          <div className="space-y-8 divide-y">
            <div className="pt-2 flex flex-col gap-4">
              <Checkbox
                label={
                  <span className="inline-flex items-center gap-x-xsmall">
                    Send shipping information to customers now.
                    <IconTooltip content="" />
                  </span>
                }
                onChange={() => setSendNotifications(!sendNotifications)}
                checked={sendNotifications}
              />
            </div>

            <div className="pt-8 flex flex-col gap-4">
              <Button
                size="large"
                className="justify-center"
                variant="primary"
                disabled={!canCreateFulfilliment}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Submitting" : "Complete fulfillment"}
              </Button>

              <Button
                variant="secondary"
                className="justify-center"
                size="large"
                disabled={isSubmitting}
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </BodyCard>
      </div>
    </form>
  )
}
