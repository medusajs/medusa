import { ExclamationCircle, Spinner } from "@medusajs/icons"
import type { CustomerGroup } from "@medusajs/medusa"
import {
  Checkbox,
  Container,
  DatePicker,
  Heading,
  Input,
  RadioGroup,
  Switch,
  Table,
  Text,
  Textarea,
  clx,
} from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table"
import { useAdminCustomerGroups } from "medusa-react"
import * as React from "react"

import { DateComparisonOperator } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../components/helpers/form"
import { FilterMenu } from "../../../../components/molecules/filter-menu"
import { useDebounce } from "../../../../hooks/use-debounce"
import { type NestedForm } from "../../../../utils/nested-form"
import { PriceListDetailsSchema } from "./types"

interface PriceListDetailsFormProps {
  form: NestedForm<PriceListDetailsSchema>
  layout: "drawer" | "focus"
  enableTaxToggle?: boolean
}

const PriceListDetailsForm = ({
  form,
  layout,
  enableTaxToggle,
}: PriceListDetailsFormProps) => {
  return (
    <div className="flex w-full flex-col gap-y-12">
      <PriceListType form={form} layout={layout} />
      <PriceListGeneral
        form={form}
        layout={layout}
        enableTaxToggle={enableTaxToggle}
      />
      <PriceListDates form={form} layout={layout} />
      <PriceListCustomerGroups form={form} layout={layout} />
    </div>
  )
}

/** Type */

const PriceListType = ({ form, layout }: PriceListDetailsFormProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <Heading level="h2">
          {t("price-list-details-form-type-heading", "Type")}
        </Heading>
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-details-form-type-description",
            "Choose the type of price list you want to create."
          )}
        </Text>
      </div>
      <Form.Field
        control={form.control}
        name={form.path("type.value")}
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Control>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  className={clx("grid gap-4", {
                    "grid-cols-2": layout === "focus",
                    "grid-cols-1": layout === "drawer",
                  })}
                >
                  <RadioGroup.ChoiceBox
                    id="type_opt_sale"
                    aria-describedby="type_opt_sale_desc"
                    value="sale"
                    label={t("price-list-details-form-type-label-sale", "Sale")}
                    description={t(
                      "price-list-details-form-type-hint-sale",
                      "Use this if you are creating a sale."
                    )}
                  />
                  <RadioGroup.ChoiceBox
                    id="type_opt_override"
                    aria-describedby="type_opt_override_desc"
                    value="override"
                    label={t(
                      "price-list-details-form-type-label-override",
                      "Override"
                    )}
                    description={t(
                      "price-list-details-form-type-hint-override",
                      "Use this if you are overriding prices."
                    )}
                  />
                </RadioGroup>
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}

/** General */

const PriceListGeneral = ({
  form,
  layout,
  enableTaxToggle,
}: PriceListDetailsFormProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <Heading level="h2">
          {t("price-list-details-form-general-heading", "General")}
        </Heading>
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-details-form-general-description",
            "Choose a title and description for the price list."
          )}
        </Text>
      </div>
      <div
        className={clx("grid gap-4", {
          "grid-cols-1": layout === "drawer",
          "grid-cols-2": layout === "focus",
        })}
      >
        <Form.Field
          control={form.control}
          name={form.path("general.name")}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>
                  {t("price-list-details-form-general-name-label", "Name")}
                </Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    placeholder={
                      t(
                        "price-list-details-form-general-name-placeholder",
                        "Black Friday Sale"
                      ) ?? undefined
                    }
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
      <Form.Field
        control={form.control}
        name={form.path("general.description")}
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>
                {t(
                  "price-list-details-form-general-description-label",
                  "Description"
                )}
              </Form.Label>
              <Form.Control>
                <Textarea
                  {...field}
                  placeholder={
                    t(
                      "price-list-details-form-general-description-placeholder",
                      "Prices for the Black Friday sale..."
                    ) ?? undefined
                  }
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
      {enableTaxToggle && (
        <Form.Field
          control={form.control}
          name={form.path("general.tax_inclusive")}
          render={({ field: { value, onChange, ...rest } }) => {
            return (
              <Form.Item>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <Form.Label>
                      {t(
                        "price-list-details-form-tax-inclusive-label",
                        "Tax inclusive prices"
                      )}
                    </Form.Label>
                    <Form.Hint className="!txt-medium">
                      {t(
                        "price-list-details-form-tax-inclusive-hint",
                        "Choose to make all prices in this list inclusive of tax."
                      )}
                    </Form.Hint>
                  </div>
                  <Form.Control>
                    <Switch
                      {...rest}
                      checked={value}
                      onCheckedChange={onChange}
                    />
                  </Form.Control>
                </div>
              </Form.Item>
            )
          }}
        />
      )}
    </div>
  )
}

