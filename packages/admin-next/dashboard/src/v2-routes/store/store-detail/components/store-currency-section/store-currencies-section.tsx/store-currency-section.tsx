import { Plus, Trash } from "@medusajs/icons"
import { CurrencyDTO } from "@medusajs/types"
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
import { useCurrencies } from "../../../../../../hooks/api/currencies"
import { useUpdateStore } from "../../../../../../hooks/api/store"
import { useDataTable } from "../../../../../../hooks/use-data-table"
import { ExtendedStoreDTO } from "../../../../../../types/api-responses"
import { useCurrenciesTableColumns } from "../../../../common/hooks/use-currencies-table-columns"
import { useCurrenciesTableQuery } from "../../../../common/hooks/use-currencies-table-query"

type StoreCurrencySectionProps = {
  store: ExtendedStoreDTO
}

const PAGE_SIZE = 10

export const StoreCurrencySection = ({ store }: StoreCurrencySectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useCurrenciesTableQuery({ pageSize: PAGE_SIZE })

  const {
    currencies,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useCurrencies(
    {
      code: store.supported_currency_codes,
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()

  const { table } = useDataTable({
    data: currencies ?? [],
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
      currencyCodes: store.supported_currency_codes,
      defaultCurrencyCode: store.default_currency_code,
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

    try {
      await mutateAsync({
        supported_currency_codes: store.supported_currency_codes.filter(
          (c) => !ids.includes(c)
        ),
      })
      setRowSelection({})

      toast.success(t("general.success"), {
        description: t("store.toast.currenciesRemoved"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  if (isError) {
    throw error
  }

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
        count={count}
        isLoading={isLoading}
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
  currencyCodes,
  defaultCurrencyCode,
}: {
  storeId: string
  currency: CurrencyDTO
  currencyCodes: string[]
  defaultCurrencyCode: string
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

    try {
      await mutateAsync({
        supported_currency_codes: currencyCodes.filter(
          (c) => c !== currency.code
        ),
      })

      toast.success(t("general.success"), {
        description: t("store.toast.currenciesRemoved"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  return (
    <ActionMenu
      groups={[
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

const columnHelper = createColumnHelper<CurrencyDTO>()

const useColumns = () => {
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
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { currencyCodes, storeId, defaultCurrencyCode } = table.options
            .meta as {
            currencyCodes: string[]
            storeId: string
            defaultCurrencyCode: string
          }

          return (
            <CurrencyActions
              storeId={storeId}
              currency={row.original}
              currencyCodes={currencyCodes}
              defaultCurrencyCode={defaultCurrencyCode}
            />
          )
        },
      }),
    ],
    [base]
  )
}
