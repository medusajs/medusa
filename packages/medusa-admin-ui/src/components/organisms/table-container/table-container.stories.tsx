import React, { useEffect, useState } from "react"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import TableContainer from "."
import { random } from "lodash"
import { Column, useTable } from "react-table"
import Table from "../../molecules/table"
import { Title } from "@radix-ui/react-dialog"
import clsx from "clsx"
import Button from "../../fundamentals/button"

type TestObject = {
  id: string
  name: string
  date: Date
  result: boolean
}

const LIMIT = 12

const generateRandomData = () => {
  const data: TestObject[] = []
  for (let i = 0; i < LIMIT; i++) {
    data.push({
      id: `test_${random(100, 999)}`,
      name: (Math.random() + 1).toString(36).substring(7),
      date: new Date(),
      result: Math.random() < 0.5,
    })
  }
  return data
}

const useTestData = ({ offset }: { offset: number }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<TestObject[] | undefined>(undefined)
  const [count, setCount] = useState<number | undefined>(undefined)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setData(generateRandomData())
      setCount(100)
      setIsLoading(false)
    }, 3000)
  }, [offset])

  return { data, isLoading, count }
}

const columns: Column<TestObject>[] = [
  {
    Header: "ID",
    accessor: "id",
    Cell: ({ value }) => <div>{value}</div>,
  },
  {
    Header: "Name",
    accessor: "name",
    Cell: ({ value }) => <div>{value}</div>,
  },
  {
    Header: "Date",
    accessor: "date",
    Cell: ({ value }) => (
      <div className="text-grey-50">{value.toLocaleDateString()}</div>
    ),
  },
  {
    Header: "Result",
    accessor: "result",
    Cell: ({ value }) => (
      <div
        className={clsx("text-rose-50", {
          "text-emerald-50": value,
        })}
      >
        {value ? "Success" : "Failure"}
      </div>
    ),
  },
]

export default {
  title: "Organisms/TableContainer",
  component: TableContainer,
} as ComponentMeta<typeof TableContainer>

const Template: ComponentStory<typeof TableContainer> = (args) => {
  const [offset, setOffset] = useState(0)
  const { data, isLoading, count } = useTestData({ offset })

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    canNextPage,
    canPreviousPage,
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable({
    data: data || [],
    columns: columns,
    manualPagination: true,
    pageCount: Math.ceil((count || 0) / LIMIT),
    autoResetPage: false,
    initialState: {
      pageSize: LIMIT,
      pageIndex: offset / LIMIT,
    },
  })

  const handleNext = () => {
    if (canNextPage) {
      setOffset((pageIndex + 1) * LIMIT)
      nextPage()
    }
  }

  const handlePrevious = () => {
    if (canPreviousPage) {
      setOffset((pageIndex - 1) * LIMIT)
      previousPage()
    }
  }

  return (
    <div>
      <div>
        <TableContainer
          {...args}
          numberOfRows={LIMIT}
          isLoading={isLoading}
          pagingState={{
            count: count || 0,
            offset,
            currentPage: pageIndex + 1,
            hasNext: canNextPage,
            hasPrev: canPreviousPage,
            pageSize: LIMIT,
            pageCount: pageCount,
            prevPage: handlePrevious,
            nextPage: handleNext,
            title: "Test",
          }}
        >
          <Table {...getTableProps}>
            <Table.Head>
              {headerGroups.map((headerGroup) => {
                return (
                  <Table.Row {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => {
                      return (
                        <Table.HeadCell {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </Table.HeadCell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Head>
            <Table.Body {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row)
                return (
                  <Table.Row {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <Table.Cell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </TableContainer>
      </div>

      <div className="flex items-start justify-between mt-xlarge">
        <Button
          className="mt-base"
          variant="secondary"
          size="small"
          onClick={() => setOffset(random(0, 10))}
        >
          Reload
        </Button>
        <p className="inter-small-regular text-grey-50 inline-block max-w-[440px]">
          Note that React Table does not work in storybook. Because of this
          pagination does not work in this example, you should instead use the
          reload button to simulate pagination.
        </p>
      </div>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  hasPagination: true,
}
