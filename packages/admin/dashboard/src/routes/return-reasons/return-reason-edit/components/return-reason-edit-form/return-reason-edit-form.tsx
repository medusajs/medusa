import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateReturnReason } from "../../../../../hooks/api/return-reasons"

type ReturnReasonEditFormProps = {
  returnReason: HttpTypes.AdminReturnReason
}

const ReturnReasonEditSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
})

export const ReturnReasonEditForm = ({
  returnReason,
}: ReturnReasonEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof ReturnReasonEditSchema>>({
    defaultValues: {
      value: returnReason.value,
      label: returnReason.label,
      description: returnReason.description ?? undefined,
    },
    resolver: zodResolver(ReturnReasonEditSchema),
  })

  const { mutateAsync, isPending } = useUpdateReturnReason(returnReason.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: ({ return_reason }) => {
        toast.success(
          t("returnReasons.edit.successToast", {
            label: return_reason.label,
          })
        )
        handleSuccess()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        className="flex size-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-4 overflow-auto">
          <Form.Field
            control={form.control}
            name="value"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label tooltip={t("returnReasons.fields.value.tooltip")}>
                    {t("returnReasons.fields.value.label")}
                  </Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder={t("returnReasons.fields.value.placeholder")}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="label"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>
                    {t("returnReasons.fields.label.label")}
                  </Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder={t("returnReasons.fields.label.placeholder")}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>
                    {t("returnReasons.fields.description.label")}
                  </Form.Label>
                  <Form.Control>
                    <Textarea
                      {...field}
                      placeholder={t(
                        "returnReasons.fields.description.placeholder"
                      )}
                    />
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
              <Button variant="secondary" size="small" type="button">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
