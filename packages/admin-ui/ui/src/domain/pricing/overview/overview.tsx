import {
  EllipseGreenSolid,
  EllipseGreySolid,
  EllipsisHorizontal,
  ExclamationCircle,
  PencilSquare,
  Spinner,
  Trash,
} from "@medusajs/icons"
import { DateComparisonOperator, PriceList } from "@medusajs/medusa"
import {
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
  StatusBadge,
  Table,
  Text,
  clx,
  usePrompt,
} from "@medusajs/ui"
import {
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useAdminDeletePriceList,
  useAdminPriceLists,
  useAdminUpdatePriceList,
} from "medusa-react"
import * as React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import Spacer from "../../../components/atoms/spacer"
import WidgetContainer from "../../../components/extensions/widget-container"
import { FilterMenu } from "../../../components/molecules/filter-menu"
import { useDebouncedSearchParam } from "../../../hooks/use-debounced-search-param"
import useNotification from "../../../hooks/use-notification"
import { useWidgets } from "../../../providers/widget-provider"
import { getErrorMessage } from "../../../utils/error-messages"
import {
  getDateComparisonOperatorFromSearchParams,
  getStringArrayFromSearchParams,
  getStringFromSearchParams,
} from "../../../utils/search-param-utils"
import { PriceListStatus } from "../forms/price-list-details-form"
import { PriceListNew } from "../new"

const PAGE_SIZE = 10
const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48

const PriceListTableFilters = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const onStatusChange = (status: string[]) => {
    const current = new URLSearchParams(searchParams)

    if (status.length === 0) {
      current.delete("status")
      navigate({ search: current.toString() }, { replace: true })

      return
    }

    if (current.has("status")) {
      current.delete("status")
    }

    current.set("status", status.join(","))
    navigate({ search: current.toString() }, { replace: true })
  }

  const onDateChange = (
    key: "updated_at" | "created_at",
    value?: DateComparisonOperator
  ) => {
    const current = new URLSearchParams(searchParams)

    if (value) {
      current.set(key, JSON.stringify(value))
    } else {
      current.delete(key)
    }

    navigate({ search: current.toString() }, { replace: true })
  }

  const onClearFilters = () => {
    const reset = new URLSearchParams()

    navigate({ search: reset.toString() }, { replace: true })
  }

  return (
    <FilterMenu onClearFilters={onClearFilters}>
      <FilterMenu.Content>
        <FilterMenu.SelectItem
          name="Status"
          onChange={onStatusChange}
          options={[
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
          ]}
          value={getStringArrayFromSearchParams("status", searchParams)}
        />
        <FilterMenu.Seperator />
        <FilterMenu.DateItem
          name="Created at"
          value={getDateComparisonOperatorFromSearchParams(
            "created_at",
            searchParams
          )}
          onChange={(dc) => onDateChange("created_at", dc)}
        />
        <FilterMenu.Seperator />
        <FilterMenu.DateItem
          name="Updated at"
          value={getDateComparisonOperatorFromSearchParams(
            "updated_at",
            searchParams
          )}
          onChange={(dc) => onDateChange("updated_at", dc)}
        />
      </FilterMenu.Content>
    </FilterMenu>
  )
}

const PriceListOverview = () => {
  const { getWidgets } = useWidgets()

  const [searchParams] = useSearchParams()

  const { query, setQuery } = useDebouncedSearchParam()
  const navigate = useNavigate()

  const { price_lists, count, isLoading, isError } = useAdminPriceLists(
    {
      limit: PAGE_SIZE,
      status: getStringArrayFromSearchParams("status", searchParams) as
        | PriceListStatus[]
        | undefined,
      created_at: getDateComparisonOperatorFromSearchParams(
        "created_at",
        searchParams
      ),
      updated_at: getDateComparisonOperatorFromSearchParams(
        "updated_at",
        searchParams
      ),
      q: getStringFromSearchParams("q", searchParams),
      expand: "customer_groups",
    },
    {
      keepPreviousData: true,
    }
  )

  const table = useReactTable<PriceList>({
    data: price_lists ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) {
    return (
      <Container
        style={{
          height: TABLE_HEIGHT + 143, // Table height + header height + pagination height
        }}
        className="flex items-center justify-center"
      >
        <Spinner className="text-ui-fg-subtle animate-spin" />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container
        style={{
          height: TABLE_HEIGHT + 143, // Table height + header height + pagination height
        }}
        className="flex items-center justify-center"
      >
        <div className="flex items-center gap-x-2">
          <ExclamationCircle className="text-ui-fg-base" />
          <Text className="text-ui-fg-subtle">
            An error occurred while loading the price lists. Try to reload the
            page or try again later.
          </Text>
        </div>
      </Container>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-y-2">
        {getWidgets("price_list.list.before").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              injectionZone={"price_list.list.before"}
              widget={w}
              entity={undefined}
            />
          )
        })}
        <Container className="overflow-hidden p-0">
          <div className="flex items-center justify-between px-8 pt-6 pb-4">
            <Heading>Price Lists</Heading>
            <div className="flex items-center gap-x-2">
              <PriceListTableFilters />
              <Input
                size="small"
                type="search"
                placeholder="Search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                }}
              />
              <PriceListNew />
            </div>
          </div>
          <div
            style={{
              height: TABLE_HEIGHT,
            }}
          >
            <Table>
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <Table.Row
                      key={headerGroup.id}
                      className="[&_th]:w-1/5 [&_th:last-of-type]:w-[1%]"
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
                    className={clx("cursor-pointer [&_td:last-of-type]:w-[1%]")}
                    onClick={() => {
                      navigate(`/a/pricing/${row.original.id}`)
                    }}
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
          <Table.Pagination
            className={clx({
              "border-ui-border-base border-t":
                price_lists?.length !== PAGE_SIZE,
            })}
            count={count ?? 0}
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            pageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            pageSize={PAGE_SIZE}
          />
        </Container>
        {getWidgets("price_list.list.after").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              injectionZone={"price_list.list.after"}
              widget={w}
              entity={undefined}
            />
          )
        })}
      </div>
      <Spacer />
    </div>
  )
}

