import { InformationCircleSolid } from "@medusajs/icons"
import { AdminReturn } from "@medusajs/types"
import { Badge, Popover, Text } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { formatDate } from "../../../../../components/common/date"

type ReturnInfoPopoverProps = {
  orderReturn: AdminReturn
}

function ReturnInfoPopover({ orderReturn }: ReturnInfoPopoverProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  let returnType = "Return"
  let returnTypeId = orderReturn.id

  if (orderReturn.claim_id) {
    returnType = "Claim"
    returnTypeId = orderReturn.claim_id
  }

  if (orderReturn.exchange_id) {
    returnType = "Exchange"
    returnTypeId = orderReturn.exchange_id
  }

  if (typeof orderReturn !== "object") {
    return
  }

  return (
    <Popover open={open}>
      <Popover.Trigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        autoFocus={false}
        className="focus-visible:outline-none align-sub"
      >
        <InformationCircleSolid />
      </Popover.Trigger>

      <Popover.Content
        align="center"
        side="top"
        className="bg-ui-bg-component focus-visible:outline-none p-2"
      >
        <div className="">
          <Badge size="2xsmall" className="mb-2" rounded="full">
            {returnType}: #{returnTypeId.slice(-7)}
          </Badge>

          <Text size="xsmall">
            <span className="text-ui-fg-subtle">
              {t(`orders.returns.returnRequested`)}
            </span>
            {" · "}
            {formatDate(orderReturn.requested_at)}
          </Text>

          <Text size="xsmall">
            <span className="text-ui-fg-subtle">
              {t(`orders.returns.itemReceived`)}
            </span>
            {" · "}
            {orderReturn.received_at
              ? formatDate(orderReturn.received_at)
              : "-"}
          </Text>
        </div>
      </Popover.Content>
    </Popover>
  )
}

export default ReturnInfoPopover
