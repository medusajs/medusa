import {
  AdminInventoryItem,
  AdminStockLocation,
  HttpTypes,
} from "@zjedene-medusa/types"
import { Button, Text, toast } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { RouteDrawer, useRouteModal } from "../../../../../../components/modals"
import { useBatchInventoryItemLocationLevels } from "../../../../../../hooks/api/inventory"
import { sdk } from "../../../../../../lib/client"

import { useMemo, useState } from "react"
import { LocationItem } from "./location-item"
import { LocationSearchInput } from "./location-search-input"
import { InfiniteList } from "../../../../../../components/common/infinite-list/infinite-list"
import { useStockLocations } from "../../../../../../hooks/api/stock-locations"

type EditInventoryItemAttributeFormProps = {
  item: AdminInventoryItem
  locations: AdminStockLocation[]
}

export const ManageLocationsForm = ({
  item,
}: EditInventoryItemAttributeFormProps) => {
  const existingLocationLevels = useMemo(
    () => new Set(item.location_levels?.map((l) => l.location_id) ?? []),
    [item.location_levels]
  )

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocationIds, setSelectedLocationIds] = useState<Set<string>>(
    existingLocationLevels
  )

  const { count } = useStockLocations({ limit: 1, fields: "id" })

  const handleLocationSelect = (locationId: string, selected: boolean) => {
    setSelectedLocationIds((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(locationId)
      } else {
        newSet.delete(locationId)
      }
      return newSet
    })
  }

  const { mutateAsync } = useBatchInventoryItemLocationLevels(item.id)

  const handleSubmit = async () => {
    const toCreate = Array.from(selectedLocationIds).filter(
      (id) => !existingLocationLevels.has(id)
    )

    const toDeleteLocations = Array.from(existingLocationLevels).filter(
      (id) => !selectedLocationIds.has(id)
    )

    const toDelete = toDeleteLocations
      .map((id) => item.location_levels?.find((l) => l.location_id === id)?.id)
      .filter(Boolean) as unknown as string[]

    await mutateAsync(
      {
        create: toCreate.map((location_id) => ({
          location_id,
        })),
        delete: toDelete,
      },
      {
        onSuccess: () => {
          toast.success(t("inventory.toast.updateLocations"))
          handleSuccess()
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
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
                count: selectedLocationIds.size,
                total: count,
              })}
              {")"}
            </Text>
          </div>
        </div>

        <LocationSearchInput
          onSearchChange={setSearchQuery}
          placeholder={t("general.search")}
        />

        <div className="min-h-0 flex-1">
          <InfiniteList<
            HttpTypes.AdminStockLocationListResponse,
            HttpTypes.AdminStockLocation,
            HttpTypes.AdminStockLocationListParams
          >
            queryKey={["stock-locations", searchQuery]}
            queryFn={async (params) => {
              const response = await sdk.admin.stockLocation.list({
                limit: params.limit,
                offset: params.offset,
                ...(searchQuery && { q: searchQuery }),
              })
              return response
            }}
            responseKey="stock_locations"
            renderItem={(location) => (
              <LocationItem
                selected={selectedLocationIds.has(location.id)}
                location={location}
                onSelect={(selected) =>
                  handleLocationSelect(location.id, selected)
                }
              />
            )}
            renderEmpty={() => (
              <div className="flex items-center justify-center py-8">
                <Text size="small" className="text-ui-fg-subtle">
                  {searchQuery
                    ? t("locations.noLocationsFound")
                    : t("locations.noLocationsFound")}
                </Text>
              </div>
            )}
            pageSize={20}
          />
        </div>
      </RouteDrawer.Body>
      <RouteDrawer.Footer>
        <div className="flex items-center justify-end gap-x-2">
          <RouteDrawer.Close asChild>
            <Button variant="secondary" size="small">
              {t("actions.cancel")}
            </Button>
          </RouteDrawer.Close>
          <Button onClick={handleSubmit} size="small" isLoading={false}>
            {t("actions.save")}
          </Button>
        </div>
      </RouteDrawer.Footer>
    </div>
  )
}
