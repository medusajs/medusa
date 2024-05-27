import { ServiceZoneDTO } from "@medusajs/types"
import { Alert, Button, Input, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
    RouteDrawer,
    useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateServiceZone } from "../../../../../hooks/api/stock-locations"

type EditServiceZoneFormProps = {
  zone: ServiceZoneDTO
  fulfillmentSetId: string
  locationId: string
}

const EditServiceZoneSchema = zod.object({
  name: zod.string().min(1),
})

export const EditServiceZoneForm = ({
  zone,
  fulfillmentSetId,
  locationId,
}: EditServiceZoneFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditServiceZoneSchema>>({
    defaultValues: {
      name: zone.name,
    },
  })

  const { mutateAsync, isPending: isLoading } = useUpdateServiceZone(
    fulfillmentSetId,
    zone.id,
    locationId
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            // description: t("regions.toast.edit"),
            dismissLabel: t("actions.close"),
          })
          handleSuccess()
        },
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-4">
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
            <Alert>
              <Text weight="plus">
                {t("location.serviceZone.create.subtitle")}
              </Text>
              <Text className="text-ui-fg-subtle mt-2">
                {t("location.serviceZone.create.description")}
              </Text>
            </Alert>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
