import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import {
  RouteFocusModal,
  StackedFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateFulfillmentSetServiceZone } from "../../../../../hooks/api/fulfillment-sets"
import { countries } from "../../../../../lib/data/countries"
import { GeoZoneForm } from "../../../common/components/geo-zone-form"
import { GEO_ZONE_STACKED_MODAL_ID } from "../../../common/constants"

const EditeServiceZoneSchema = z.object({
  countries: z
    .array(z.object({ iso_2: z.string().min(2), display_name: z.string() }))
    .min(1),
})

type EditServiceZoneAreasFormProps = {
  fulfillmentSetId: string
  locationId: string
  zone: HttpTypes.AdminServiceZone
}

export function EditServiceZoneAreasForm({
  fulfillmentSetId,
  locationId,
  zone,
}: EditServiceZoneAreasFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditeServiceZoneSchema>>({
    defaultValues: {
      countries: zone.geo_zones.map((z) => {
        const country = countries.find((c) => c.iso_2 === z.country_code)

        return {
          iso_2: z.country_code,
          display_name: country?.display_name || z.country_code.toUpperCase(),
        }
      }),
    },
    resolver: zodResolver(EditeServiceZoneSchema),
  })

  const { mutateAsync: editServiceZone, isPending: isLoading } =
    useUpdateFulfillmentSetServiceZone(fulfillmentSetId, zone.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await editServiceZone(
      {
        geo_zones: data.countries.map(({ iso_2 }) => ({
          country_code: iso_2,
          type: "country",
        })),
      },
      {
        onSuccess: () => {
          toast.success(
            t("stockLocations.serviceZones.manageAreas.successToast", {
              name: zone.name,
            })
          )

          handleSuccess(`/settings/locations/${locationId}`)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header />

        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-auto">
          <StackedFocusModal id={GEO_ZONE_STACKED_MODAL_ID}>
            <div className="flex flex-col items-center p-16">
              <div className="flex w-full max-w-[720px] flex-col gap-y-8">
                <Heading>
                  {t("stockLocations.serviceZones.manageAreas.header", {
                    name: zone.name,
                  })}
                </Heading>
                <GeoZoneForm form={form} />
              </div>
            </div>

            <GeoZoneForm.AreaDrawer form={form} />
          </StackedFocusModal>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
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
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
