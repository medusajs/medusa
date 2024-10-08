import { CheckCircle, Plus, Trash, XCircle } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Checkbox,
  CommandBar,
  Container,
  Heading,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../../components/common/action-menu"
import { DataTable } from "../../../../../../components/table/data-table"
import { StatusCell } from "../../../../../../components/table/table-cells/common/status-cell"
import { useCurrencies } from "../../../../../../hooks/api/currencies"
import { usePricePreferences } from "../../../../../../hooks/api/price-preferences"
import { useUpdateStore } from "../../../../../../hooks/api/store"
import { useDataTable } from "../../../../../../hooks/use-data-table"
import { useCurrenciesTableColumns } from "../../../../common/hooks/use-currencies-table-columns"
import { useCurrenciesTableQuery } from "../../../../common/hooks/use-currencies-table-query"

type StoreCurrencySectionProps = {
  store: HttpTypes.AdminStore
}

const PAGE_SIZE = 10

export const StoreCurrencySection = ({ store }: StoreCurrencySectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useCurrenciesTableQuery({ pageSize: PAGE_SIZE })

  const {
    currencies,
    count,
    isPending: isCurrenciesPending,
    isError: isCurrenciesError,
    error: currenciesError,
  } = useCurrencies(
    {
      code: store.supported_currencies?.map((c) => c.currency_code),
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
      enabled: !!store.supported_currencies?.length,
    }
  )

  const {
    price_preferences: pricePreferences,
    isPending: isPricePreferencesPending,
    isError: isPricePreferencesError,
    error: pricePreferencesError,
  } = usePricePreferences(
    {
      attribute: "currency_code",
      value: store.supported_currencies?.map((c) => c.currency_code),
    },
    {
      enabled: !!store.supported_currencies?.length,
    }
  )

  const columns = useColumns()
  const prefMap = useMemo(() => {
    return new Map(pricePreferences?.map((pref) => [pref.value!, pref]))
  }, [pricePreferences])

  const withTaxInclusivity = currencies?.map((c) => ({
    ...c,
    is_tax_inclusive: prefMap.get(c.code)?.is_tax_inclusive,
  }))

  const { table } = useDataTable({
    data: withTaxInclusivity ?? [],
    columns,
    count: count,
    getRowId: (row) => row.code,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    enablePagination: true,
    enableRowSelection: true,
    pageSize: PAGE_SIZE,
    meta: {
      storeId: store.id,
      supportedCurrencies: store.supported_currencies,
      defaultCurrencyCode: store.supported_currencies?.find((c) => c.is_default)
        ?.currency_code,
      preferencesMap: prefMap,
    },
  })

  const { mutateAsync } = useUpdateStore(store.id)
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDeleteCurrencies = async () => {
    const ids = Object.keys(rowSelection)

    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("store.removeCurrencyWarning", {
        count: ids.length,
      }),
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(
      {
        supported_currencies:
          store.supported_currencies?.filter(
            (c) => !ids.includes(c.currency_code)
          ) ?? [],
      },
      {
        onSuccess: () => {
          setRowSelection({})
          toast.success(t("store.toast.currenciesRemoved"))
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  if (isCurrenciesError) {
    throw currenciesError
  }

  if (isPricePreferencesError) {
    throw pricePreferencesError
  }

  const isLoading = isCurrenciesPending || isPricePreferencesPending

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("store.currencies")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <Plus />,
                  label: t("actions.add"),
                  to: "currencies",
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        orderBy={["code", "name"]}
        search
        pagination
        table={table}
        pageSize={PAGE_SIZE}
        columns={columns}
        count={!store.supported_currencies?.length ? 0 : count}
        isLoading={!store.supported_currencies?.length ? false : isLoading}
        queryObject={raw}
      />
      <CommandBar open={!!Object.keys(rowSelection).length}>
        <CommandBar.Bar>
          <CommandBar.Value>
            {t("general.countSelected", {
              count: Object.keys(rowSelection).length,
            })}
          </CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            action={handleDeleteCurrencies}
            shortcut="r"
            label={t("actions.remove")}
          />
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  )
}

const CurrencyActions = ({
  storeId,
  currency,
  supportedCurrencies,
  defaultCurrencyCode,
  preferencesMap,
}: {
  storeId: string
  currency: HttpTypes.AdminCurrency
  supportedCurrencies: HttpTypes.AdminStoreCurrency[]
  defaultCurrencyCode: string
  preferencesMap: Map<string, HttpTypes.AdminPricePreference>
}) => {
  const { mutateAsync } = useUpdateStore(storeId)
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleRemove = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("store.removeCurrencyWarning", {
        count: 1,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: currency.name,
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(
      {
        supported_currencies: supportedCurrencies.filter(
          (c) => c.currency_code !== currency.code
        ),
      },
      {
        onSuccess: () => {
          toast.success(t("store.toast.currenciesRemoved"))
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  const handleToggleTaxInclusivity = async () => {
    await mutateAsync(
      {
        supported_currencies: supportedCurrencies.map((c) => {
          const pref = preferencesMap.get(c.currency_code)
          return {
            ...c,
            is_tax_inclusive:
              c.currency_code === currency.code
                ? !pref?.is_tax_inclusive
                : undefined,
          }
        }),
      },
      {
        onSuccess: () => {
          toast.success(t("store.toast.updatedTaxInclusivitySuccessfully"))
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: preferencesMap.get(currency.code)?.is_tax_inclusive ? (
                <XCircle />
              ) : (
                <CheckCircle />
              ),
              label: preferencesMap.get(currency.code)?.is_tax_inclusive
                ? t("store.disableTaxInclusivePricing")
                : t("store.enableTaxInclusivePricing"),
              onClick: handleToggleTaxInclusivity,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.remove"),
              onClick: handleRemove,
              disabled: currency.code === defaultCurrencyCode,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<
  HttpTypes.AdminCurrency & { is_tax_inclusive?: boolean }
>()

const useColumns = () => {
  const base = useCurrenciesTableColumns()
  const { t } = useTranslation()

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
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
      columnHelper.accessor("is_tax_inclusive", {
        header: t("fields.taxInclusivePricing"),
        cell: ({ getValue }) => {
          const isTaxInclusive = getValue()
          return (
            <StatusCell color={isTaxInclusive ? "green" : "grey"}>
              {isTaxInclusive ? t("fields.true") : t("fields.false")}
            </StatusCell>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const {
            supportedCurrencies,
            storeId,
            defaultCurrencyCode,
            preferencesMap,
          } = table.options.meta as {
            supportedCurrencies: HttpTypes.AdminStoreCurrency[]
            storeId: string
            defaultCurrencyCode: string
            preferencesMap: Map<string, HttpTypes.AdminPricePreference>
          }

          return (
            <CurrencyActions
              storeId={storeId}
              currency={row.original}
              supportedCurrencies={supportedCurrencies}
              defaultCurrencyCode={defaultCurrencyCode}
              preferencesMap={preferencesMap}
            />
          )
        },
      }),
    ],
    [base, t]
  )
}