const columnHelper = createColumnHelper<PriceList>()

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => (
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue, row }) => {
      const startsAt = row.original.starts_at
      const endsAt = row.original.ends_at

      const isExpired = endsAt ? new Date(endsAt) < new Date() : false
      const isScheduled = startsAt ? new Date(startsAt) > new Date() : false
      const isDraft = getValue() === PriceListStatus.DRAFT

      const color = isExpired
        ? "red"
        : isDraft
        ? "grey"
        : isScheduled
        ? "orange"
        : "green"

      const text = isExpired
        ? "Expired"
        : isDraft
        ? "Draft"
        : isScheduled
        ? "Scheduled"
        : "Active"

      return (
        <StatusBadge color={color}>
          <span className="capitalize">{text}</span>
        </StatusBadge>
      )
    },
  }),
  columnHelper.accessor("customer_groups", {
    header: "Customer Groups",
    cell: (info) => info.getValue()?.length || "-",
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => {
      return <PriceListTableRowActions row={info.row} />
    },
  }),
]

type PriceListTableRowActionsProps = {
  row: Row<PriceList>
}

const PriceListTableRowActions = ({ row }: PriceListTableRowActionsProps) => {
  const { mutateAsync: deleteFn } = useAdminDeletePriceList(row.original.id)
  const { mutateAsync: updateFn } = useAdminUpdatePriceList(row.original.id)

  const prompt = usePrompt()
  const notification = useNotification()

  const navigate = useNavigate()

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()

    const response = await prompt({
      title: "Are you sure?",
      description: "This will permanently delete the price list",
      verificationText: row.original.name,
    })

    if (!response) {
      return
    }

    return deleteFn(undefined, {
      onSuccess: () => {
        notification(
          "Price list deleted",
          `Successfully deleted ${row.original.name}`,
          "success"
        )
      },
      onError: (err) => {
        notification("An error occurred", getErrorMessage(err), "error")
      },
    })
  }

  const toggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation()

    return updateFn(
      {
        status:
          row.original.status === "active"
            ? PriceListStatus.DRAFT
            : PriceListStatus.ACTIVE,
      },
      {
        onSuccess: () => {
          notification(
            "Price list updated",
            `Successfully updated ${row.original.name}`,
            "success"
          )
        },
        onError: (err) => {
          notification("An error occurred", getErrorMessage(err), "error")
        },
      }
    )
  }

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation()

    navigate(`/a/pricing/${row.original.id}`)
  }

  const isExpired = row.original.ends_at
    ? new Date(row.original.ends_at) < new Date()
    : false

  const isActive = row.original.status === "active"

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal className="text-ui-fg-subtle" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleNavigate}>
          <PencilSquare className="text-ui-fg-subtle" />
          <span className="ml-2">Edit</span>
        </DropdownMenu.Item>
        {!isExpired && (
          <DropdownMenu.Item onClick={toggleStatus}>
            {isActive ? <EllipseGreySolid /> : <EllipseGreenSolid />}
            <span className="ml-2">
              {isActive ? "Mark as draft" : "Mark as active"}
            </span>
          </DropdownMenu.Item>
        )}
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleDelete}>
          <Trash className="text-ui-fg-subtle" />
          <span className="ml-2">Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export { PriceListOverview }
