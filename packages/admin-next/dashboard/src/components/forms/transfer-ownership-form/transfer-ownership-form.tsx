import { Customer, DraftOrder, Order } from "@medusajs/medusa"
import { Select, Text, clx } from "@medusajs/ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { debounce } from "lodash"
import { PropsWithChildren, useCallback, useEffect, useState } from "react"
import { Control, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { useCustomer } from "../../../hooks/api/customers"
import { client } from "../../../lib/client"
import { getStylizedAmount } from "../../../lib/money-amount-helpers"
import {
  getOrderFulfillmentStatus,
  getOrderPaymentStatus,
} from "../../../lib/order-helpers"
import { TransferOwnershipSchema } from "../../../lib/schemas"
import { Form } from "../../common/form"
import { Skeleton } from "../../common/skeleton"
import { Combobox } from "../../inputs/combobox"

type TransferOwnerShipFieldValues = z.infer<typeof TransferOwnershipSchema>

type TransferOwnerShipFormProps = {
  /**
   * The Order or DraftOrder to transfer ownership of.
   */
  order: Order | DraftOrder
  /**
   * React Hook Form control object.
   */
  control: Control<TransferOwnerShipFieldValues>
}

const isOrder = (order: Order | DraftOrder): order is Order => {
  return "customer" in order
}

export const TransferOwnerShipForm = ({
  order,
  control,
}: TransferOwnerShipFormProps) => {
  const { t } = useTranslation()

  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const isOrderType = isOrder(order)
  const currentOwnerId = useWatch({
    control,
    name: "current_owner_id",
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((query) => setDebouncedQuery(query), 300),
    []
  )

  useEffect(() => {
    debouncedUpdate(query)

    return () => debouncedUpdate.cancel()
  }, [query, debouncedUpdate])

  const {
    customer: owner,
    isLoading: isLoadingOwner,
    isError: isOwnerError,
    error: ownerError,
  } = useCustomer(currentOwnerId)

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["customers", debouncedQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await client.customers.list({
        q: debouncedQuery,
        limit: 10,
        offset: pageParam,
        has_account: true, // Only show customers with confirmed accounts
      })
      return res
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const moreCustomersExist =
        lastPage.count > lastPage.offset + lastPage.limit
      return moreCustomersExist ? lastPage.offset + lastPage.limit : undefined
    },
  })

  const createLabel = (customer?: Customer) => {
    if (!customer) {
      return ""
    }

    const { first_name, last_name, email } = customer

    const name = [first_name, last_name].filter(Boolean).join(" ")

    if (name) {
      return `${name} (${email})`
    }

    return email
  }

  const ownerReady = !isLoadingOwner && owner

  const options =
    data?.pages
      .map((p) =>
        p.customers.map((c) => ({
          label: createLabel(c),
          value: c.id,
        }))
      )
      .flat() || []

  if (isOwnerError) {
    throw ownerError
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <Text size="small" leading="compact" weight="plus">
          {isOrderType
            ? t("transferOwnership.details.order")
            : t("transferOwnership.details.draft")}
        </Text>
        {isOrderType ? (
          <OrderDetailsTable order={order} />
        ) : (
          <DraftOrderDetailsTable draft={order} />
        )}
      </div>
      <div className="flex flex-col gap-y-2">
        <div>
          <Text size="small" leading="compact" weight="plus">
            {t("transferOwnership.currentOwner.label")}
          </Text>
          <Text size="small" className="text-ui-fg-subtle">
            {t("transferOwnership.currentOwner.hint")}
          </Text>
        </div>
        {ownerReady ? (
          <Select defaultValue={owner.id} disabled>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={owner.id}>{createLabel(owner)}</Select.Item>
            </Select.Content>
          </Select>
        ) : (
          <Skeleton className="h-8 w-full rounded-md" />
        )}
      </div>
      <Form.Field
        control={control}
        name="new_owner_id"
        render={({ field }) => {
          return (
            <Form.Item>
              <div className="flex flex-col">
                <Form.Label>{t("transferOwnership.newOwner.label")}</Form.Label>
                <Form.Hint>{t("transferOwnership.newOwner.hint")}</Form.Hint>
              </div>
              <Form.Control>
                <Combobox
                  {...field}
                  searchValue={query}
                  onSearchValueChange={setQuery}
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  options={options}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}

const OrderDetailsTable = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  const { label: fulfillmentLabel } = getOrderFulfillmentStatus(
    t,
    order.fulfillment_status
  )

  const { label: paymentLabel } = getOrderPaymentStatus(t, order.payment_status)

  return (
    <Table>
      <Row label={t("fields.order")} value={`#${order.display_id}`} />
      <DateRow date={order.created_at} />
      <Row label={t("fields.fulfillment")} value={fulfillmentLabel} />
      <Row label={t("fields.payment")} value={paymentLabel} />
      <TotalRow total={order.total || 0} currencyCode={order.currency_code} />
    </Table>
  )
}

const DraftOrderDetailsTable = ({ draft }: { draft: DraftOrder }) => {
  const { t } = useTranslation()

  return (
    <Table>
      <Row label={t("fields.draft")} value={`#${draft.display_id}`} />
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
