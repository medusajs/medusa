import {
  useAdminCancelClaimFulfillment,
  useAdminCancelFulfillment,
  useAdminCancelSwapFulfillment,
} from "medusa-react"
import { useTranslation } from "react-i18next"
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
import { capitalize } from "lodash"

export const FormattedFulfillment = ({
  setFullfilmentToShip,
  order,
  fulfillmentObj,
}) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const { t } = useTranslation()

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
      heading: t("templates-cancel-fulfillment-heading", "Cancel fulfillment?"),
      text: t(
        "templates-are-you-sure-you-want-to-cancel-the-fulfillment",
        "Are you sure you want to cancel the fulfillment?"
      ),
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
              notification(
                t("templates-success", "Success"),
                t(
                  "templates-successfully-canceled-swap",
                  "Successfully canceled swap"
                ),
                "success"
              ),
            onError: (err) =>
              notification(
                t("templates-error", "Error"),
                getErrorMessage(err),
                "error"
              ),
          }
        )
      case "claim":
        return cancelClaimFulfillment.mutate(
          { claim_id: resourceId, fulfillment_id: fulfillment.id },
          {
            onSuccess: () =>
              notification(
                t("templates-success", "Success"),
                t(
                  "templates-successfully-canceled-claim",
                  "Successfully canceled claim"
                ),
                "success"
              ),
            onError: (err) =>
              notification(
                t("templates-error", "Error"),
                getErrorMessage(err),
                "error"
              ),
          }
        )
      default:
        return cancelFulfillment.mutate(fulfillment.id, {
          onSuccess: () =>
            notification(
              t("templates-success", "Success"),
              t(
                "templates-successfully-canceled-fulfillment",
                "Successfully canceled fulfillment"
              ),
              "success"
            ),
          onError: (err) =>
            notification(
              t("templates-error", "Error"),
              getErrorMessage(err),
              "error"
            ),
        })
    }
  }

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col space-y-1 py-4">
        <div className="text-grey-90">
          {fulfillment.canceled_at
            ? t(
                "templates-fulfillment-has-been-canceled",
                "Fulfillment has been canceled"
              )
            : t(
                "templates-fulfilled-by-provider",
                "{{title}} Fulfilled by {{provider}}",
                {
                  title: fulfillmentObj.title,
                  provider: capitalize(fulfillment.provider_id),
                }
              )}
        </div>
        <div className="text-grey-50 flex">
          {!fulfillment.shipped_at
            ? t("templates-not-shipped", "Not shipped")
            : t("templates-tracking", "Tracking")}
          {hasLinks &&
            fulfillment.tracking_links.map((tl, j) => (
              <TrackingLink key={j} trackingLink={tl} />
            ))}
        </div>
        {!fulfillment.canceled_at && fulfillment.location_id && (
          <div className="flex flex-col">
            <div className="text-grey-50 font-semibold">
              {fulfillment.shipped_at
                ? t("templates-shipped-from", "Shipped from")
                : t("templates-shipping-from", "Shipping from")}{" "}
            </div>
            <div className="flex items-center pt-2">
              <IconBadge className="me-2">
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
                label: t("templates-mark-shipped", "Mark Shipped"),
                icon: <PackageIcon size={"20"} />,
                onClick: () => setFullfilmentToShip(fulfillment),
              },
              {
                label: t("templates-cancel-fulfillment", "Cancel Fulfillment"),
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
