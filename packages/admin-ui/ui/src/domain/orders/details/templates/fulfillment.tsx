import { capitalize } from "lodash"
import {
  useAdminCancelClaimFulfillment,
  useAdminCancelFulfillment,
  useAdminCancelSwapFulfillment,
} from "medusa-react"
import IconBadge from "../../../../components/fundamentals/icon-badge"
import BuildingsIcon from "../../../../components/fundamentals/icons/buildings-icon"
import CancelIcon from "../../../../components/fundamentals/icons/cancel-icon"
import PackageIcon from "../../../../components/fundamentals/icons/package-icon"
import Actionables from "../../../../components/molecules/actionables"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import useStockLocations from "../../../../hooks/use-stock-locations"
import { getErrorMessage } from "../../../../utils/error-messages"
import { TrackingLink } from "./tracking-link"

export const FormattedFulfillment = ({
  setFullfilmentToShip,
  order,
  fulfillmentObj,
}) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()

  const cancelFulfillment = useAdminCancelFulfillment(order.id)
  const cancelSwapFulfillment = useAdminCancelSwapFulfillment(order.id)
  const cancelClaimFulfillment = useAdminCancelClaimFulfillment(order.id)
  const { getLocationNameById } = useStockLocations()

  const { fulfillment } = fulfillmentObj
  const hasLinks = !!fulfillment.tracking_links?.length

  const getData = () => {
    switch (true) {
      case !!fulfillment?.claim_order_id:
        return {
          resourceId: fulfillment.claim_order_id,
          resourceType: "claim",
        }
      case !!fulfillment?.swap_id:
        return {
          resourceId: fulfillment.swap_id,
          resourceType: "swap",
        }
      default:
        return { resourceId: order?.id, resourceType: "order" }
    }
  }

  const handleCancelFulfillment = async () => {
    const { resourceId, resourceType } = getData()

    const shouldCancel = await dialog({
      heading: "Cancel fulfillment?",
      text: "Are you sure you want to cancel the fulfillment?",
    })

    if (!shouldCancel) {
      return
    }

    switch (resourceType) {
      case "swap":
        return cancelSwapFulfillment.mutate(
          { swap_id: resourceId, fulfillment_id: fulfillment.id },
          {
            onSuccess: () =>
              notification("Success", "Successfully canceled swap", "success"),
            onError: (err) =>
              notification("Error", getErrorMessage(err), "error"),
          }
        )
      case "claim":
        return cancelClaimFulfillment.mutate(
          { claim_id: resourceId, fulfillment_id: fulfillment.id },
          {
            onSuccess: () =>
              notification("Success", "Successfully canceled claim", "success"),
            onError: (err) =>
              notification("Error", getErrorMessage(err), "error"),
          }
        )
      default:
        return cancelFulfillment.mutate(fulfillment.id, {
          onSuccess: () =>
            notification("Success", "Successfully canceled order", "success"),
          onError: (err) =>
            notification("Error", getErrorMessage(err), "error"),
        })
    }
  }

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col space-y-1 py-4">
        <div className="text-grey-90">
          {fulfillment.canceled_at
            ? "Fulfillment has been canceled"
            : `${fulfillmentObj.title} Fulfilled by ${capitalize(
                fulfillment.provider_id
              )}`}
        </div>
        <div className="text-grey-50 flex">
          {!fulfillment.shipped_at ? "Not shipped" : "Tracking"}
          {hasLinks &&
            fulfillment.tracking_links.map((tl, j) => (
              <TrackingLink key={j} trackingLink={tl} />
            ))}
        </div>
        {!fulfillment.canceled_at && fulfillment.location_id && (
          <div className="flex flex-col">
            <div className="text-grey-50 font-semibold">
              {fulfillment.shipped_at ? "Shipped" : "Shipping"} from{" "}
            </div>
            <div className="flex items-center pt-2">
              <IconBadge className="mr-2">
                <BuildingsIcon />
              </IconBadge>
              {getLocationNameById(fulfillment.location_id)}
            </div>
          </div>
        )}
      </div>
      {!fulfillment.canceled_at && !fulfillment.shipped_at && (
        <div className="flex items-center space-x-2">
          <Actionables
            actions={[
              {
                label: "Mark Shipped",
                icon: <PackageIcon size={"20"} />,
                onClick: () => setFullfilmentToShip(fulfillment),
              },
              {
                label: "Cancel Fulfillment",
                icon: <CancelIcon size={"20"} />,
                onClick: () => handleCancelFulfillment(),
              },
            ]}
          />
        </div>
      )}
    </div>
  )
}
