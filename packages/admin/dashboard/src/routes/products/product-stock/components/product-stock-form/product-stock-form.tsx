import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, toast, usePrompt } from "@medusajs/ui"
import { useEffect, useMemo, useRef, useState } from "react"
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
import { useProductStockColumns } from "../../hooks/use-product-stock-columns"
import {
  ProductStockInventoryItemSchema,
  ProductStockLocationSchema,
  ProductStockSchema,
  ProductStockVariantSchema,
} from "../../schema"
import {
  getDisabledInventoryRows,
  isProductVariantWithInventoryPivot,
} from "../../utils"

type ProductStockFormProps = {
  variants: HttpTypes.AdminProductVariant[]
  locations: HttpTypes.AdminStockLocation[]
  onLoaded: () => void
}

export const ProductStockForm = ({
  variants,
  locations,
  onLoaded,
}: ProductStockFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess, setCloseOnEscape } = useRouteModal()
  const prompt = usePrompt()

  useEffect(() => {
    onLoaded()
  }, [onLoaded])

  const [isPromptOpen, setIsPromptOpen] = useState(false)

  const form = useForm<ProductStockSchema>({
    defaultValues: getDefaultValue(variants, locations),
    resolver: zodResolver(ProductStockSchema),
  })

  const initialValues = useRef(getDefaultValue(variants, locations))

  const disabled = useMemo(() => getDisabledInventoryRows(variants), [variants])
  const columns = useProductStockColumns(locations, disabled)

  const { mutateAsync, isPending } = useBatchInventoryItemsLocationLevels()

  const onSubmit = form.handleSubmit(async (data) => {
    const payload: HttpTypes.AdminBatchInventoryItemsLocationLevels = {
      create: [],
      update: [],
      delete: [],
      force: true,
    }

    for (const [variantId, variant] of Object.entries(data.variants)) {
      for (const [inventory_item_id, item] of Object.entries(
        variant.inventory_items
      )) {
        for (const [location_id, level] of Object.entries(item.locations)) {
          if (level.id) {
            const wasChecked =
              initialValues.current?.variants?.[variantId]?.inventory_items?.[
                inventory_item_id
              ]?.locations?.[location_id]?.checked

            if (wasChecked && !level.checked) {
              payload.delete?.push(level.id)
            } else {
              const newQuantity =
                level.quantity !== "" ? castNumber(level.quantity) : 0
              const originalQuantity =
                initialValues.current?.variants?.[variantId]?.inventory_items?.[
                  inventory_item_id
                ]?.locations?.[location_id]?.quantity

              if (newQuantity !== originalQuantity) {
                payload.update?.push({
                  inventory_item_id,
                  location_id,
                  stocked_quantity: newQuantity,
                })
              }
            }
          }

          if (!level.id && level.quantity !== "") {
            payload.create?.push({
              inventory_item_id,
              location_id,
              stocked_quantity: castNumber(level.quantity),
            })
          }
        }
      }
    }

    if ((payload.delete?.length ?? 0) > 0) {
      setIsPromptOpen(true)
      const confirm = await prompt({
        title: t("general.areYouSure"),
        description: t("inventory.stock.disablePrompt", {
          count: payload.delete?.length ?? 0,
        }),
        confirmText: t("actions.continue"),
        cancelText: t("actions.cancel"),
        variant: "confirmation",
      })

      setIsPromptOpen(false)

      if (!confirm) {
        return
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
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
          <DataGrid
            state={form}
            columns={columns}
            data={variants}
            getSubRows={getSubRows}
            onEditingChange={(editing) => setCloseOnEscape(!editing)}
            disableInteractions={isPending || isPromptOpen}
            multiColumnSelection={true}
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

function getSubRows(
  row:
    | HttpTypes.AdminProductVariant
    | HttpTypes.AdminProductVariantInventoryItemLink
): HttpTypes.AdminProductVariantInventoryItemLink[] | undefined {
  if (isProductVariantWithInventoryPivot(row)) {
    return row.inventory_items
  }
}

function getDefaultValue(
  variants: HttpTypes.AdminProductVariant[],
  locations: HttpTypes.AdminStockLocation[]
): DefaultValues<ProductStockSchema> {
  return {
    variants: variants.reduce((variantAcc, variant) => {
      const inventoryItems = variant.inventory_items?.reduce(
        (itemAcc, item) => {
          const locationsMap = locations.reduce((locationAcc, location) => {
            const level = item.inventory?.location_levels?.find(
              (level) => level.location_id === location.id
            )

            locationAcc[location.id] = {
              id: level?.id,
              quantity:
                level?.stocked_quantity !== undefined
                  ? level?.stocked_quantity
                  : "",
              checked: !!level,
              disabledToggle:
                (level?.incoming_quantity || 0) > 0 ||
                (level?.reserved_quantity || 0) > 0,
            }
            return locationAcc
          }, {} as ProductStockLocationSchema)

          itemAcc[item.inventory_item_id] = { locations: locationsMap }
          return itemAcc
        },
        {} as Record<string, ProductStockInventoryItemSchema>
      )

      variantAcc[variant.id] = { inventory_items: inventoryItems || {} }
      return variantAcc
    }, {} as Record<string, ProductStockVariantSchema>),
  }
}