/** Dates */

const PriceListDates = ({ form, layout }: PriceListDetailsFormProps) => {
  const [startOpen, setStartOpen] = React.useState(
    !!form.getValues(form.path("dates.starts_at"))
  )
  const [endOpen, setEndOpen] = React.useState(
    !!form.getValues(form.path("dates.ends_at"))
  )

  const { t } = useTranslation()

  const toggleStart = (state: boolean) => {
    if (!state) {
      form.setValue(form.path("dates.starts_at"), undefined, {
        shouldDirty: true,
        shouldTouch: true,
      })
    }

    setStartOpen(state)
  }

  const toggleEnd = (state: boolean) => {
    if (!state) {
      form.setValue(form.path("dates.ends_at"), undefined, {
        shouldDirty: true,
        shouldTouch: true,
      })
    }

    setEndOpen(state)
  }

  return (
    <div className="flex flex-col gap-y-12">
      <div>
        <div>
          <div className="flex items-center justify-between">
            <Heading level="h2">
              {t(
                "price-list-details-form-dates-starts-at-heading",
                "Price list has a start date?"
              )}
            </Heading>
            <Switch checked={startOpen} onCheckedChange={toggleStart} />
          </div>
          <Text className="text-ui-fg-subtle">
            {t(
              "price-list-details-form-dates-starts-at-description",
              "Schedule the price overrides to activate in the future."
            )}
          </Text>
        </div>
        <Collapsible.Root open={startOpen}>
          <Collapsible.Content forceMount className="group">
            <div
              className={clx(
                "hidden gap-4 pt-6 group-data-[state='open']:grid",
                {
                  "grid-cols-2": layout === "focus",
                  "grid-cols-1": layout === "drawer",
                }
              )}
            >
              <Form.Field
                control={form.control}
                name={form.path("dates.starts_at")}
                render={({ field: { ref: _ref, value, ...rest } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t(
                          "price-list-details-form-dates-starts-at-label",
                          "Start date"
                        )}
                      </Form.Label>
                      <Form.Control>
                        <DatePicker
                          {...rest}
                          value={value ?? undefined}
                          showTimePicker
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
      <div>
        <div>
          <div className="flex items-center justify-between">
            <Heading level="h2">
              {t(
                "price-list-details-form-ends-at-heading",
                "Price list has an expiry date?"
              )}
            </Heading>
            <Switch checked={endOpen} onCheckedChange={toggleEnd} />
          </div>
          <Text className="text-ui-fg-subtle">
            {t(
              "price-list-details-form-ends-at-description",
              "Schedule the price overrides to deactivate in the future."
            )}
          </Text>
        </div>
        <Collapsible.Root open={endOpen}>
          <Collapsible.Content forceMount className="group">
            <div
              className={clx(
                "hidden gap-4 pt-6 group-data-[state='open']:grid",
                {
                  "grid-cols-2": layout === "focus",
                  "grid-cols-1": layout === "drawer",
                }
              )}
            >
              <Form.Field
                control={form.control}
                name={form.path("dates.ends_at")}
                render={({ field: { ref: _ref, value, ...rest } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t(
                          "price-list-details-form-ends-at-label",
                          "Expiry date"
                        )}
                      </Form.Label>
                      <Form.Control>
                        <DatePicker
                          {...rest}
                          value={value ?? undefined}
                          showTimePicker
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  )
}

/** Customer groups */
const columnHelper = createColumnHelper<CustomerGroup>()

const useCustomerGroupsColumns = () => {
  const { t } = useTranslation()

  const columns = React.useMemo(
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
              aria-label="Select all customer groups on the current page"
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          )
        },
      }),
      columnHelper.accessor("name", {
        header: () => t("price-list-details-form-customer-groups-name", "Name"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("customers", {
        header: () => (
          <div className="w-full text-right">
            {t("price-list-details-form-customer-groups-members", "Members")}
          </div>
        ),
        cell: (info) => (
          <div className="w-full text-right">
            {info.getValue()?.length || "-"}
          </div>
        ),
      }),
    ],
    [t]
  )

  return {
    columns,
  }
}

const PAGE_SIZE = 4

const PriceListCustomerGroups = ({
  form,
  layout,
}: PriceListDetailsFormProps) => {
  const { register, path, setValue } = form

  /**
   * Open state, used to toggle the collapsible.
   *
   * If the form has a value for customer_groups, we
   * default to open.
   */
  const [open, setOpen] = React.useState(
    !!form.getValues(form.path("customer_groups.ids"))?.length
  )

  const { t } = useTranslation()

  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 500)

  /**
   * Table state.
   */
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({
    ...form.getValues(form.path("customer_groups.ids"))?.reduce(
      (acc, id) => ({
        ...acc,
        [id]: true,
      }),
      {}
    ),
  })
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  /**
   * Calculate the offset based on the pagination state.
   */
  const offset = React.useMemo(
    () => pagination.pageIndex * pagination.pageSize,
    [pagination.pageIndex, pagination.pageSize]
  )

  const [filters, setFilters] = React.useState<{
    created_at?: DateComparisonOperator
    updated_at?: DateComparisonOperator
  }>({})

  React.useEffect(() => {
    if (!open) {
      setFilters({})
    }
  }, [open])

  const { customer_groups, count, isLoading, isError } = useAdminCustomerGroups(
    {
      limit: PAGE_SIZE,
      offset,
      expand: "customers",
      q: debouncedQuery,
    },
    {
      keepPreviousData: true,
    }
  )

  const pageCount = React.useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = useCustomerGroupsColumns()

  const table = useReactTable({
    columns,
    data: customer_groups ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination,
    },
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    onPaginationChange: setPagination,
  })

  /**
   * Register the form field.
   */
  React.useEffect(() => {
    register(path("customer_groups.ids"))
  }, [register, path])

  /**
   * Update the form value when the row selection changes.
   *
   * The RowSelectionState will only contain the rows that are
   * selected, so we need to get the keys and set the value to
   * the array of keys.
   */
  React.useEffect(() => {
    setValue(path("customer_groups.ids"), Object.keys(rowSelection), {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, path, setValue])

  if (isLoading) {
    return (
      <div>
        <Spinner className="animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <Container>
        <div className="flex items-center gap-x-2">
          <ExclamationCircle />
          <Text className="text-ui-fg-subtle">
            {t(
              "price-list-details-form-customer-groups-error",
              "An error occurred while loading customer groups. Reload the page and try again. If the issue persists, try again later."
            )}
          </Text>
        </div>
      </Container>
    )
  }

  if (!customer_groups) {
    return (
      <Container>
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-details-form-customer-groups-no-groups",
            "No customer groups found."
          )}
        </Text>
      </Container>
    )
  }

  return (
    <div className="w-full">
      <div>
        <div className="flex items-center justify-between">
          <Heading level="h2">
            {t(
              "price-list-details-form-customer-groups-heading",
              "Customer availability"
            )}
          </Heading>
          <Switch checked={open} onCheckedChange={setOpen} />
        </div>
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-details-form-customer-groups-description",
            "Specify which customer groups the price overrides should apply for."
          )}
        </Text>
      </div>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Content>
          <div className="pt-6">
            <Container className="overflow-hidden p-0 ">
              <div
                className={clx("flex px-8 pt-6 pb-4", {
                  "items-center justify-between": layout === "focus",
                  "flex-col gap-y-4": layout === "drawer",
                })}
              >
                <Heading>
                  {t(
                    "price-list-details-form-customer-groups-content-heading",
                    "Customer Groups"
                  )}
                </Heading>
                <div
                  className={clx("flex items-center gap-x-2", {
                    "w-full": layout === "drawer",
                  })}
                >
                  <FilterMenu onClearFilters={() => setFilters({})}>
                    <FilterMenu.Content side="top">
                      <FilterMenu.DateItem
                        name="Created at"
                        value={filters.created_at}
                        onChange={(v) => {
                          setFilters((prev) => ({
                            ...prev,
                            created_at: v,
                          }))
                        }}
                      />
                      <FilterMenu.Seperator />
                      <FilterMenu.DateItem
                        name="Updated at"
                        value={filters.updated_at}
                        onChange={(v) => {
                          setFilters((prev) => ({
                            ...prev,
                            updated_at: v,
                          }))
                        }}
                      />
                    </FilterMenu.Content>
                  </FilterMenu>
                  <Input
                    className={clx({
                      "w-full": layout === "drawer",
                    })}
                    type="search"
                    placeholder={
                      t(
                        "price-list-details-form-customer-groups-search-placeholder",
                        "Search"
                      ) ?? undefined
                    }
                    size="small"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <Table>
                <Table.Header>
                  {table.getHeaderGroups().map((headerGroup) => {
                    return (
                      <Table.Row
                        key={headerGroup.id}
                        className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
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
                    <Table.Row key={row.id}>
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
              <Table.Pagination
                count={count ?? 0}
                canNextPage={table.getCanNextPage()}
                canPreviousPage={table.getCanPreviousPage()}
                nextPage={table.nextPage}
                previousPage={table.previousPage}
                pageIndex={pagination.pageIndex}
                pageCount={pageCount}
                pageSize={pagination.pageSize}
              />
            </Container>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

export { PriceListDetailsForm }
