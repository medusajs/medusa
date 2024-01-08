import {
  BuildingTax,
  CurrencyDollar,
  EllipsisHorizontal,
} from "@medusajs/icons"
import { Currency, Store } from "@medusajs/medusa"
import {
  Badge,
  Button,
  Checkbox,
  CommandBar,
  Container,
  DropdownMenu,
  FocusModal,
  Heading,
  IconButton,
  Table,
  Text,
  Tooltip,
  clx,
  usePrompt,
} from "@medusajs/ui"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useAdminCurrencies,
  useAdminStore,
  useAdminUpdateStore,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { EditCurrenciesDetailsDrawer } from "../../components/edit-currencies-details-drawer"

export const CurrenciesDetails = () => {
  const { t } = useTranslation()

  const { store, isLoading } = useAdminStore()

  if (isLoading || !store) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Container className="p-0">
        <div className="flex items-center justify-between px-8 py-6">
          <div>
            <Heading>{t("currencies.domain")}</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {t("currencies.manageTheCurrencies")}
            </Text>
          </div>
          <EditCurrenciesDetailsDrawer store={store} />
        </div>
        <div className="grid grid-cols-2 border-t px-8 py-6">
          <Text size="small" leading="compact" weight="plus">
            {t("currencies.defaultCurrency")}
          </Text>
          <div className="flex items-center gap-x-2">
            <Badge rounded="full" className="uppercase">
              {store.default_currency_code}
            </Badge>
            <Text size="small" leading="compact">
              {store.default_currency.name}
            </Text>
          </div>
        </div>
      </Container>
      <StoreCurrencySection store={store} />
    </div>
  )
}

type StoreCurrenciesSectionProps = {
  store: Store
}

const PAGE_SIZE = 20

const StoreCurrencySection = ({ store }: StoreCurrenciesSectionProps) => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { mutateAsync } = useAdminUpdateStore()
  const prompt = usePrompt()
  const { t } = useTranslation()
  const pageCount = Math.ceil(store.currencies.length / PAGE_SIZE)
  const columns = useStoreCurrencyColumns()

  const table = useReactTable({
    data: store.currencies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    pageCount: pageCount,
    state: {
      rowSelection,
    },
  })

  const onDeleteCurrencies = async () => {
    const ids = Object.keys(rowSelection)

    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("currencies.removeCurrenciesWarning", {
        count: ids.length,
      }),
      confirmText: t("general.remove"),
      cancelText: t("general.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync({
      currencies: store.currencies
        .filter((c) => !ids.includes(c.code))
        .map((c) => c.code),
    })
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-8 pb-4 pt-6">
        <Heading level="h2">Store Currencies</Heading>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton variant="transparent">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              className="gap-x-2"
              onClick={() => setAddModalOpen(!addModalOpen)}
            >
              <CurrencyDollar className="text-ui-fg-subtle" />
              <span>Add Currencies</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="gap-x-2">
              <BuildingTax className="text-ui-fg-subtle" />
              <span>Tax Preferences</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      <div>
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
        <Table.Pagination
          canNextPage={table.getCanNextPage()}
          canPreviousPage={table.getCanPreviousPage()}
          nextPage={table.nextPage}
          previousPage={table.previousPage}
          count={store.currencies.length}
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
              action={onDeleteCurrencies}
              shortcut="r"
              label={t("general.remove")}
            />
          </CommandBar.Bar>
        </CommandBar>
      </div>
      <AddCurrenciesModal
        store={store}
        onOpenChange={setAddModalOpen}
        open={addModalOpen}
      />
    </Container>
  )
}

const storeCurrencyColumnHelper = createColumnHelper<Currency>()

const useStoreCurrencyColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      storeCurrencyColumnHelper.display({
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
      storeCurrencyColumnHelper.accessor("code", {
        header: t("fields.code"),
        cell: ({ getValue }) => getValue().toUpperCase(),
      }),
      storeCurrencyColumnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      storeCurrencyColumnHelper.accessor("includes_tax", {
        header: "Tax Inclusive Prices",
        cell: ({ getValue }) => {
          return getValue() ? t("general.enabled") : t("general.disabled")
        },
      }),
    ],
    [t]
  )
}

const CURRENCIES_PAGE_SIZE = 50

const AddCurrenciesModal = ({
  store,
  open,
  onOpenChange,
}: {
  store: Store
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: CURRENCIES_PAGE_SIZE,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { currencies, count, isLoading } = useAdminCurrencies({
    limit: CURRENCIES_PAGE_SIZE,
    offset: pageIndex * CURRENCIES_PAGE_SIZE,
  })

  const columns = useCurrencyColumns()

  const table = useReactTable({
    data: currencies ?? [],
    columns,
    pageCount: Math.ceil((count ?? 0) / CURRENCIES_PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      currencyCodes: store.currencies?.map((c) => c.code) ?? [],
    },
  })

  const { t } = useTranslation()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <Button variant="secondary">{t("general.cancel")}</Button>
            <Button>{t("general.save")}</Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
          <div className="w-full flex-1 overflow-y-auto">
            <Table>
              <Table.Header className="border-t-0">
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
                    className={clx(
                      "transition-fg last-of-type:border-b-0",
                      {
                        "bg-ui-bg-disabled hover:bg-ui-bg-disabled":
                          store.currencies
                            .map((c) => c.code)
                            ?.includes(row.original.code),
                      },
                      {
                        "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                          row.getIsSelected(),
                      }
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div className="w-full border-t">
            <Table.Pagination
              canNextPage={table.getCanNextPage()}
              canPreviousPage={table.getCanPreviousPage()}
              nextPage={table.nextPage}
              previousPage={table.previousPage}
              count={count ?? 0}
              pageIndex={pageIndex}
              pageCount={table.getPageCount()}
              pageSize={CURRENCIES_PAGE_SIZE}
            />
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}

const currencyColumnHelper = createColumnHelper<Currency>()

const useCurrencyColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      currencyColumnHelper.display({
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
        cell: ({ row, table }) => {
          const { currencyCodes } = table.options.meta as {
            currencyCodes: string[]
          }

          const isAdded = currencyCodes.includes(row.original.code)

          const isSelected = row.getIsSelected() || isAdded

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isAdded}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isAdded) {
            return (
              <Tooltip
                content={t("currencies.currencyAlreadyAdded")}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      currencyColumnHelper.accessor("code", {
        header: t("fields.code"),
        cell: ({ getValue }) => getValue().toUpperCase(),
      }),
      currencyColumnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
    ],
    [t]
  )
}
