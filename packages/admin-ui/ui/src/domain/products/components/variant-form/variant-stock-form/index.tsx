import { InventoryLevelDTO, StockLocationDTO } from "@medusajs/medusa"
import clsx from "clsx"
import { sum } from "lodash"
import { useAdminStockLocations } from "medusa-react"
import React from "react"
import { Controller, useFieldArray } from "react-hook-form"
import Switch from "../../../../../components/atoms/switch"
import Button from "../../../../../components/fundamentals/button"
import FeatureToggle from "../../../../../components/fundamentals/feature-toggle"
import IconBadge from "../../../../../components/fundamentals/icon-badge"
import BuildingsIcon from "../../../../../components/fundamentals/icons/buildings-icon"
import InputField from "../../../../../components/molecules/input"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import { NestedForm } from "../../../../../utils/nested-form"
import { ManageLocationsScreen } from "../../variant-inventory-form/variant-stock-form"

export type VariantStockFormType = {
  manage_inventory: boolean
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
  const { stock_locations } = useAdminStockLocations()
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
      <div className="flex flex-col gap-y-xlarge pt-large">
        <div className="grid grid-cols-2 gap-large">
          <InputField
            label="Stock keeping unit (SKU)"
            placeholder="SUN-G, JK1234..."
            {...register(path("sku"))}
          />
          <InputField
            label="Quantity in stock"
            type="number"
            placeholder="100..."
            errors={errors}
            {...register(path("inventory_quantity"), {
              valueAsNumber: true,
            })}
          />
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
        <div className="flex flex-col gap-y-2xsmall">
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
        <div className="flex flex-col gap-y-2xsmall">
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
              <div className="flex flex-col mb-4 gap-y-2xsmall">
                <h3 className="inter-base-semibold mb-2xsmall">Quantity</h3>
                <div className="flex items-center justify-between">
                  <p className="inter-base-regular text-grey-50">Location</p>
                  <p className="inter-base-regular text-grey-50">In Stock</p>
                </div>
              </div>
              <div className="flex flex-col pb-6 gap-y-base">
                {selectedLocations.map((sl, i) => (
                  <div key={sl.id} className="flex items-center">
                    <div className="flex items-center inter-base-regular">
                      <IconBadge className="mr-base">
                        <BuildingsIcon />
                      </IconBadge>
                      {stockLocationsMap.get(sl.location_id)?.name}
                    </div>
                    <div className="flex ml-auto">
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
                <div className="flex items-center justify-between pt-6 mb-6 border-t border-dashed text-grey-50">
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
