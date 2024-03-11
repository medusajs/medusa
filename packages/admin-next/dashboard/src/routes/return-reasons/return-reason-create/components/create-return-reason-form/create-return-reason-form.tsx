import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, Textarea, clx } from "@medusajs/ui"
import { useAdminCreateReturnReason } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"

const CreateReturnReasonSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
  description: z.string().optional(),
})

export const CreateReturnReasonForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateReturnReasonSchema>>({
    defaultValues: {
      value: "",
      label: "",
      description: "",
    },
    resolver: zodResolver(CreateReturnReasonSchema),
  })

  const { mutateAsync, isLoading } = useAdminCreateReturnReason()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: () => {
        handleSuccess()
      },
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-hidden">
          <div
            className={clx(
              "flex h-full w-full flex-col items-center overflow-y-auto p-16"
            )}
          >
            <div className="flex w-full max-w-[720px] flex-col gap-y-8">
              <div>
                <Heading>{t("returnReasons.createReason")}</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("returnReasons.createReasonHint")}
                </Text>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Field
                  control={form.control}
                  name="label"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.label")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="value"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label tooltip={t("returnReasons.valueTooltip")}>
                          {t("fields.value")}
                        </Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>
                        {t("fields.description")}
                      </Form.Label>
                      <Form.Control>
                        <Textarea {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
