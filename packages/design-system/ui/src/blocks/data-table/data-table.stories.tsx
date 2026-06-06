import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Container } from "@/components/container"
import { PencilSquare, Trash } from "@zjedene-medusa/icons"
import { Button } from "../../components/button"
import { Heading } from "../../components/heading"
import { TooltipProvider } from "../../components/tooltip"
import { DataTable } from "./data-table"
import {
  DataTableFilteringState,
  DataTablePaginationState,
  DataTableRowSelectionState,
  DataTableSortingState,
} from "./types"
import { useDataTable } from "./use-data-table"
import { createDataTableColumnHelper } from "./utils/create-data-table-column-helper"
import { createDataTableCommandHelper } from "./utils/create-data-table-command-helper"
import { createDataTableFilterHelper } from "./utils/create-data-table-filter-helper"
import { isDateComparisonOperator } from "./utils/is-date-comparison-operator"

const meta: Meta<typeof DataTable> = {
  title: "Blocks/DataTable",
  component: DataTable,
}

export default meta

type Story = StoryObj<typeof DataTable>

type Employee = {
  id: string
  name: string
  email: string
  position: string
  age: number
  birthday: Date
  relationshipStatus: "single" | "married" | "divorced" | "widowed"
}

const generateEmployees = (count: number): Employee[] => {
  return Array.from({ length: count }, (_, i) => {
    const age = faker.number.int({ min: 18, max: 65 })
    const birthday = faker.date.birthdate({
      mode: "age",
      min: age,
      max: age,
    })

    return {
      id: i.toString(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      position: faker.person.jobTitle(),
      age,
      birthday,
      relationshipStatus: faker.helpers.arrayElement([
        "single",
        "married",
        "divorced",
        "widowed",
      ]),
    }
  })
}

const data: Employee[] = generateEmployees(100)

const usePeople = ({
  q,
  order,
  filters,
  offset,
  limit,
}: {
  q?: string
  order?: DataTableSortingState | null
  filters?: DataTableFilteringState
  offset?: number
  limit?: number
}) => {
  return React.useMemo(() => {
    let results = [...data]

    if (q) {
      results = results.filter((person) =>
        person.name.toLowerCase().includes(q.toLowerCase())
      )
    }

    if (filters && Object.keys(filters).length > 0) {
      results = results.filter((person) => {
        return Object.entries(filters).every(([key, filter]) => {
          if (!filter) return true

          const value = person[key as keyof Employee]

          if (key === "birthday") {
            if (isDateComparisonOperator(filter)) {
              if (!(value instanceof Date)) {
                return false
              }

              if (filter.$gte) {
                const compareDate = new Date(filter.$gte)
                if (value < compareDate) {
                  return false
                }
              }

              if (filter.$lte) {
                const compareDate = new Date(filter.$lte)
                if (value > compareDate) {
                  return false
                }
              }

              if (filter.$gt) {
                const compareDate = new Date(filter.$gt)
                if (value <= compareDate) {
                  return false
                }
              }

              if (filter.$lt) {
                const compareDate = new Date(filter.$lt)
                if (value >= compareDate) {
                  return false
                }
              }

              return true
            }
          }

          if (Array.isArray(filter)) {
            if (filter.length === 0) return true

            return filter.includes(value)
          }

          return filter === value
        })
      })
    }

    // Apply sorting
    if (order) {
      const key = order.id as keyof Employee
      const desc = order.desc

      results.sort((a, b) => {
        const aVal = a[key]
        const bVal = b[key]

        if (aVal instanceof Date && bVal instanceof Date) {
          return desc
            ? bVal.getTime() - aVal.getTime()
            : aVal.getTime() - bVal.getTime()
        }

        if (aVal < bVal) return desc ? 1 : -1
        if (aVal > bVal) return desc ? -1 : 1
        return 0
      })
    }

    if (offset) {
      results = results.slice(offset)
    }

    if (limit) {
      results = results.slice(0, limit)
    }

    return {
      data: results,
      count: data.length,
    }
  }, [q, order, filters, offset, limit]) // Add filters to dependencies
}

const columnHelper = createDataTableColumnHelper<Employee>()

const columns = [
  columnHelper.select(),
  columnHelper.accessor("name", {
    header: "Name",
    enableSorting: true,
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
  }),
  columnHelper.accessor("email", {
    header: "Email",
    enableSorting: true,
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
    maxSize: 200,
  }),
  columnHelper.accessor("position", {
    header: "Position",
    enableSorting: true,
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
  }),
  columnHelper.accessor("age", {
    header: "Age",
    enableSorting: true,
    sortAscLabel: "Low to High",
    sortDescLabel: "High to Low",
    sortLabel: "Age",
  }),
  columnHelper.accessor("birthday", {
    header: "Birthday",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.birthday.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      )
    },
    enableSorting: true,
    sortAscLabel: "Oldest to Youngest",
    sortDescLabel: "Youngest to Oldest",
  }),
  columnHelper.accessor("relationshipStatus", {
    header: "Relationship Status",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.relationshipStatus.charAt(0).toUpperCase() +
            row.original.relationshipStatus.slice(1)}
        </div>
      )
    },
    enableSorting: true,
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
  }),
  columnHelper.action({
    actions: (ctx) => {
      const actions = [
        [
          {
            label: "Edit",
            onClick: () => { },
            icon: <PencilSquare />,
          },
          {
            label: "Edit",
            onClick: () => { },
            icon: <PencilSquare />,
          },
          {
            label: "Edit",
            onClick: () => { },
            icon: <PencilSquare />,
          },
        ],
        [
          {
            label: "Delete",
            onClick: () => { },
            icon: <Trash />,
          },
        ],
      ]

      return actions
    },
  }),
]

