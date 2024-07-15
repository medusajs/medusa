import { Button, Checkbox, Hint, Switch, toast, Tooltip } from "@medusajs/ui"
import {
  createColumnHelper,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { DataTable } from "../../../../../components/table/data-table"
import { useCurrencies } from "../../../../../hooks/api/currencies"
import { useUpdateStore } from "../../../../../hooks/api/store"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCurrenciesTableColumns } from "../../../common/hooks/use-currencies-table-columns"
import { useCurrenciesTableQuery } from "../../../common/hooks/use-currencies-table-query"
import { usePricePreferences } from "../../../../../hooks/api/price-preferences"

type AddCurrenciesFormProps = {
  store: HttpTypes.AdminStore
}

const AddCurrenciesSchema = zod.object({
  currencies: zod.array(zod.string()).min(1),
  pricePreferences: zod.record(zod.boolean()),
})

const PAGE_SIZE = 50
const PREFIX = "ac"

export const AddCurrenciesForm = ({ store }: AddCurrenciesFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { raw, searchParams } = useCurrenciesTableQuery({
    pageSize: 50,
    prefix: PREFIX,
  })

  const {
    currencies,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useCurrencies(searchParams, {
    placeholderData: keepPreviousData,
  })

  const {
    price_preferences: pricePreferences,
    isPending: isPricePreferencesPending,
    isError: isPricePreferencesError,
    error: pricePreferencesError,
  } = usePricePreferences({
    attribute: "currency_code",
    value: store.supported_currencies?.map((c) => c.currency_code),
  })

  const form = useForm<zod.infer<typeof AddCurrenciesSchema>>({
    defaultValues: {
      currencies: [],
      pricePreferences: {},
    },
    resolver: zodResolver(AddCurrenciesSchema),
  })

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { setValue, watch } = form
  const pricePreferenceValues = watch("pricePreferences")

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const updated = typeof fn === "function" ? fn(rowSelection) : fn

    const ids = Object.keys(updated)
    setValue("currencies", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(updated)
  }

  const preSelectedRows =
    store.supported_currencies?.map((c) => c.currency_code) ?? []

  const setPricePreferences = useCallback(
    (values: Record<string, boolean>) => {
      setValue("pricePreferences", values)
    },
    [setValue]
  )

  useEffect(() => {
    setPricePreferences(
      pricePreferences?.reduce((acc: Record<string, boolean>, curr) => {
        acc[curr.value] = curr.is_tax_inclusive
        return acc
      }, {})
    )
  }, [pricePreferences, setPricePreferences])

  const columns = useColumns(pricePreferenceValues, setPricePreferences)

  const { table } = useDataTable({
    data: currencies ?? [],
    columns,
    count: count,
    getRowId: (row) => row.code,
    enableRowSelection: (row) => !preSelectedRows.includes(row.original.code),
    enablePagination: true,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  const { mutateAsync, isPending } = useUpdateStore(store.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    const currencies = Array.from(
      new Set([...data.currencies, ...preSelectedRows])
    ) as string[]

    let defaultCurrency = store.supported_currencies?.find(
      (c) => c.is_default
    )?.currency_code

    if (!currencies.includes(defaultCurrency ?? "")) {
      defaultCurrency = currencies?.[0]
    }

    await mutateAsync(
      {
        supported_currencies: currencies.map((c) => ({
          currency_code: c,
          is_default: c === defaultCurrency,
          is_tax_inclusive: data.pricePreferences[c],
        })),
      },
      {
        onSuccess: () => {
          toast.success(t("store.toast.currenciesUpdated"))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center">
              {form.formState.errors.currencies && (
                <Hint variant="error">
                  {form.formState.errors.currencies.message}
                </Hint>
              )}
            </div>
            <div className="flex items-center justify-end gap-x-2">
              <RouteFocusModal.Close asChild>
                <Button size="small" variant="secondary">
                  {t("actions.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <Button size="small" type="submit" isLoading={isPending}>
                {t("actions.save")}
              </Button>
            </div>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <DataTable
            table={table}
            pageSize={PAGE_SIZE}
            count={count}
            columns={columns}
            layout="fill"
            pagination
            search
            prefix={PREFIX}
            orderBy={["code", "name"]}
            isLoading={isLoading}
            queryObject={raw}
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminCurrency>()

const useColumns = (
  pricePreferences: Record<string, boolean>,
  setPricePreferences: any
) => {
  const { t } = useTranslation()
  const base = useCurrenciesTableColumns()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          const isPreSelected = !row.getCanSelect()
          const isSelected = row.getIsSelected() || isPreSelected

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isPreSelected}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isPreSelected) {
            return (
              <Tooltip content={t("store.currencyAlreadyAdded")} side="right">
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      ...base,
      columnHelper.display({
        id: "select",
        header: () => (
          <div className="whitespace-nowrap">
            {t("fields.taxInclusivePricing")}
          </div>
        ),
        cell: ({ row }) => {
          const isPreSelected = !row.getCanSelect()
          const isTaxInclusive = pricePreferences[row.original.code]
          return (
            <Switch
              disabled={isPreSelected}
              checked={isTaxInclusive ?? false}
              onCheckedChange={(val) => {
                setPricePreferences({
                  ...pricePreferences,
                  [row.original.code]: val,
                })
              }}
            />
          )
        },
      }),
    ],
    [t, base, pricePreferences, setPricePreferences]
  )
}
