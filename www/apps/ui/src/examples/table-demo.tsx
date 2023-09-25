import { Table } from "@medusajs/ui"

type Order = {
  id: string
  displayId: number
  customer: string
  email: string
  amount: number
  currency: string
}

const fakeData: Order[] = [
  {
    id: "order_6782",
    displayId: 86078,
    customer: "Jill Miller",
    email: "32690@gmail.com",
    amount: 493,
    currency: "EUR",
  },
  {
    id: "order_46487",
    displayId: 42845,
    customer: "Sarah Garcia",
    email: "86379@gmail.com",
    amount: 113,
    currency: "JPY",
  },
  {
    id: "order_8169",
    displayId: 39129,
    customer: "Josef Smith",
    email: "89383@gmail.com",
    amount: 43,
    currency: "USD",
  },
  {
    id: "order_67883",
    displayId: 5548,
    customer: "Elvis Jones",
    email: "52860@gmail.com",
    amount: 840,
    currency: "GBP",
  },
  {
    id: "order_61121",
    displayId: 87668,
    customer: "Charles Rodriguez",
    email: "45675@gmail.com",
    amount: 304,
    currency: "GBP",
  },
]

export default function TableDemo() {
  return (
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
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: order.currency,
                }).format(order.amount)}
              </Table.Cell>
              <Table.Cell className="text-ui-fg-muted">
                {order.currency}
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}
