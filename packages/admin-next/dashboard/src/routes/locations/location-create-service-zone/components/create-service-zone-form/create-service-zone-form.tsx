import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Input, toast } from "@medusajs/ui"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { InlineTip } from "../../../../../components/common/inline-tip"
import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateFulfillmentSetServiceZone } from "../../../../../hooks/api/fulfillment-sets"
import { GeoZoneForm } from "../../../common/components/geo-zone-form"

const CreateServiceZoneSchema = z.object({
  name: z.string().min(1),
  countries: z
    .array(z.object({ iso_2: z.string().min(2), display_name: z.string() }))
    .min(1),
})

type CreateServiceZoneFormProps = {
  fulfillmentSet: HttpTypes.AdminFulfillmentSet
  locationId: string
}

export function CreateServiceZoneForm({
  fulfillmentSet,
  locationId,
}: CreateServiceZoneFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof CreateServiceZoneSchema>>({
    defaultValues: {
      name: "",
      countries: [],
    },
    resolver: zodResolver(CreateServiceZoneSchema),
  })

  const { mutateAsync, isPending } = useCreateFulfillmentSetServiceZone(
    fulfillmentSet.id
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        name: data.name,
        geo_zones: data.countries.map(({ iso_2 }) => ({
          country_code: iso_2,
          type: "country",
        })),
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("location.serviceZone.create.successToast", {
              name: data.name,
            }),
            dismissable: true,
            dismissLabel: t("general.close"),
          })

          handleSuccess(`/settings/locations/${locationId}`)
        },
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissable: true,
            dismissLabel: t("general.close"),
          })
        },
      }
    )
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
            <Button type="submit" size="small" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="m-auto flex h-full w-full  flex-col items-center divide-y overflow-hidden">
          <SplitView open={open} onOpenChange={setOpen}>
            <SplitView.Content>
              <div className="flex flex-1 flex-col items-center overflow-y-auto">
                <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                  <Heading>
                    {t("location.serviceZone.create.title", {
                      fulfillmentSet: fulfillmentSet.name,
                    })}
                  </Heading>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                  <InlineTip label={"Info"}>
                    {t("location.serviceZone.create.description")}
                  </InlineTip>

                  <GeoZoneForm form={form} onOpenChange={setOpen} />
                </div>
              </div>
            </SplitView.Content>
            <GeoZoneForm.AreaDrawer
              form={form}
              open={open}
              onOpenChange={setOpen}
            />
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
