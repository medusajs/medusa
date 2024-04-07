import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { Button, Heading, Input, Text } from "@medusajs/ui"
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
  countries: zod.array(zod.string().length(2)).min(1),
})

type CreateServiceZoneFormProps = {
  fulfillmentSet: FulfillmentSetDTO
}

export function CreateServiceZoneForm({
  fulfillmentSet,
}: CreateServiceZoneFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateServiceZoneSchema>>({
    defaultValues: {
      name: "",
      countries: [],
    },
    resolver: zodResolver(CreateServiceZoneSchema),
  })

  const { mutateAsync, isPending: isLoading } = useCreateFulfillmentSet(
    fulfillmentSet.id
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    // await mutateAsync({
    //   name: data.name,
    //   type: data.type,
    // })

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

        <RouteFocusModal.Body className="m-auto flex h-full w-full max-w-[700px] flex-col items-center divide-y overflow-hidden">
          <div className="container mx-auto w-fit px-1 py-8">
            <Heading className="mb-12 mt-8 text-2xl">
              {t("shipping.fulfillmentSet.create.title", {
                fulfillmentSet: fulfillmentSet.name,
              })}
            </Heading>

            <div>
              <Text weight="plus">
                {t("shipping.serviceZone.create.subtitle")}
              </Text>
              <Text className="text-ui-fg-subtle mb-8 mt-2">
                {t("shipping.serviceZone.create.description")}
              </Text>
            </div>

            <div className="flex max-w-[340px] flex-col gap-y-6">
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("shipping.serviceZone.create.zoneName")}
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

          {/*AREAS*/}
          <div className="container flex items-center justify-between py-8">
            <div>
              <Text weight="plus">{t("shipping.serviceZone.areas.title")}</Text>
              <Text className="text-ui-fg-subtle mt-2">
                {t("shipping.serviceZone.areas.description")}
              </Text>
            </div>
            <Button variant="secondary" type="button">
              {t("shipping.serviceZone.areas.manage")}
            </Button>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
