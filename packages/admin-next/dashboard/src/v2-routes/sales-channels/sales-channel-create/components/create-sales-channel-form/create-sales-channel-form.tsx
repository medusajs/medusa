import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Heading,
  Input,
  Switch,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateSalesChannel } from "../../../../../hooks/api/sales-channels"

const CreateSalesChannelSchema = zod.object({
  name: zod.string().min(1),
  description: zod.string().min(1),
  enabled: zod.boolean(),
})

export const CreateSalesChannelForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateSalesChannelSchema>>({
    defaultValues: {
      name: "",
      description: "",
      enabled: true,
    },
    resolver: zodResolver(CreateSalesChannelSchema),
  })
  const { mutateAsync, isPending } = useCreateSalesChannel()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        description: values.description,
        is_disabled: !values.enabled,
      },
      {
        onSuccess: ({ sales_channel }) => {
          toast.success(t("general.success"), {
            description: t("salesChannels.toast.create"),
            dismissLabel: t("actions.close"),
          })
          handleSuccess(`../${sales_channel.id}`)
        },
        onError: (error) =>
          toast.success(t("general.success"), {
            description: error.message,
            dismissLabel: t("actions.close"),
          }),
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
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading className="capitalize">
                  {t("salesChannels.createSalesChannel")}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("salesChannels.createSalesChannelHint")}
                </Text>
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="grid grid-cols-2">
                  <Form.Field
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.name")}</Form.Label>
                          <Form.Control>
                            <Input size="small" {...field} />
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
                        <Form.Label>{t("fields.description")}</Form.Label>
                        <Form.Control>
                          <Textarea {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <Form.Field
                control={form.control}
                name="enabled"
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <div className="flex items-center justify-between">
                        <Form.Label>{t("general.enabled")}</Form.Label>
                        <Form.Control>
                          <Switch
                            {...field}
                            checked={value}
                            onCheckedChange={onChange}
                          />
                        </Form.Control>
                      </div>
                      <Form.Hint>{t("salesChannels.enabledHint")}</Form.Hint>
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
