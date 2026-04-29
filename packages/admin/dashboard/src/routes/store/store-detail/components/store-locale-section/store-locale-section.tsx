import { Plus, Trash } from "@medusajs/icons"
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

import { ActionMenu } from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"
import { useUpdateStore } from "../../../../../hooks/api/store"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useLocalesTableColumns } from "../../../common/hooks/use-locales-table-columns"
import { useLocalesTableQuery } from "../../../common/hooks/use-locales-table-query"
import { useLocales } from "../../../../../hooks/api"

type StoreLocaleSectionProps = {
  store: HttpTypes.AdminStore
}

const PAGE_SIZE = 10

export const StoreLocaleSection = ({ store }: StoreLocaleSectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useLocalesTableQuery({ pageSize: PAGE_SIZE })

  const { locales, count, isPending, isError, error } = useLocales(
    {
      code: store.supported_locales?.map((l) => l.locale_code),
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
      enabled: !!store.supported_locales?.length,
    }
  )

  const columns = useColumns()

  const { table } = useDataTable({
    data: locales ?? [],
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
      supportedLocales: store.supported_locales,
    },
  })

  const { mutateAsync } = useUpdateStore(store.id)
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDeleteLocales = async () => {
    const ids = Object.keys(rowSelection)

    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("store.removeLocaleWarning", {
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
        supported_locales:
          store.supported_locales?.filter(
            (l) => !ids.includes(l.locale_code)
          ) ?? [],
      },
      {
        onSuccess: () => {
          setRowSelection({})
          toast.success(t("store.toast.localesRemoved"))
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

  const isLoading = isPending

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("store.locales")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <Plus />,
                  label: t("actions.add"),
                  to: "locales",
                },
              ],
            },
          ]}
        />
      </div>
      <_DataTable
        orderBy={[
          { key: "name", label: t("fields.name") },
          { key: "code", label: t("fields.code") },
        ]}
        search
        pagination
        table={table}
        pageSize={PAGE_SIZE}
        columns={columns}
        count={!store.supported_locales?.length ? 0 : count}
        isLoading={!store.supported_locales?.length ? false : isLoading}
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
            action={handleDeleteLocales}
            shortcut="r"
            label={t("actions.remove")}
          />
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  )
}

const LocaleActions = ({
  storeId,
  locale,
  supportedLocales,
}: {
  storeId: string
  locale: HttpTypes.AdminLocale
  supportedLocales: HttpTypes.AdminStoreLocale[]
}) => {
  const { mutateAsync } = useUpdateStore(storeId)
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleRemove = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("store.removeLocaleWarning", {
        count: 1,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: locale.name,
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(
      {
        supported_locales: supportedLocales.filter(
          (l) => l.locale_code !== locale.code
        ),
      },
      {
        onSuccess: () => {
          toast.success(t("store.toast.localesRemoved"))
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
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminLocale>()

const useColumns = () => {
  const base = useLocalesTableColumns()
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
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { supportedLocales, storeId } = table.options.meta as {
            supportedLocales: HttpTypes.AdminStoreLocale[]
            storeId: string
          }

          return (
            <LocaleActions
              storeId={storeId}
              locale={row.original}
              supportedLocales={supportedLocales}
            />
          )
        },
      }),
    ],
    [base, t]
  )
}
