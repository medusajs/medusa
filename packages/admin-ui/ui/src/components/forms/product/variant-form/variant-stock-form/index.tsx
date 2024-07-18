import { Controller, useFieldArray } from "react-hook-form"
import { InventoryLevelDTO, StockLocationDTO } from "@medusajs/types"

import BuildingsIcon from "../../../../fundamentals/icons/buildings-icon"
import Button from "../../../../fundamentals/button"
import FeatureToggle from "../../../../fundamentals/feature-toggle"
import IconBadge from "../../../../fundamentals/icon-badge"
import InputField from "../../../../molecules/input"
import { LayeredModalContext } from "../../../../molecules/modal/layered-modal"
import { ManageLocationsScreen } from "../../variant-inventory-form/variant-stock-form"
import { NestedForm } from "../../../../../utils/nested-form"
import React from "react"
import Switch from "../../../../atoms/switch"
import clsx from "clsx"
import { sum } from "lodash"
import { useAdminStockLocations } from "medusa-react"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

export type VariantStockFormType = {
  manage_inventory?: boolean
  allow_backorder: boolean
  inventory_quantity: number | null
  sku: string | null
  ean: string | null
  upc: string | null
  barcode: string | null
  stock_location?: { stocked_quantity: number; location_id: string }[]
}

type Props = {
  form: NestedForm<VariantStockFormType>
}

const VariantStockForm = ({ form }: Props) => {
  const layeredModalContext = React.useContext(LayeredModalContext)

  const { isFeatureEnabled } = useFeatureFlag()

  const stockLocationEnabled = isFeatureEnabled("stockLocationService")

  const { stock_locations, refetch } = useAdminStockLocations(
    {},
    { enabled: stockLocationEnabled }
  )

  React.useEffect(() => {
    if (stockLocationEnabled) {
      refetch()
    }
  }, [stockLocationEnabled, refetch])

  const stockLocationsMap = React.useMemo(() => {
    return new Map(stock_locations?.map((sl) => [sl.id, sl]))
  }, [stock_locations])

  const {
    path,
    control,
    register,
    formState: { errors },
    watch,
  } = form

  const {
    fields: selectedLocations,
    append,
    remove,
  } = useFieldArray({
    control,
    name: path("stock_location"),
  })

  const locs = watch(
    selectedLocations?.map((sl, idx) =>
      path(`stock_location.${idx}.stocked_quantity`)
    )
  )
  const totalStockedQuantity = React.useMemo(() => {
    return sum(locs)
  }, [locs])

  const addLocations = async (data) => {
    const removed = data.removed.map((r) =>
      selectedLocations.findIndex((sl) => sl.location_id === r.id)
    )

    removed.forEach((r) => remove(r))

    data.added.forEach((added) => {
      append({
        location_id: added,
        stocked_quantity: 0,
      })
    })
  }

  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        Configure the inventory and stock for this variant.
      </p>
      <div className="gap-y-xlarge pt-large flex flex-col">
        <div className="gap-large grid grid-cols-2">
          <InputField
            label="Stock keeping unit (SKU)"
            placeholder="SUN-G, JK1234..."
            {...register(path("sku"))}
          />
          {!stockLocationEnabled && (
            <InputField
              label="Quantity in stock"
              type="number"
              placeholder="100..."
              errors={errors}
              {...register(path("inventory_quantity"), {
                valueAsNumber: true,
              })}
            />
          )}
          <InputField
            label="EAN (Barcode)"
            placeholder="123456789102..."
            {...register(path("ean"))}
          />
          <InputField
            label="UPC (Barcode)"
            placeholder="023456789104..."
            {...register(path("upc"))}
          />
          <InputField
            label="Barcode"
            placeholder="123456789104..."
            {...register(path("barcode"))}
          />
        </div>
        <div className="gap-y-2xsmall flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">Manage inventory</h3>
            <Controller
              control={control}
              name={path("manage_inventory")}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            When checked Medusa will regulate the inventory when orders and
            returns are made.
          </p>
        </div>
        <div className="gap-y-2xsmall flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">Allow backorders</h3>
            <Controller
              control={control}
              name={path("allow_backorder")}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            When checked the product will be available for purchase despite the
            product being sold out
          </p>
        </div>
        <FeatureToggle featureFlag="inventoryService">
          <div
            className={clsx({
              "pointer-events-none opacity-50 transition-opacity duration-100":
                !form.watch(path("manage_inventory")),
            })}
          >
            <div className="flex flex-col">
              <div className="gap-y-2xsmall mb-4 flex flex-col">
                <h3 className="inter-base-semibold mb-2xsmall">Quantity</h3>
                <div className="flex items-center justify-between">
                  <p className="inter-base-regular text-grey-50">Location</p>
                  <p className="inter-base-regular text-grey-50">In Stock</p>
                </div>
              </div>
              <div className="gap-y-base flex flex-col pb-6">
                {selectedLocations.map((sl, i) => (
                  <div key={sl.id} className="flex items-center">
                    <div className="inter-base-regular flex items-center">
                      <IconBadge className="me-base">
                        <BuildingsIcon />
                      </IconBadge>
                      {stockLocationsMap.get(sl.location_id)?.name}
                    </div>
                    <div className="ms-auto flex">
                      <InputField
                        placeholder={"0"}
                        type="number"
                        {...register(
                          path(`stock_location.${i}.stocked_quantity`),
                          {
                            valueAsNumber: true,
                          }
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {!!selectedLocations.length && (
                <div className="text-grey-50 mb-6 flex items-center justify-between border-t border-dashed pt-6">
                  <p>Total inventory at all locations</p>
                  <p>{`${totalStockedQuantity} available`}</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="small"
                className="w-full border"
                type="button"
                onClick={() => {
                  layeredModalContext.push(
                    // @ts-ignore
                    ManageLocationsScreen(
                      layeredModalContext.pop,
                      selectedLocations as InventoryLevelDTO[],
                      stock_locations as StockLocationDTO[],
                      addLocations
                    )
                  )
                }}
              >
                Manage locations
              </Button>
            </div>
          </div>
        </FeatureToggle>
      </div>
    </div>
  )
}

export default VariantStockForm
