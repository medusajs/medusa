import { zodResolver } from "@hookform/resolvers/zod"
import { SalesChannel } from "@medusajs/medusa"
import { Button, Drawer, Input, Switch, Textarea } from "@medusajs/ui"
import { useAdminUpdateSalesChannel } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { useEffect } from "react"
import { Form } from "../../../../../components/common/form"

type EditSalesChannelFormProps = {
  salesChannel: SalesChannel
  subscribe: (state: boolean) => void
  onSuccess: () => void
}

const EditSalesChannelSchema = zod.object({
  name: zod.string().min(1),
  description: zod.string().optional(),
  is_active: zod.boolean(),
})

export const EditSalesChannelForm = ({
  salesChannel,
  subscribe,
  onSuccess,
}: EditSalesChannelFormProps) => {
  const form = useForm<zod.infer<typeof EditSalesChannelSchema>>({
    defaultValues: {
      name: salesChannel.name,
      description: salesChannel.description ?? "",
      is_active: !salesChannel.is_disabled,
    },
    resolver: zodResolver(EditSalesChannelSchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { t } = useTranslation()

  const { mutateAsync, isLoading } = useAdminUpdateSalesChannel(salesChannel.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        description: values.description ?? undefined,
        is_disabled: !values.is_active,
      },
      {
        onSuccess: () => {
          onSuccess()
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto">
          <Form.Field
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.name")}</Form.Label>
                  <Form.Control>
                    <Input {...field} size="small" />
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
                  <Form.Label optional>{t("fields.description")}</Form.Label>
                  <Form.Control>
                    <Textarea {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="is_active"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label>{t("general.enabled")}</Form.Label>
                    <Form.Control>
                      <Switch
                        onCheckedChange={onChange}
                        checked={value}
                        {...field}
                      />
                    </Form.Control>
                  </div>
                  <Form.Hint>{t("salesChannels.enabledHint")}</Form.Hint>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Drawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </Drawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
