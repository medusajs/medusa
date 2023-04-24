import React from "react"
import {
  useAdminCancelClaimFulfillment,
  useAdminCancelFulfillment,
  useAdminCancelSwapFulfillment,
} from "medusa-react"
import Button from "../../../../components/fundamentals/button"
import CancelIcon from "../../../../components/fundamentals/icons/cancel-icon"
import DownloadIcon from "../../../../components/fundamentals/icons/download-icon"
import PackageIcon from "../../../../components/fundamentals/icons/package-icon"
import Actionables from "../../../../components/molecules/actionables"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { TrackingLink } from "./tracking-link"
import { useBasePath } from "../../../../utils/routePathing"
import moment from "moment"
import { Link } from "react-router-dom"

export const FormattedFulfillment = ({
  setFulfillmentToShip,
  order,
  fulfillmentObj,
}) => {
  const basePath = useBasePath()
  const dialog = useImperativeDialog()
  const notification = useNotification()

  const cancelFulfillment = useAdminCancelFulfillment(order.id)
  const cancelSwapFulfillment = useAdminCancelSwapFulfillment(order.id)
  const cancelClaimFulfillment = useAdminCancelClaimFulfillment(order.id)

  const { fulfillment } = fulfillmentObj
  const hasShippingLabel =
    !fulfillment.canceled_at &&
    !fulfillment.shipped_at &&
    !!fulfillment.data?.label_link
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
            notification("Success", "Fulfillment Canceled", "success"),
          onError: (err) =>
            notification("Error", getErrorMessage(err), "error"),
        })
    }
  }

  const handlePrintShippingLabel = () =>
    window.open(fulfillment.data.label_link, "_blank")

  const actions = fulfillment?.parent_id
    ? []
    : [
        {
          label: "Mark Shipped",
          icon: <PackageIcon size={"20"} />,
          onClick: () => setFulfillmentToShip(fulfillment),
        },
        {
          label: hasShippingLabel
            ? "Void Shipping Label"
            : "Cancel Fulfillment",
          icon: <CancelIcon size={"20"} />,
          onClick: handleCancelFulfillment,
        },
      ]

  if (hasShippingLabel) {
    actions.unshift({
      label: "Download Shipping Label",
      icon: <DownloadIcon size={"20"} />,
      onClick: handlePrintShippingLabel,
    })
  }

  const providerName = {
    manual: "Manual",
    shipengine: "ShipEngine",
    shipstation: "ShipStation",
    unisco: "Unsico",
  }

  const selectProviderName = (fulfillment) => {
    return providerName[fulfillment.provider_id]
  }

  const carrierName = {
    fedex: "FedEx",
    ups: "UPS",
    usps: "USPS",
    stamps_com: "USPS",
  }

  return (
    <div className="pt-8">
      <div className="flex w-full items-center justify-between gap-8 mb-4">
        <h3 className="inter-base-semibold text-grey-90 mt-0">
          {fulfillmentObj.title}
        </h3>

        {!fulfillment.canceled_at && !fulfillment.shipped_at && (
          <div className="flex items-start">
            <Actionables actions={actions} />
          </div>
        )}
      </div>

      <div className="flex w-full">
        <div className="max-w-[50%] grow">
          <div className="text-grey-90">
            {fulfillment.canceled_at ? (
              <>Fulfillment has been canceled</>
            ) : (
              <>Fulfilled by {selectProviderName(fulfillment)}</>
            )}
          </div>

          <div className="text-grey-50">
            {moment(fulfillment.created_at).format("DD MMMM YYYY hh:mm a")}
          </div>

          <div>
            <h3 className="inter-small-semibold text-grey-90 mt-4  mb-2">
              Track Package
            </h3>

            {fulfillment.data?.carrier_code && (
              <div className="text-grey-90">
                {carrierName[fulfillment.data.carrier_code]}
                <br />{" "}
              </div>
            )}

            <div className="text-grey-50">
              {!fulfillment.shipped_at ? "Not shipped" : "Shipped"}
            </div>

            {hasLinks && (
              <>
                {fulfillment.tracking_links.map((tl, j) => (
                  <TrackingLink key={j} trackingLink={tl} />
                ))}
              </>
            )}
          </div>

          {hasShippingLabel && (
            <div className="mt-4">
              <Button
                variant="secondary"
                size="small"
                className="no-underline mt-2"
                onClick={handlePrintShippingLabel}
              >
                Print Shipping Label
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-[50%] grow flex flex-col">
          <h3 className="inter-small-semibold text-grey-90 mb-2">Items</h3>

          <div className="flex flex-col gap-2">
            {fulfillment.items.map((item) => {
              const orderItem = order.items.find((oi) => oi.id === item.item_id)
              return (
                <div key={orderItem.id} className="flex gap-2">
                  <div className="text-grey-90">
                    {!!orderItem.variant && (
                      <Link
                        to={`${basePath}/products/${orderItem.variant.product_id}`}
                        className="block"
                      >
                        {orderItem.variant.product.title}
                        <br />
                        <span className="text-grey-50">
                          {orderItem.variant.title}
                        </span>
                      </Link>
                    )}
                    {!orderItem.variant && (
                      <div className="block">{orderItem.title}</div>
                    )}
                  </div>
                  <div className="grow" />
                  <div className="text-grey-50">(x{item.quantity})</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
