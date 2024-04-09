import { Button, Heading, Input, Text } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { Form } from "../../../../../components/common/form"

const CreateShippingOptionsSchema = zod.object({
  name: zod.string().min(1),
  type: zod.string().min(1),
})

export function CreateShippingProfileForm() {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateShippingOptionsSchema>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(CreateShippingOptionsSchema),
  })

  const isPending = false
  // const { mutateAsync, isPending } = useCreateStockLocation()

  const handleSubmit = form.handleSubmit(async (values) => {
    // mutateAsync(
    //   {
    //     name: values.name,
    //   },
    //   {
    //     onSuccess: () => {
    //       handleSuccess("/settings/shipping-profiles")
    //     },
    //   }
    // )
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
                  {t("shippingProfile.title")}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("shippingProfile.detailsHint")}
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <Form.Field
                  control={form.control}
                  name="type"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.type")}</Form.Label>
                        <Form.Control>
                          <Input size="small" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
