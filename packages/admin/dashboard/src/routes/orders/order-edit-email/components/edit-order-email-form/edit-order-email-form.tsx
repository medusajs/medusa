import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@zjedene-medusa/types"
import { Button, Input, toast } from "@zjedene-medusa/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateOrder } from "../../../../../hooks/api/orders"

type EditOrderEmailFormProps = {
  order: HttpTypes.AdminOrder
}

const EditOrderEmailSchema = zod.object({
  email: zod.string().email(),
})

export function EditOrderEmailForm({ order }: EditOrderEmailFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditOrderEmailSchema>>({
    defaultValues: {
      email: order.email || "",
    },
    resolver: zodResolver(EditOrderEmailSchema),
  })

  const { mutateAsync, isPending } = useUpdateOrder(order.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await mutateAsync({
        email: data.email,
      })
      toast.success(
        t("orders.edit.email.requestSuccess", { email: data.email })
      )
      handleSuccess()
    } catch (error) {
      toast.error((error as Error).message)
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex-1 overflow-auto">
          <Form.Field
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.email")}</Form.Label>

                  <Form.Control>
                    <Input type="email" {...field} />
                  </Form.Control>

                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button
              isLoading={isPending}
              type="submit"
              variant="primary"
              size="small"
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
