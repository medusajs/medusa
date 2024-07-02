import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useCreateShippingOptionType } from "../../../../../hooks/api/shipping-option-types"

const CreateShippingOptionsSchema = zod.object({
  label: zod.string().min(1),
  code: zod.string(),
  description: zod.string(),
})

export function CreateShippingOptionTypeForm() {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateShippingOptionsSchema>>({
    defaultValues: {
      label: "",
      code: "",
      description: "",
    },
    resolver: zodResolver(CreateShippingOptionsSchema),
  })

  const { mutateAsync, isPending } = useCreateShippingOptionType()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        label: values.label,
        code: values.code,
        description: values.description,
      },
      {
        onSuccess: ({ shipping_option_type }) => {
          toast.success(t("general.success"), {
            description: t("shippingOptionType.create.successToast", {
              name: shipping_option_type.label,
            }),
            dismissLabel: t("actions.close"),
          })

          handleSuccess(
            `/settings/locations/shipping-option-types/${shipping_option_type.id}`
          )
        },
        onError: (error) => {
          toast.error(t("general.error"), {
            description: error.message,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
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
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading className="capitalize">
                  {t("shippingOptionType.create.header")}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("shippingOptionType.create.hint")}
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  name="code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.code")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <div className="col-span-2">
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
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
