import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { Button, Heading, Input } from "@medusajs/ui"
import { FulfillmentSetDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { Form } from "../../../../../components/common/form"
import { useCreateFulfillmentSet } from "../../../../../hooks/api/stock-locations"

const CreateServiceZoneSchema = zod.object({
  name: zod.string().min(1),
})

type CreateServiceZoneFormProps = {
  fulfillmetnSet: FulfillmentSetDTO
}

export function CreateServiceZoneForm({
  fulfillmetnSet,
}: CreateServiceZoneFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateServiceZoneSchema>>({
    defaultValues: {
      name: "",
      type: "",
    },
    resolver: zodResolver(CreateServiceZoneSchema),
  })

  const { mutateAsync, isPending: isLoading } = useCreateFulfillmentSet(
    fulfillmetnSet.id
  )

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
              {t("shipping.fulfillmentSet.create.title", {
                fulfillmentSet: fulfillmetnSet.name,
              })}
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
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
