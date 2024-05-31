import { Map, PencilSquare, Trash, TriangleDownMini } from "@medusajs/icons"
import { IconButton, Text, toast, usePrompt } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { ListSummary } from "../../../../../components/common/list-summary"
import { useDeleteServiceZone } from "../../../../../hooks/api/stock-locations"

type ServiceZoneProps = {
  zone: ServiceZoneDTO
  locationId: string
  fulfillmentSetId: string
}

function ServiceZone({ zone, locationId, fulfillmentSetId }: ServiceZoneProps) {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const [open, setOpen] = useState(false)

  const { mutateAsync: deleteZone } = useDeleteServiceZone(
    fulfillmentSetId,
    zone.id
  )

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("location.serviceZone.deleteWarning", {
        name: zone.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    try {
      await deleteZone()

      toast.success(t("general.success"), {
        description: t("location.serviceZone.toast.delete", {
          name: zone.name,
        }),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  const countries = useMemo(() => {
    return zone.geo_zones
      .filter((g) => g.type === "country")
      .map((g) => g.country_code)
      .map((code) => staticCountries.find((c) => c.iso_2 === code))
      .sort((c1, c2) => c1.name.localeCompare(c2.name))
  }, [zone.geo_zones])

  const [shippingOptionsCount, returnOptionsCount] = useMemo(() => {
    const optionsCount = zone.shipping_options.filter(
      (o) => !isReturnOption(o)
    ).length

    const returnOptionsCount = zone.shipping_options.filter((o) =>
      isReturnOption(o)
    ).length

    return [optionsCount, returnOptionsCount]
  }, [zone.shipping_options])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between gap-x-4 px-6 py-4">
        <div className="shadow-borders-base flex size-7 items-center justify-center rounded-md">
          <div className="bg-ui-bg-field flex size-6 items-center justify-center rounded-[4px]">
            <Map className="text-ui-fg-subtle" />
          </div>
        </div>
        <div className="grow-1 flex flex-1 flex-col">
          <Text size="small" leading="compact" weight="plus">
            {zone.name}
          </Text>
          <div className="flex items-center gap-2">
            <ListSummary
              variant="base"
              list={countries.map((c) => c.display_name)}
              inline
              n={1}
            />
            <span>·</span>
            <Text className="text-ui-fg-subtle txt-small">
              {shippingOptionsCount}{" "}
              {t("location.serviceZone.optionsLength", {
                count: shippingOptionsCount,
              })}
            </Text>
            <span>·</span>
            <Text className="text-ui-fg-subtle txt-small">
              {returnOptionsCount}{" "}
              {t("location.serviceZone.returnOptionsLength", {
                count: returnOptionsCount,
              })}
            </Text>
          </div>
        </div>

        <div className="flex grow-0 items-center gap-4">
          <IconButton
            size="small"
            onClick={() => setOpen((s) => !s)}
            variant="transparent"
          >
            <TriangleDownMini
              style={{
                transform: `rotate(${!open ? 0 : 180}deg)`,
                transition: ".2s transform ease-in-out",
              }}
            />
          </IconButton>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    icon: <PencilSquare />,
                    to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/edit`,
                  },
                  {
                    label: t("location.serviceZone.areas.manage"),
                    icon: <Map />,
                    to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/edit-areas`,
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("actions.delete"),
                    icon: <Trash />,
                    onClick: handleDelete,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      {open && (
        <ServiceZoneOptions
          fulfillmentSetId={fulfillmentSetId}
          locationId={locationId}
          zone={zone}
        />
      )}
    </div>
  )
}
