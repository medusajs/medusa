import {
  AdminClaim,
  AdminExchange,
  AdminOrderLineItem,
  AdminReturn,
} from "@medusajs/types"
import { Popover, Text } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Thumbnail } from "../../../../../components/common/thumbnail"

type ActivityItemsProps = {
  itemsToSend?:
    | AdminClaim["additional_items"]
    | AdminExchange["additional_items"]
  itemsToReturn?: AdminReturn["items"]
  itemsMap?: Map<string, AdminOrderLineItem>
  title: string
}

function ActivityItems(props: ActivityItemsProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const itemsToSend = props.itemsToSend
  const itemsToReturn = props.itemsToReturn
  const itemsMap = props.itemsMap
  const title = props.title

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  if (!itemsToSend?.length && !itemsToReturn?.length) {
    return
  }

  return (
    <Popover open={open}>
      <Popover.Trigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        autoFocus={false}
      >
        <Text size="small" leading="compact" weight="plus">
          {title}
        </Text>
      </Popover.Trigger>

      <Popover.Content
        align="center"
        side="top"
        className="bg-ui-bg-component p-0"
      >
        <div className="flex flex-col">
          {!!itemsToSend?.length && (
            <div className="p-3">
              <div className="txt-compact-small-plus">
                {t("orders.activity.events.common.toSend")}
              </div>

              <div className="flex flex-col items-center">
                {itemsToSend?.map((item) => {
                  const originalItem = itemsMap?.get(item.item_id)!

                  return (
                    <div
                      className="flex flex-1 items-center gap-x-3"
                      key={item.id}
                    >
                      <Text size="small" className="text-ui-fg-subtle">
                        {item.quantity}x
                      </Text>

                      <Thumbnail
                        src={originalItem?.variant?.product?.thumbnail}
                      />
                      <div className="">
                        <Text className="txt-compact-small text-ui-fg-subtle">
                          {`${originalItem?.variant?.title} · ${originalItem?.variant?.product?.title}`}
                        </Text>
                      </div>
                    </div>
                  )
                })}

                <div className="flex flex-1 flex-row items-center gap-2"></div>
              </div>
            </div>
          )}

          {!!itemsToReturn?.length && (
            <div className="border-t-2 border-dotted p-3">
              <div className="txt-compact-small-plus">
                {t("orders.activity.events.common.toReturn")}
              </div>

              <div className="flex flex-col items-center">
                {itemsToReturn?.map((item) => {
                  const originalItem = itemsMap?.get(item.item_id)!

                  return (
                    <div
                      className="flex flex-1 items-center gap-x-3"
                      key={item.id}
                    >
                      <Text size="small" className="text-ui-fg-subtle">
                        {item.quantity}x
                      </Text>

                      <Thumbnail
                        src={originalItem?.variant?.product?.thumbnail}
                      />
                      <div className="">
                        <Text className="txt-compact-small text-ui-fg-subtle">
                          {`${originalItem?.variant?.title} · ${originalItem?.variant?.product?.title}`}
                        </Text>
                      </div>
                    </div>
                  )
                })}

                <div className="flex flex-1 flex-row items-center gap-2"></div>
              </div>
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover>
  )
}

export default ActivityItems
