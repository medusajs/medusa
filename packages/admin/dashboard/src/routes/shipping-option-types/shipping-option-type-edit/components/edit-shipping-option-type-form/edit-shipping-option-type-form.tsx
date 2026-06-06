import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@zjedene-medusa/types"
import { Button, Input, Text, toast } from "@zjedene-medusa/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateShippingOptionType } from "../../../../../hooks/api/shipping-option-types"

const EditShippingOptionTypeSchema = z.object({
  label: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
})

type EditShippingOptionTypeFormProps = {
  shippingOptionType: HttpTypes.AdminShippingOptionType
}

export const EditShippingOptionTypeForm = ({
  shippingOptionType,
}: EditShippingOptionTypeFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditShippingOptionTypeSchema>>({
    defaultValues: {
      label: shippingOptionType.label,
      code: shippingOptionType.code,
      description: shippingOptionType.description,
    },
    resolver: zodResolver(EditShippingOptionTypeSchema),
  })

  const { mutateAsync, isPending } = useUpdateShippingOptionType(
    shippingOptionType.id
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        label: data.label,
        code: data.code,
        description: data.description,
      },
      {
        onSuccess: ({ shipping_option_type }) => {
          toast.success(
            t("shippingOptionTypes.edit.successToast", {
              label: shipping_option_type.label,
            })
          )
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
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
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
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
