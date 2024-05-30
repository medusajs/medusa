import { zodResolver } from "@hookform/resolvers/zod"
import { DraftOrder } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useAdminUpdateDraftOrder } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { TransferOwnerShipForm } from "../../../../../components/forms/transfer-ownership-form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { TransferOwnershipSchema } from "../../../../../lib/schemas"

type TransferDraftOrderOwnershipFormProps = {
  draftOrder: DraftOrder
}

export const TransferDraftOrderOwnershipForm = ({
  draftOrder,
}: TransferDraftOrderOwnershipFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof TransferOwnershipSchema>>({
    defaultValues: {
      current_owner_id: draftOrder.cart.customer_id,
      new_owner_id: "",
    },
    resolver: zodResolver(TransferOwnershipSchema),
  })

  const { mutateAsync, isLoading } = useAdminUpdateDraftOrder(draftOrder.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(
      {
        customer_id: values.new_owner_id,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="size-full flex-1 overflow-auto">
          <TransferOwnerShipForm order={draftOrder} control={form.control} />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" isLoading={isLoading} size="small">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
