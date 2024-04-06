import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { Button, Heading, Input, Select } from "@medusajs/ui"
import { StockLocationDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { Form } from "../../../../../components/common/form"
import { useCreateFulfillmentSet } from "../../../../../hooks/api/stock-locations"

enum FulfillmentSetType {
  Delivery = "delivery",
  Pickup = "pickup",
}

const CreateFulfillmentSetSchema = zod.object({
  name: zod.string().min(1),
  type: zod.nativeEnum(FulfillmentSetType),
})

type CreateShippingFormProps = {
  location: StockLocationDTO
}

export function CreateShippingForm({ location }: CreateShippingFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateFulfillmentSetSchema>>({
    defaultValues: {
      name: "",
      type: "",
    },
    resolver: zodResolver(CreateFulfillmentSetSchema),
  })

  const { mutateAsync, isLoading } = useCreateFulfillmentSet(location.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync({
      name: data.name,
      type: data.type,
    })

    handleSuccess("/settings/shipping")
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
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
          <div className="container mx-auto w-fit py-16">
            <Heading className="mb-8 text-2xl">
              {t("shipping.create.title", { location: location.name })}
            </Heading>

            <div className="flex max-w-[340px] flex-col gap-y-6">
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.name")}</Form.Label>
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
                name="type"
                render={({ field: { onChange, ref, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("shipping.create.type")}</Form.Label>
                      <Form.Control>
                        <Select {...field} onValueChange={onChange}>
                          <Select.Trigger ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value={FulfillmentSetType.Delivery}>
                              {t("shipping.create.delivery")}
                            </Select.Item>
                            <Select.Item value={FulfillmentSetType.Pickup}>
                              {t("shipping.create.pickup")}
                            </Select.Item>
                          </Select.Content>
                        </Select>
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
