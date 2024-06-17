import { HttpTypes, RegionDTO } from "@medusajs/types"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ProductCreateSchemaType } from "../../types"
import { useStore } from "../../../../../hooks/api/store"
import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import { DataGridReadOnlyCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-readonly-cell"
import { DataGridTextCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-text-cell"
import { createDataGridHelper } from "../../../../../components/data-grid/utils"
import { DataGridCurrencyCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-currency-cell"
import { DataGridBooleanCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-boolean-cell"
import { useRegions } from "../../../../../hooks/api/regions"

type ProductCreateVariantsFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateVariantsForm = ({
  form,
}: ProductCreateVariantsFormProps) => {
  const { regions } = useRegions({ limit: 9999 })

  const { store, isPending, isError, error } = useStore({
    fields: "supported_currency_codes",
  })

  const variants = useWatch({
    control: form.control,
    name: "variants",
    defaultValue: [],
  })

  const options = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  })

  const columns = useColumns({
    options,
    currencies: store?.supported_currency_codes,
    regions,
  })

  const variantData = useMemo(
    () => variants.filter((v) => v.should_create),
    [variants]
  )

  if (isError) {
    throw error
  }

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      {isPending && !store ? (
        <div>Loading...</div>
      ) : (
        <DataGridRoot columns={columns} data={variantData} state={form} />
      )}
    </div>
  )
}

const columnHelper = createDataGridHelper<HttpTypes.AdminProductVariant>()

const useColumns = ({
  options,
  currencies = [],
  regions = [],
}: {
  options: any // CreateProductOptionSchemaType[]
  currencies?: string[]
  regions: RegionDTO[]
}) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.column({
        id: "options",
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">
              {options.map((o) => o.title).join(" / ")}
            </span>
          </div>
        ),
        cell: ({ row }) => {
          return (
            <DataGridReadOnlyCell>
              {options.map((o) => row.original.options[o.title]).join(" / ")}
            </DataGridReadOnlyCell>
          )
        },
        disableHiding: true,
      }),
      columnHelper.column({
        id: "title",
        name: t("fields.title"),
        header: t("fields.title"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.title`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "sku",
        name: t("fields.sku"),
        header: t("fields.sku"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.sku`}
            />
          )
        },
      }),

      columnHelper.column({
        id: "manage_inventory",
        name: t("fields.managedInventory"),
        header: t("fields.managedInventory"),
        cell: (context) => {
          return (
            <DataGridBooleanCell
              context={context}
              field={`variants.${context.row.index}.manage_inventory`}
            />
          )
        },
        type: "boolean",
      }),
      columnHelper.column({
        id: "allow_backorder",
        name: t("fields.allowBackorder"),
        header: t("fields.allowBackorder"),
        cell: (context) => {
          return (
            <DataGridBooleanCell
              context={context}
              field={`variants.${context.row.index}.allow_backorder`}
            />
          )
        },
        type: "boolean",
      }),

      columnHelper.column({
        id: "inventory_kit",
        name: t("fields.inventoryKit"),
        header: t("fields.inventoryKit"),
        cell: (context) => {
          return (
            <DataGridBooleanCell
              context={context}
              field={`variants.${context.row.index}.inventory_kit`}
              disabled={!context.row.original.manage_inventory}
            />
          )
        },
        type: "boolean",
      }),

      ...currencies.map((currency) => {
        return columnHelper.column({
          id: `price_${currency}`,
          name: `Price ${currency.toUpperCase()}`,
          header: `Price ${currency.toUpperCase()}`,
          cell: (context) => {
            return (
              <DataGridCurrencyCell
                code={currency}
                context={context}
                field={`variants.${context.row.index}.prices.${currency}`}
              />
            )
          },
        })
      }),

      ...regions.map((region) => {
        return columnHelper.column({
          id: `price_${region.id}`,
          name: `Price ${region.name}`,
          header: `Price ${region.name}`,
          cell: (context) => {
            return (
              <DataGridCurrencyCell
                code={region.currency_code}
                context={context}
                field={`variants.${context.row.index}.prices.${region.id}`}
              />
            )
          },
        })
      }),
    ],
    [currencies, regions, options, t]
  )
}
