import { Trash } from "@medusajs/icons"
import { Currency, Store } from "@medusajs/medusa"
import {
  Button,
  Checkbox,
  CommandBar,
  Container,
  Heading,
  StatusBadge,
  Table,
  clx,
  usePrompt,
} from "@medusajs/ui"
import {
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminUpdateStore } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../../components/common/action-menu"
import { LocalizedTablePagination } from "../../../../../../components/localization/localized-table-pagination"
import { StoreDTO } from "@medusajs/types"
import { useV2StoreCurrencies } from "../../../../../../lib/api-v2"

type StoreCurrencySectionProps = {
  store: StoreDTO
}

const PAGE_SIZE = 20

export const StoreCurrencySection = ({ store }: StoreCurrencySectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { currencies } = useV2StoreCurrencies({
    currencyCodes: store.supported_currency_codes,
  })

  const columns = useColumns()

  const table = useReactTable({
    data: currencies ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.code,
    pageCount: Math.ceil(store.supported_currency_codes.length / PAGE_SIZE),
    state: {
      rowSelection,
    },
    meta: {
      currencyCodes: store.supported_currency_codes,
    },
  })

  const { mutateAsync } = useAdminUpdateStore()
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
        currencies: store.supported_currency_codes.filter(
          (c) => !ids.includes(c)
        ),
      },
      {
        onSuccess: () => {
          setRowSelection({})
        },
      }
    )
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("store.currencies")}</Heading>
        <div>
          <Link to="/settings/store/add-currencies">
            <Button size="small" variant="secondary">
              {t("general.add")}
            </Button>
          </Link>
        </div>
      </div>
      <Table>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <Table.Row
                key={headerGroup.id}
                className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th]:w-1/3"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <Table.HeaderCell key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Table.HeaderCell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Header>
        <Table.Body className="border-b-0">
          {table.getRowModel().rows.map((row) => (
            <Table.Row
              key={row.id}
              className={clx("transition-fg", {
                "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                  row.getIsSelected(),
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <LocalizedTablePagination
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        nextPage={table.nextPage}
        previousPage={table.previousPage}
        count={store.supported_currency_codes.length}
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        pageSize={PAGE_SIZE}
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
  currency,
  currencyCodes,
}: {
  currency: Currency
  currencyCodes: string[]
}) => {
  const { mutateAsync } = useAdminUpdateStore()
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

    await mutateAsync({
      currencies: currencyCodes.filter((c) => c !== currency.code),
    })
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

const columnHelper = createColumnHelper<Currency>()

const useColumns = () => {
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
      columnHelper.accessor("code", {
        header: t("fields.code"),
        cell: ({ getValue }) => getValue().toUpperCase(),
      }),
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("includes_tax", {
        header: "Tax Inclusive Prices",
        cell: ({ getValue }) => {
          const value = getValue()
          const text = value ? t("general.enabled") : t("general.disabled")

          return (
            <StatusBadge color={value ? "green" : "red"}>{text}</StatusBadge>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { currencyCodes } = table.options.meta as {
            currencyCodes: string[]
          }

          return (
            <CurrencyActions
              currency={row.original}
              currencyCodes={currencyCodes}
            />
          )
        },
      }),
    ],
    [t]
  )
}
