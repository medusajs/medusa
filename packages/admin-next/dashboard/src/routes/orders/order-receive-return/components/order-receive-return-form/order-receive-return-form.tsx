import { useTranslation } from "react-i18next"

import { AdminOrder } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { useRouteModal } from "../../../../../components/modals"
import { ReceiveReturnSchema } from "./constants"

type OrderAllocateItemsFormProps = {
  order: AdminOrder
}

export function OrderReceiveReturnForm({ order }: OrderAllocateItemsFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

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
      className="flex h-full flex-col overflow-hidden"
    >
      TODO
    </form>
  )
}
