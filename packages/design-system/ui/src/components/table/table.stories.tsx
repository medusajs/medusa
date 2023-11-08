import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Table } from "./table"

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Table>

type Order = {
  id: string
  displayId: number
  customer: string
  email: string
  amount: number
  currency: string
}

const firstNames = [
  "Charles",
  "Cooper",
  "Johhny",
  "Elvis",
  "John",
  "Jane",
  "Joe",
  "Jack",
  "Jill",
  "Jenny",
]
const lastNames = [
  "Brown",
  "Smith",
  "Johnson",
  "Williams",
  "Jones",
  "Miller",
  "Davis",
  "Garcia",
  "Rodriguez",
  "Wilson",
]
const currencies = ["USD", "EUR", "GBP", "JPY"]

function makeDate(x: number): Order[] {
  // get random name
  const getRandomName = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    return `${firstName} ${lastName}`
  }

  const getRandomId = () => {
    return `order_${Math.floor(Math.random() * 100000)}`
  }

  const getRandomDisplayId = () => {
    return Math.floor(Math.random() * 100000)
  }

  const getRandomAmount = () => {
    return Math.floor(Math.random() * 1000)
  }

  const getRandomCurrency = () => {
    return currencies[Math.floor(Math.random() * currencies.length)]
  }

  const getRandomEmail = () => {
    return `${Math.floor(Math.random() * 100000)}@gmail.com`
  }

  // Create x random orders and resolve them after 1 second
  const orders = Array.from({ length: x }, () => ({
    id: getRandomId(),
    displayId: getRandomDisplayId(),
    customer: getRandomName(),
    email: getRandomEmail(),
    amount: getRandomAmount(),
    currency: getRandomCurrency(),
  }))

  return orders
}

type UseFakeOrdersProps = {
  limit: number
  offset: number
}

const useFakeOrders = ({ offset, limit }: UseFakeOrdersProps) => {
  const COUNT = 1000

  const [orders, setOrders] = React.useState<Order[]>(makeDate(limit))
  const [offsetState, setOffsetState] = React.useState<number | undefined>(0)
  const [isLoading, setIsLoading] = React.useState(false)

  // Fake API call
  React.useEffect(() => {
    const fetchOrders = async () => {
      if (offset === offsetState) {
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      if (offset > COUNT) {
        return
      }

      const newOrders = makeDate(limit)

      setOrders(newOrders)

      setOffsetState(offset)
    }

    setIsLoading(true)

    fetchOrders().then(() => {
      setIsLoading(false)
    })
  }, [offset, limit, orders, offsetState])

  return {
    orders,
    isLoading,
    count: COUNT,
  }
}

const fakeData = makeDate(10)

console.log(JSON.stringify(fakeData, null, 2))

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    signDisplay: "always",
  }).format(amount)
}

export const Default: Story = {
  render: () => {
    return (
      <div className="flex w-[80vw] items-center justify-center">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Amount</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {fakeData.map((order) => {
              return (
                <Table.Row
                  key={order.id}
                  className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                >
                  <Table.Cell>{order.displayId}</Table.Cell>
                  <Table.Cell>{order.customer}</Table.Cell>
                  <Table.Cell>{order.email}</Table.Cell>
                  <Table.Cell className="text-right">
                    {formatCurrency(order.amount, order.currency)}
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-muted">
                    {order.currency}
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    )
  },
}

const PaginatedDemo = () => {
  const [pageIndex, setPageIndex] = React.useState(0)
  const pageSize = 10

  const { orders, isLoading, count } = useFakeOrders({
    offset: pageIndex * pageSize,
    limit: pageSize,
  })

  const pageCount = Math.ceil(count / pageSize)

  const canNextPage = pageIndex < pageCount - 1 && !isLoading
  const canPreviousPage = pageIndex > 0 && !isLoading

  const nextPage = () => {
    if (canNextPage) {
      setPageIndex(pageIndex + 1)
    }
  }

  const previousPage = () => {
    if (canPreviousPage) {
      setPageIndex(pageIndex - 1)
    }
  }

  return (
    <div className="flex w-[80vw] flex-col items-center justify-center">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Amount</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => {
            return (
              <Table.Row
                key={order.id}
                className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
              >
                <Table.Cell>{order.displayId}</Table.Cell>
                <Table.Cell>{order.customer}</Table.Cell>
                <Table.Cell>{order.email}</Table.Cell>
                <Table.Cell className="text-right">{order.amount}</Table.Cell>
                <Table.Cell className="text-ui-fg-muted">
                  {order.currency}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      <Table.Pagination
        pageCount={pageCount}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        count={count}
        pageSize={pageSize}
        pageIndex={pageIndex}
        nextPage={nextPage}
        previousPage={previousPage}
      />
      <div className="mt-12 flex flex-col items-center gap-y-4 font-mono text-xs">
        <div className="flex items-center gap-x-4">
          <p>Page Index: {pageIndex}</p>
          <p>Page Count: {pageCount}</p>
          <p>Count: {count}</p>
          <p>Page Size: {pageSize}</p>
        </div>
        <div className="flex items-center gap-x-4">
          <p>Can Next Page: {canNextPage ? "true" : "false"}</p>
          <p>Can Previous Page: {canPreviousPage ? "true" : "false"}</p>
          <p>Is Loading: {isLoading ? "true" : "false"}</p>
        </div>
      </div>
    </div>
  )
}

export const Paginated: Story = {
  render: () => {
    return <PaginatedDemo />
  },
}
