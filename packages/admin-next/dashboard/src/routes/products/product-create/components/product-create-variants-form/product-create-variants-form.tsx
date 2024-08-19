import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { DataGrid } from "../../../../../components/data-grid"
import { createDataGridPriceColumns } from "../../../../../components/data-grid/data-grid-column-helpers/create-data-grid-price-columns"
import { createDataGridHelper } from "../../../../../components/data-grid/utils"
import { useRouteModal } from "../../../../../components/modals"
import { usePricePreferences } from "../../../../../hooks/api/price-preferences"
import { useRegions } from "../../../../../hooks/api/regions"
import { useStore } from "../../../../../hooks/api/store"
import {
  ProductCreateOptionSchema,
  ProductCreateVariantSchema,
} from "../../constants"
import { ProductCreateSchemaType } from "../../types"

type ProductCreateVariantsFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateVariantsForm = ({
  form,
}: ProductCreateVariantsFormProps) => {
  const {
    regions,
    isPending: isRegionsPending,
    isError: isRegionError,
    error: regionError,
  } = useRegions({ limit: 9999 })

  const {
    store,
    isPending: isStorePending,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const {
    price_preferences,
    isPending: isPricePreferencesPending,
    isError: isPricePreferencesError,
    error: pricePreferencesError,
  } = usePricePreferences({})

  const { setCloseOnEscape } = useRouteModal()

  const currencyCodes = useMemo(
    () => store?.supported_currencies?.map((c) => c.currency_code) || [],
    [store]
  )

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

  /**
   * NOTE: anything that goes to the datagrid component needs to be memoised otherwise DataGrid will rerender and inputs will loose focus
   */
  const columns = useColumns({
    options,
    currencies: currencyCodes,
    regions,
    pricePreferences: price_preferences,
  })

  const variantData = useMemo(
    () => variants.filter((v) => v.should_create),
    [variants]
  )

  const isPending =
    isRegionsPending ||
    isStorePending ||
    isPricePreferencesPending ||
    !store ||
    !regions ||
    !price_preferences

  if (isRegionError) {
    throw regionError
  }

  if (isStoreError) {
    throw storeError
  }

  if (isPricePreferencesError) {
    throw pricePreferencesError
  }

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGrid
        isLoading={isPending}
        columns={columns}
        data={variantData}
        state={form}
        onEditingChange={(editing) => setCloseOnEscape(!editing)}
      />
    </div>
  )
}

const columnHelper = createDataGridHelper<ProductCreateVariantSchema>()

const useColumns = ({
  options,
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  options: ProductCreateOptionSchema[]
  currencies?: string[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
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
            <DataGrid.ReadonlyCell>
              {options.map((o) => row.original.options[o.title]).join(" / ")}
            </DataGrid.ReadonlyCell>
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
            <DataGrid.TextCell
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
            <DataGrid.TextCell
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
            <DataGrid.BooleanCell
              context={context}
              field={`variants.${context.row.index}.manage_inventory`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "allow_backorder",
        name: t("fields.allowBackorder"),
        header: t("fields.allowBackorder"),
        cell: (context) => {
          return (
            <DataGrid.BooleanCell
              context={context}
              field={`variants.${context.row.index}.allow_backorder`}
            />
          )
        },
      }),

      columnHelper.column({
        id: "inventory_kit",
        name: t("fields.inventoryKit"),
        header: t("fields.inventoryKit"),
        cell: (context) => {
          return (
            <DataGrid.BooleanCell
              context={context}
              field={`variants.${context.row.index}.inventory_kit`}
              disabled={!context.row.original.manage_inventory}
            />
          )
        },
      }),

      ...createDataGridPriceColumns<ProductCreateVariantSchema>({
        currencies,
        regions,
        pricePreferences,
        getFieldName: (context, value) => {
          if (context.column.id.startsWith("currency_prices")) {
            return `variants.${context.row.index}.prices.${value}`
          }
          return `variants.${context.row.index}.prices.${value}`
        },
        t,
      }),
    ],
    [currencies, regions, options, pricePreferences, t]
  )
}
