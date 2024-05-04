import { zodResolver } from "@hookform/resolvers/zod"
import { DraftOrder } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useAdminUpdateDraftOrder } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { EmailForm } from "../../../../../components/forms/email-form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { EmailSchema } from "../../../../../lib/schemas"

type EditDraftOrderEmailFormProps = {
  draftOrder: DraftOrder
}

export const EditDraftOrderEmailForm = ({
  draftOrder,
}: EditDraftOrderEmailFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EmailSchema>>({
    defaultValues: {
      email: draftOrder.cart.email,
    },
    resolver: zodResolver(EmailSchema),
  })

  const { mutateAsync, isLoading } = useAdminUpdateDraftOrder(draftOrder.id)

  const handleSumbit = form.handleSubmit(async (values) => {
    mutateAsync(values, {
      onSuccess: () => {
        handleSuccess()
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSumbit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="size-full flex-1 overflow-auto">
          <EmailForm control={form.control} layout="stack" />
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
