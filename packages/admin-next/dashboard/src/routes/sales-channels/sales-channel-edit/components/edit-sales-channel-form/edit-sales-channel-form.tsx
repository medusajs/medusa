import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Switch, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { SalesChannelDTO } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/modals"
import { useUpdateSalesChannel } from "../../../../../hooks/api/sales-channels"

type EditSalesChannelFormProps = {
  salesChannel: SalesChannelDTO
}

const EditSalesChannelSchema = zod.object({
  name: zod.string().min(1),
  description: zod.string().optional(),
  is_active: zod.boolean(),
})

export const EditSalesChannelForm = ({
  salesChannel,
}: EditSalesChannelFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditSalesChannelSchema>>({
    defaultValues: {
      name: salesChannel.name,
      description: salesChannel.description ?? "",
      is_active: !salesChannel.is_disabled,
    },
    resolver: zodResolver(EditSalesChannelSchema),
  })

  const { mutateAsync, isPending } = useUpdateSalesChannel(salesChannel.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        description: values.description ?? undefined,
        is_disabled: !values.is_active,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("salesChannels.toast.update"),
            dismissLabel: t("actions.close"),
          })
          handleSuccess()
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
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto">
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
      </form>
    </RouteDrawer.Form>
  )
}
