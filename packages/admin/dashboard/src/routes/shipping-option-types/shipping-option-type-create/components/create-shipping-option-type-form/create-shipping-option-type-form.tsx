import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateShippingOptionType } from "../../../../../hooks/api"

const CreateShippingOptionTypeSchema = z.object({
  label: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
})

export const CreateShippingOptionTypeForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateShippingOptionTypeSchema>>({
    defaultValues: {
      label: "",
      code: "",
      description: undefined,
    },
    resolver: zodResolver(CreateShippingOptionTypeSchema),
  })

  const generateCodeFromLabel = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
  }

  const { mutateAsync, isPending } = useCreateShippingOptionType()

  const handleSubmit = form.handleSubmit(
    async (values: z.infer<typeof CreateShippingOptionTypeSchema>) => {
      await mutateAsync(values, {
        onSuccess: ({ shipping_option_type }) => {
          toast.success(
            t("shippingOptionTypes.create.successToast", {
              label: shipping_option_type.label.trim(),
            })
          )

          handleSuccess(
            `/settings/locations/shipping-option-types/${shipping_option_type.id}`
          )
        },
        onError: (e) => {
          toast.error(e.message)
        },
      })
    }
  )

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Body className="flex flex-col items-center overflow-auto p-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("shippingOptionTypes.create.header")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("shippingOptionTypes.create.hint")}
              </Text>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Form.Field
                control={form.control}
                name="label"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("shippingOptionTypes.fields.label")}
                      </Form.Label>
                      <Form.Control>
                        <Input
                          {...field}
                          onChange={(e) => {
                            if (
                              !form.getFieldState("code").isTouched ||
                              !form.getValues("code")
                            ) {
                              form.setValue(
                                "code",
                                generateCodeFromLabel(e.target.value)
                              )
                            }
                            field.onChange(e)
                          }}
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
                        {t("shippingOptionTypes.fields.code")}
                      </Form.Label>
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
                name="description"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("shippingOptionTypes.fields.description")}
                        <Text
                          size="small"
                          leading="compact"
                          className="text-ui-fg-muted ml-1 inline"
                        >
                          ({t("fields.optional")})
                        </Text>
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
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
