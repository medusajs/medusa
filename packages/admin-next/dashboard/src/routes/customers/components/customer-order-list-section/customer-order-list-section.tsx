import { Order } from "@medusajs/medusa"
import { Container } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminOrders } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

export const CustomerOrderListSection = () => {
  const { id } = useParams()

  const { orders, isLoading, isError, error } = useAdminOrders(
    {
      customer_id: id!,
      limit: 10,
      offset: 0,
    },
    {
      enabled: !!id,
    }
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  if (!orders) {
    return <Container>No Orders</Container>
  }

  return (
    <Container>
      <div></div>
    </Container>
  )
}

const columnHelper = createColumnHelper<Order>()

const useOrderColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("display_id", {
        header: "Order",
        cell: ({ getValue }) => `#${getValue()}`,
      }),
    ],
    [t]
  )
}
