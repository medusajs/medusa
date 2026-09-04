import { useTranslation } from "react-i18next"
import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { ProductCreateVariantSchema } from "./schema"
import { ProductCreateSchemaType } from "./types"
import {
  createDataGridHelper,
  createDataGridPriceColumns,
  DataGrid,
  useRouteModal,
} from "@medusajs/dashboard/components"

type GiftCardProductCreateDenominationsFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>
  regions: HttpTypes.AdminRegion[]
  store: HttpTypes.AdminStore
  pricePreferences: HttpTypes.AdminPricePreference[]
}

export const GiftCardProductCreateDenominationsForm = ({
  form,
  regions,
  store,
  pricePreferences,
}: GiftCardProductCreateDenominationsFormProps) => {
  const { setCloseOnEscape } = useRouteModal()

  const currencyCodes = useMemo(
    () => store?.supported_currencies?.map((c) => c.currency_code) || [],
    [store]
  )

  const denominations = useWatch({
    control: form.control,
    name: "denominations",
    defaultValue: [],
  })

  const columns = useColumns({
    denominations,
    currencies: currencyCodes,
    regions,
    pricePreferences,
  })

  const variantData = useMemo(() => {
    const ret: any[] = []

    denominations.forEach((v, i) => {
      ret.push({ ...v, originalIndex: i })
    })

    return ret
  }, [denominations])

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGrid
        columns={columns}
        data={variantData}
        state={form}
        onEditingChange={(editing) => setCloseOnEscape(!editing)}
      />
    </div>
  )
}

const columnHelper = createDataGridHelper<
  ProductCreateVariantSchema,
  ProductCreateSchemaType
>()

const useColumns = ({
  denominations = [],
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  denominations: { value: string }[]
  currencies?: string[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
}) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.column({
        id: "denominations",
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">Denomination</span>
          </div>
        ),
        cell: (context: any) => {
          return (
            <DataGrid.ReadonlyCell context={context}>
              {context.row.original.value}
            </DataGrid.ReadonlyCell>
          )
        },
        disableHiding: true,
      }),

      ...createDataGridPriceColumns<
        ProductCreateVariantSchema,
        ProductCreateSchemaType
      >({
        currencies,
        regions,
        pricePreferences,
        getFieldName: (context, value) => {
          return `denominations.${context.row.original.originalIndex}.prices.${value}`
        },
        t,
      }),
    ],
    [currencies, regions, denominations, pricePreferences, t]
  )
}
