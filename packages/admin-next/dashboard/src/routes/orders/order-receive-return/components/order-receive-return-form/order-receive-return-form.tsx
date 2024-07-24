import { useTranslation } from "react-i18next"

import { AdminOrder, AdminReturn } from "@medusajs/types"
import { Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { Thumbnail } from "../../../../../components/common/thumbnail"
import { useRouteModal } from "../../../../../components/modals"
import { useStockLocation } from "../../../../../hooks/api"
import { ReceiveReturnSchema } from "./constants"

type OrderAllocateItemsFormProps = {
  order: AdminOrder
  orderReturn: AdminReturn
}

export function OrderReceiveReturnForm({
  order,
  orderReturn,
}: OrderAllocateItemsFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { stock_location } = useStockLocation(
    orderReturn.location_id,
    undefined,
    {
      enabled: !!orderReturn.location_id,
    }
  )

  const form = useForm<zod.infer<typeof ReceiveReturnSchema>>({
    defaultValues: {},
    resolver: zodResolver(ReceiveReturnSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      handleSuccess(`/orders/${order.id}`)

      toast.success(t("general.success"), {
        description: t("orders.receiveReturn.toast.success"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  })

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col overflow-hidden px-6 py-4"
    >
      {orderReturn.items.map((item) => {
        return (
          <div
            key={item.id}
            className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl "
          >
            <div className="flex flex-col items-center gap-x-2 gap-y-2 border-b p-3 text-sm md:flex-row">
              <div className="flex flex-1 items-center gap-x-3">
                <Text size="small" className="text-ui-fg-subtle">
                  {item.quantity}x
                </Text>

                <Thumbnail src={item.item.thumbnail} />
                <div className="flex flex-col">
                  <div>
                    <Text className="txt-small" as="span" weight="plus">
                      {item.item.title}{" "}
                    </Text>
                    {item.item.variant.sku && (
                      <span>({item.item.variant.sku})</span>
                    )}
                  </div>
                  <Text as="div" className="text-ui-fg-subtle txt-small">
                    {item.item.variant.product.title}
                  </Text>
                </div>
              </div>

              <div className="flex flex-1 justify-between">
                <div className="text-ui-fg-subtle txt-small mr-2 flex flex-shrink-0">
                  TODO
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </form>
  )
}
