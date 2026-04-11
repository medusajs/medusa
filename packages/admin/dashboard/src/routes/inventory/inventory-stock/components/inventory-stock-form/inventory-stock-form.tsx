import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useRef } from "react"
import { DefaultValues, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { DataGrid } from "../../../../../components/data-grid"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useBatchInventoryItemsLocationLevels } from "../../../../../hooks/api"
import { castNumber } from "../../../../../lib/cast-number"
import { useInventoryStockColumns } from "../../hooks/use-inventory-stock-columns"
import {
  InventoryItemSchema,
  InventoryLocationsSchema,
  InventoryStockSchema,
} from "../../schema"

type InventoryStockFormProps = {
  items: HttpTypes.AdminInventoryItem[]
  locations: HttpTypes.AdminStockLocation[]
}

export const InventoryStockForm = ({
  items,
  locations,
}: InventoryStockFormProps) => {
  const { t } = useTranslation()
  const { setCloseOnEscape, handleSuccess } = useRouteModal()

  const initialValues = useRef(getDefaultValues(items, locations))

  const form = useForm<InventoryStockSchema>({
    defaultValues: getDefaultValues(items, locations),
    resolver: zodResolver(InventoryStockSchema),
  })

  const columns = useInventoryStockColumns(locations)

  const { mutateAsync, isPending } = useBatchInventoryItemsLocationLevels()

  const onSubmit = form.handleSubmit(async (data) => {
    const payload: HttpTypes.AdminBatchInventoryItemsLocationLevels = {
      create: [],
      update: [],
      delete: [],
      force: true,
    }

    for (const [inventory_item_id, item] of Object.entries(
      data.inventory_items
    )) {
      for (const [location_id, level] of Object.entries(item.locations)) {
        if (level.id) {
          const wasChecked =
            initialValues.current?.inventory_items?.[inventory_item_id]
              ?.locations?.[location_id]?.checked

          if (wasChecked && !level.checked) {
            payload.delete.push(level.id)
          } else {
            const newQuantity =
              level.quantity !== "" ? castNumber(level.quantity) : 0
            const originalQuantity =
              initialValues.current?.inventory_items?.[inventory_item_id]
                ?.locations?.[location_id]?.quantity

            if (newQuantity !== originalQuantity) {
              payload.update.push({
                id: level.id,
                inventory_item_id,
                location_id,
                stocked_quantity: newQuantity,
              })
            }
          }
        }

        if (!level.id && level.quantity !== "") {
          payload.create.push({
            inventory_item_id,
            location_id,
            stocked_quantity: castNumber(level.quantity),
          })
        }
      }
    }

    await mutateAsync(payload, {
      onSuccess: () => {
        toast.success(t("inventory.stock.successToast"))
        handleSuccess()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm onSubmit={onSubmit} className="flex size-full flex-col">
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="size-full flex-1 overflow-y-auto">
          <DataGrid
            columns={columns}
            data={items}
            state={form}
            onEditingChange={(editing) => {
              setCloseOnEscape(!editing)
            }}
          />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small" type="button">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

function getDefaultValues(
  items: HttpTypes.AdminInventoryItem[],
  locations: HttpTypes.AdminStockLocation[]
): DefaultValues<InventoryStockSchema> {
  return {
    inventory_items: items.reduce((acc, item) => {
      const locationsMap = locations.reduce((locationAcc, location) => {
        const level = item.location_levels?.find(
          (level) => level.location_id === location.id
        )

        locationAcc[location.id] = {
          id: level?.id,
          quantity:
            typeof level?.stocked_quantity === "number"
              ? level?.stocked_quantity
              : "",
          checked: !!level,
          disabledToggle:
            (level?.incoming_quantity || 0) > 0 ||
            (level?.reserved_quantity || 0) > 0,
        }
        return locationAcc
      }, {} as InventoryLocationsSchema)

      acc[item.id] = { locations: locationsMap }
      return acc
    }, {} as Record<string, InventoryItemSchema>),
  }
}
