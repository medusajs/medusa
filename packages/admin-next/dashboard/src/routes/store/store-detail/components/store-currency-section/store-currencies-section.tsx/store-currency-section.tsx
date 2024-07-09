import { Plus, Trash } from "@medusajs/icons"
import { CurrencyDTO, StoreCurrencyDTO } from "@medusajs/types"
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

  const { currencies, count, isPending, isError, error } = useCurrencies(
    {
      code: store.supported_currencies?.map((c) => c.currency_code),
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
      enabled: !!store.supported_currencies?.length,
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
      supportedCurrencies: store.supported_currencies,
      defaultCurrencyCode: store.supported_currencies?.find((c) => c.is_default)
        ?.currency_code,
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
        count={!store.supported_currencies?.length ? 0 : count}
        isLoading={!store.supported_currencies?.length ? false : isPending}
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
}: {
  storeId: string
  currency: CurrencyDTO
  supportedCurrencies: StoreCurrencyDTO[]
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
          const { supportedCurrencies, storeId, defaultCurrencyCode } = table
            .options.meta as {
            supportedCurrencies: StoreCurrencyDTO[]
            storeId: string
            defaultCurrencyCode: string
          }

          return (
            <CurrencyActions
              storeId={storeId}
              currency={row.original}
              supportedCurrencies={supportedCurrencies}
              defaultCurrencyCode={defaultCurrencyCode}
            />
          )
        },
      }),
    ],
    [base]
  )
}