const filterHelper = createDataTableFilterHelper<Employee>()

const filters = [
  filterHelper.accessor("birthday", {
    label: "Birthday",
    type: "date",
    format: "date",
    options: [
      {
        label: "18 - 25 years old",
        value: {
          $lte: new Date(
            new Date().setFullYear(new Date().getFullYear() - 18)
          ).toISOString(),
          $gte: new Date(
            new Date().setFullYear(new Date().getFullYear() - 25)
          ).toISOString(),
        },
      },
      {
        label: "26 - 35 years old",
        value: {
          $lte: new Date(
            new Date().setFullYear(new Date().getFullYear() - 26)
          ).toISOString(),
          $gte: new Date(
            new Date().setFullYear(new Date().getFullYear() - 35)
          ).toISOString(),
        },
      },
      {
        label: "36 - 45 years old",
        value: {
          $lte: new Date(
            new Date().setFullYear(new Date().getFullYear() - 36)
          ).toISOString(),
          $gte: new Date(
            new Date().setFullYear(new Date().getFullYear() - 45)
          ).toISOString(),
        },
      },
      {
        label: "46 - 55 years old",
        value: {
          $lte: new Date(
            new Date().setFullYear(new Date().getFullYear() - 46)
          ).toISOString(),
          $gte: new Date(
            new Date().setFullYear(new Date().getFullYear() - 55)
          ).toISOString(),
        },
      },
      {
        label: "Over 55 years old",
        value: {
          $lt: new Date(
            new Date().setFullYear(new Date().getFullYear() - 55)
          ).toISOString(),
        },
      },
    ],
  }),
  filterHelper.accessor("relationshipStatus", {
    label: "Relationship Status",
    type: "select",
    options: [
      { label: "Single", value: "single" },
      { label: "Married", value: "married" },
      { label: "Divorced", value: "divorced" },
      { label: "Widowed", value: "widowed" },
    ],
  }),
]

const commandHelper = createDataTableCommandHelper()

const commands = [
  commandHelper.command({
    label: "Archive",
    action: (selection) => {
      alert(`Archive ${Object.keys(selection).length} items`)
    },
    shortcut: "A",
  }),
  commandHelper.command({
    label: "Delete",
    action: (selection) => {
      alert(`Delete ${Object.keys(selection).length} items`)
    },
    shortcut: "D",
  }),
]

const KitchenSinkDemo = () => {
  const [search, setSearch] = React.useState("")

  const [rowSelection, setRowSelection] =
    React.useState<DataTableRowSelectionState>({})
  const [sorting, setSorting] = React.useState<DataTableSortingState | null>(
    null
  )
  const [filtering, setFiltering] = React.useState<DataTableFilteringState>({
    birthday: {
      $gte: new Date(
        new Date().setFullYear(new Date().getFullYear() - 18)
      ).toISOString(),
    },
  })

  const handleFilteringChange = (
    state: DataTableFilteringState,
  ) => {
    console.log("Filtering changed:", state)
    setFiltering(state)
  }

  const [pagination, setPagination] = React.useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, count } = usePeople({
    q: search,
    order: sorting,
    filters: filtering,
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
  })

  const table = useDataTable({
    data,
    columns,
    filters,
    commands,
    rowCount: count,
    getRowId: (row) => row.id,
    onRowClick: (_event, row) => {
      alert(`Navigate to ${row.id}`)
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    filtering: {
      state: filtering,
      onFilteringChange: handleFilteringChange,
    },
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
      enableRowSelection: (row) => Number(row.original.id) > 4,
    },
    sorting: {
      state: sorting,
      onSortingChange: setSorting,
    },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  return (
    <TooltipProvider>
      <Container className="flex flex-col overflow-hidden p-0">
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <Heading>Employees</Heading>
            <div className="flex w-full items-center gap-2 md:w-auto">
              <DataTable.Search placeholder="Search" autoFocus />
              <DataTable.FilterMenu tooltip="Filter" />
              <DataTable.SortingMenu tooltip="Sort" />
              <Button size="small" variant="secondary">
                Create
              </Button>
            </div>
          </DataTable.Toolbar>
          <DataTable.Table
            emptyState={{
              empty: {
                heading: "No employees",
                description: "There are no employees to display.",
              },
              filtered: {
                heading: "No results",
                description:
                  "No employees match the current filter criteria. Try adjusting your filters.",
              },
            }}
          />
          <DataTable.Pagination />
          <DataTable.CommandBar
            selectedLabel={(count) => `${count} selected`}
          />
        </DataTable>
      </Container>
    </TooltipProvider>
  )
}

export const KitchenSink: Story = {
  render: () => <KitchenSinkDemo />,
}
