import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@zjedene-medusa/types"
import { Button, Input, Textarea, toast } from "@zjedene-medusa/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateRefundReason } from "../../../../../hooks/api"

type RefundReasonEditFormProps = {
  refundReason: HttpTypes.AdminRefundReason
}

const RefundReasonEditSchema = z.object({
  label: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
})

export const RefundReasonEditForm = ({
  refundReason,
}: RefundReasonEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof RefundReasonEditSchema>>({
    defaultValues: {
      label: refundReason.label,
      code: refundReason.code,
      description: refundReason.description ?? undefined,
    },
    resolver: zodResolver(RefundReasonEditSchema),
  })

  const { mutateAsync, isPending } = useUpdateRefundReason(refundReason.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: ({ refund_reason }) => {
        toast.success(
          t("refundReasons.edit.successToast", {
            label: refund_reason.label,
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
            name="label"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>
                    {t("refundReasons.fields.label.label")}
                  </Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder={t("refundReasons.fields.label.placeholder")}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="code"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>
                    {t("refundReasons.fields.code.label")}
                  </Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder={t("refundReasons.fields.code.placeholder")}
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
                    {t("refundReasons.fields.description.label")}
                  </Form.Label>
                  <Form.Control>
                    <Textarea
                      {...field}
                      placeholder={t(
                        "refundReasons.fields.description.placeholder"
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
