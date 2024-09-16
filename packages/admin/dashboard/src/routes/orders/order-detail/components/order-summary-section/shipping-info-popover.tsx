import { InformationCircleSolid } from "@medusajs/icons"
import { AdminOrderShippingMethod } from "@medusajs/types"
import { Badge, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type ShippingInfoPopoverProps = {
  shippingMethod: AdminOrderShippingMethod
}

function ShippingInfoPopover({ shippingMethod }: ShippingInfoPopoverProps) {
  const { t } = useTranslation()
  const shippingDetail = shippingMethod?.detail

  if (!shippingDetail) {
    return
  }

  let rmaType = t("orders.return")
  let rmaId = shippingDetail.return_id

  if (shippingDetail.claim_id) {
    rmaType = t("orders.claim")
    rmaId = shippingDetail.claim_id
  }

  if (shippingDetail.exchange_id) {
    rmaType = t("orders.exchange")
    rmaId = shippingDetail.exchange_id
  }

  if (!rmaId) {
    return
  }

  return (
    <Tooltip
      content={
        <Badge size="2xsmall" rounded="full">
          {rmaType}: #{rmaId.slice(-7)}
        </Badge>
      }
    >
      <InformationCircleSolid className="inline-block text-ui-fg-muted ml-1" />
    </Tooltip>
  )
}

export default ShippingInfoPopover
