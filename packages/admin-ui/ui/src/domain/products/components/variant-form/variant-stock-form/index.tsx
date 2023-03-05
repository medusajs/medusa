import React from "react"
import { Controller } from "react-hook-form"
import Switch from "../../../../../components/atoms/switch"
import InputField from "../../../../../components/molecules/input"
import { NestedForm } from "../../../../../utils/nested-form"

export type VariantStockFormType = {
  manage_inventory: boolean
  allow_backorder: boolean
  inventory_quantity: number | null
  sku: string | null
  ean: string | null
  upc: string | null
  barcode: string | null
}

type Props = {
  form: NestedForm<VariantStockFormType>
}

const VariantStockForm = ({ form }: Props) => {
  const {
    path,
    control,
    register,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        Configure the inventory and stock for this variant.
      </p>
      <div className="pt-large flex flex-col gap-y-xlarge">
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
      </div>
    </div>
  )
}

export default VariantStockForm
