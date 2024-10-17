import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateReturnReason } from "../../../../../hooks/api/return-reasons"

const ReturnReasonCreateSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
})

export const ReturnReasonCreateForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof ReturnReasonCreateSchema>>({
    defaultValues: {
      value: "",
      label: "",
      description: "",
    },
    resolver: zodResolver(ReturnReasonCreateSchema),
  })

  const { mutateAsync, isPending } = useCreateReturnReason()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: ({ return_reason }) => {
        toast.success(
          t("returnReasons.create.successToast", {
            label: return_reason.label,
          })
        )
        handleSuccess(`../`)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        className="flex size-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 justify-center overflow-auto px-6 py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <RouteFocusModal.Title asChild>
                <Heading>{t("returnReasons.create.header")}</Heading>
              </RouteFocusModal.Title>
              <RouteFocusModal.Description asChild>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("returnReasons.create.subtitle")}
                </Text>
              </RouteFocusModal.Description>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Field
                control={form.control}
                name="value"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label
                        tooltip={t("returnReasons.fields.value.tooltip")}
                      >
                        {t("returnReasons.fields.value.label")}
                      </Form.Label>
                      <Form.Control>
                        <Input
                          {...field}
                          placeholder={t(
                            "returnReasons.fields.value.placeholder"
                          )}
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
                          placeholder={t(
                            "returnReasons.fields.label.placeholder"
                          )}
                        />
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
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary" type="button">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
