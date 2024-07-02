import * as zod from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { AdminInventoryItem, AdminStockLocation } from "@medusajs/types"
import { Button, Text, toast } from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../../components/modals"
import { useBatchUpdateInventoryLevels } from "../../../../../../hooks/api/inventory"

import { LocationItem } from "./location-item"
import { useEffect, useMemo } from "react"

type EditInventoryItemAttributeFormProps = {
  item: AdminInventoryItem
  locations: AdminStockLocation[]
}

const EditInventoryItemAttributesSchema = z.object({
  locations: z.array(
    z.object({
      id: z.string(),
      location_id: z.string(),
      selected: z.boolean(),
    })
  ),
})

const getDefaultValues = (
  allLocations: AdminStockLocation[],
  existingLevels: Set<string>
) => {
  return {
    locations: allLocations.map((location) => ({
      ...location,
      location_id: location.id,
      selected: existingLevels.has(location.id),
    })),
  }
}

export const ManageLocationsForm = ({
  item,
  locations,
}: EditInventoryItemAttributeFormProps) => {
  const existingLocationLevels = useMemo(
    () => new Set(item.location_levels?.map((l) => l.location_id) ?? []),
    item.location_levels
  )

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditInventoryItemAttributesSchema>>({
    defaultValues: getDefaultValues(locations, existingLocationLevels),
    resolver: zodResolver(EditInventoryItemAttributesSchema),
  })

  const { fields: locationFields, update: updateField } = useFieldArray({
    control: form.control,
    name: "locations",
  })

  useEffect(() => {
    form.setValue(
      "locations",
      getDefaultValues(locations, existingLocationLevels).locations
    )
  }, [existingLocationLevels, locations])

  const { mutateAsync } = useBatchUpdateInventoryLevels(item.id)

  const handleSubmit = form.handleSubmit(async ({ locations }) => {
    // Changes in selected locations
    const [selectedLocations, unselectedLocations] = locations.reduce(
      (acc, location) => {
        // If the location is not changed do nothing
        if (
          (!location.selected &&
            !existingLocationLevels.has(location.location_id)) ||
          (location.selected &&
            existingLocationLevels.has(location.location_id))
        ) {
          return acc
        }

        if (location.selected) {
          acc[0].push(location.location_id)
        } else {
          acc[1].push(location.location_id)
        }
        return acc
      },
      [[], []] as [string[], string[]]
    )

    if (selectedLocations.length === 0 && unselectedLocations.length === 0) {
      return handleSuccess()
    }

    try {
      await mutateAsync({
        create: selectedLocations.map((location_id) => ({
          location_id,
        })),
        delete: unselectedLocations,
      })

      handleSuccess()

      toast.success(t("general.success"), {
        description: t("inventory.toast.updateLocations"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-4 overflow-auto">
          <div className="text-ui-fg-subtle shadow-elevation-card-rest grid grid-rows-2 divide-y rounded-lg border">
            <div className="grid grid-cols-2 divide-x">
              <Text className="px-2 py-1.5" size="small" leading="compact">
                {t("fields.title")}
              </Text>
              <Text className="px-2 py-1.5" size="small" leading="compact">
                {item.title ?? "-"}
              </Text>
            </div>
            <div className="grid grid-cols-2 divide-x">
              <Text className="px-2 py-1.5" size="small" leading="compact">
                {t("fields.sku")}
              </Text>
              <Text className="px-2 py-1.5" size="small" leading="compact">
                {item.sku}
              </Text>
            </div>
          </div>
          <div className="flex flex-col">
            <Text size="small" weight="plus" leading="compact">
              {t("locations.domain")}
            </Text>
            <div className="text-ui-fg-subtle flex w-full justify-between">
              <Text size="small" leading="compact">
                {t("locations.selectLocations")}
              </Text>
              <Text size="small" leading="compact">
                {"("}
                {t("general.countOfTotalSelected", {
                  count: locationFields.filter((l) => l.selected).length,
                  total: locations.length,
                })}
                {")"}
              </Text>
            </div>
          </div>
          {locationFields.map((location, idx) => {
            return (
              <LocationItem
                selected={location.selected}
                location={location as any}
                onSelect={() =>
                  updateField(idx, {
                    ...location,
                    selected: !location.selected,
                  })
                }
                key={location.id}
              />
            )
          })}
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" size="small" isLoading={false}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
