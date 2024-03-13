import { DraftOrder, Order } from "@medusajs/medusa"
import { Select, Text, clx } from "@medusajs/ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react"
import { Control } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { useMedusa } from "medusa-react"
import { getStylizedAmount } from "../../../lib/money-amount-helpers"
import { Combobox } from "../../common/combobox"

type TransferOwnerShipFormProps = {
  /**
   * The Order or DraftOrder to transfer ownership of.
   */
  order: Order | DraftOrder
  /**
   * ID of the customer that is the current owner of the order.
   */
  currentOwner?: string
  /**
   * React Hook Form control object.
   */
  control: Control<{ customer_id: string }>
}

const isOrder = (order: Order | DraftOrder): order is Order => {
  return "customer" in order
}

export const TransferOwnerShipForm = ({
  order,
  currentOwner,
}: TransferOwnerShipFormProps) => {
  //   const {
  //     customer: owner,
  //     isLoading: isLoadingOwner,
  //     isError: isOwnerError,
  //     error: ownerError,
  //   } = useAdminCustomer(currentOwner)

  const isOrderType = isOrder(order)

  //   if (!isOwnerError) {
  //     throw ownerError
  //   }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <Text size="small" leading="compact">
          {isOrderType ? "Order details" : "Draft order details"}
        </Text>
        {isOrderType ? (
          <OrderDetailsTable order={order} />
        ) : (
          <DraftOrderDetailsTable draft={order} />
        )}
      </div>
      <div className="flex flex-col gap-y-2">
        <div>
          <Text size="small" leading="compact">
            Current owner
          </Text>
          <Text size="small" className="text-ui-fg-subtle">
            The customer currently related to this order
          </Text>
        </div>
        <Select defaultValue="kasper@medusajs.com" disabled>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="kasper@medusajs.com">
              Kasper Kristensen (kasper@medusajs.com)
            </Select.Item>
          </Select.Content>
        </Select>
      </div>
      <div className="flex flex-col gap-y-2">
        <div>
          <Text size="small" leading="compact">
            New owner
          </Text>
          <Text size="small" className="text-ui-fg-subtle">
            The customer currently related to this order
          </Text>
        </div>
        <CustomersList />
      </div>
    </div>
  )
}

const OrderDetailsTable = ({ order }: { order: Order }) => {
  return (
    <Table>
      <div>Order</div>
      <div>#{order.display_id}</div>
      <DateRow date={order.created_at} />
    </Table>
  )
}

const DraftOrderDetailsTable = ({ draft }: { draft: DraftOrder }) => {
  const { t } = useTranslation()

  return (
    <Table>
      <Row label={"Draft"} value={`#${draft.display_id}`} />
      <DateRow date={draft.created_at} />
      <Row
        label={t("fields.status")}
        value={t(`draftOrders.status.${draft.status}`)}
      />
      <TotalRow
        total={draft.cart.total || 0}
        currencyCode={draft.cart.region.currency_code}
      />
    </Table>
  )
}

const DateRow = ({ date }: { date: string | Date }) => {
  const { t } = useTranslation()

  const formattedDate = format(new Date(date), "dd MMM yyyy")

  return <Row label={t("fields.date")} value={formattedDate} />
}

const TotalRow = ({
  total,
  currencyCode,
}: {
  total: number
  currencyCode: string
}) => {
  return <Row label="Total" value={getStylizedAmount(total, currencyCode)} />
}

const Row = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="txt-compact-small grid grid-cols-2 divide-x">
      <div className="text-ui-fg-muted px-2 py-1.5">{label}</div>
      <div className="text-ui-fg-subtle px-2 py-1.5">{value}</div>
    </div>
  )
}

const Table = ({ children }: PropsWithChildren) => {
  return <div className={clx("divide-y rounded-lg border")}>{children}</div>
}

function CustomersList() {
  const [searchTerm, setSearchTerm] = useState("")

  const { client } = useMedusa()

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ["customers", searchTerm],
    async ({ pageParam = 0 }) => {
      const res = await client.admin.customers.list({
        q: searchTerm,
        limit: 10,
        offset: pageParam,
      })
      return res
    },
    {
      getNextPageParam: (lastPage) => {
        // Check if there are more customers to load
        const moreCustomersExist =
          lastPage.count > lastPage.offset + lastPage.limit
        return moreCustomersExist ? lastPage.offset + lastPage.limit : undefined
      },
    }
  )

  // Search input handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Observer for the infinite scrolling
  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          fetchNextPage()
        }
      },
      { threshold: 1 }
    )
  )

  const lastCustomerRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) {
        return
      }
      if (observer.current) {
        observer.current.disconnect()
      }
      if (node) {
        observer.current.observe(node)
      }
    },
    [isFetchingNextPage]
  )

  // Render the search bar and the customer list
  return (
    <div>
      <Combobox
        searchValue={searchTerm}
        onSearchValueChange={setSearchTerm}
        options={
          data?.pages
            .map((p) =>
              p.customers.map((c) => ({
                label: `${c.first_name} ${c.last_name}`,
                value: c.id,
              }))
            )
            .flat() || []
        }
      />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search customers"
      />
      <div className="bg-ui-bg-subtle h-[400px] overflow-auto">
        {status === "loading" && <div>Loading...</div>}
        {status === "error" && <div>Error: {error.message}</div>}
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.customers.map((customer) => (
              <div key={customer.id}>
                {customer.first_name} {customer.last_name}
              </div>
            ))}
          </Fragment>
        ))}
        <div>
          {isFetchingNextPage ? (
            <div>Loading more...</div>
          ) : (
            hasNextPage && <div ref={lastCustomerRef}>Load More</div>
          )}
        </div>
      </div>
    </div>
  )
}
