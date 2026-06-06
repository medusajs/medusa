import { InformationCircleSolid } from "@zjedene-medusa/icons"
import { AdminReturn } from "@zjedene-medusa/types"
import { Badge, Popover, Text } from "@zjedene-medusa/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDate } from "../../../../../hooks/use-date"

type ReturnInfoPopoverProps = {
  orderReturn: AdminReturn
}

function ReturnInfoPopover({ orderReturn }: ReturnInfoPopoverProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const { getFullDate } = useDate()

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
        className="align-sub focus-visible:outline-none"
      >
        <InformationCircleSolid />
      </Popover.Trigger>

      <Popover.Content
        align="center"
        side="top"
        className="bg-ui-bg-component p-2 focus-visible:outline-none"
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
            {getFullDate({ date: orderReturn.requested_at, includeTime: true })}
          </Text>

          <Text size="xsmall">
            <span className="text-ui-fg-subtle">
              {t(`orders.returns.itemReceived`)}
            </span>
            {" · "}
            {orderReturn.received_at
              ? getFullDate({
                  date: orderReturn.received_at,
                  includeTime: true,
                })
              : "-"}
          </Text>
        </div>
      </Popover.Content>
    </Popover>
  )
}

export default ReturnInfoPopover
