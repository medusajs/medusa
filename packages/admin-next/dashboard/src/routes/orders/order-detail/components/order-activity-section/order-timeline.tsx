import { IconButton, Text, Tooltip, clx, usePrompt } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"

import { PropsWithChildren, ReactNode, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { XMarkMini } from "@medusajs/icons"
import { AdminFulfillment, AdminOrder, AdminReturn } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import { useDate } from "../../../../../hooks/use-date"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { useReturns } from "../../../../../hooks/api/returns"

type OrderTimelineProps = {
  order: AdminOrder
}

/**
 * Arbitrary high limit to ensure all notes are fetched
 */
const NOTE_LIMIT = 9999

export const OrderTimeline = ({ order }: OrderTimelineProps) => {
  const items = useActivityItems(order)

  if (items.length <= 3) {
    return (
      <div className="flex flex-col gap-y-0.5">
        {items.map((item, index) => {
          return (
            <OrderActivityItem
              key={index}
              title={item.title}
              timestamp={item.timestamp}
              isFirst={index === items.length - 1}
            >
              {item.children}
            </OrderActivityItem>
          )
        })}
      </div>
    )
  }

  const lastItems = items.slice(0, 2)
  const collapsibleItems = items.slice(2, items.length - 1)
  const firstItem = items[items.length - 1]

  return (
    <div className="flex flex-col gap-y-0.5">
      {lastItems.map((item, index) => {
        return (
          <OrderActivityItem
            key={index}
            title={item.title}
            timestamp={item.timestamp}
          >
            {item.children}
          </OrderActivityItem>
        )
      })}
      <OrderActivityCollapsible activities={collapsibleItems} />
      <OrderActivityItem
        title={firstItem.title}
        timestamp={firstItem.timestamp}
        isFirst
      >
        {firstItem.children}
      </OrderActivityItem>
    </div>
  )
}

type Activity = {
  title: string
  timestamp: string | Date
  children?: ReactNode
}

const useActivityItems = (order: AdminOrder) => {
  const { t } = useTranslation()

  const { returns = [] } = useReturns({ order_id: order.id, fields: "*items" })

  const notes = []
  const isLoading = false
  // const { notes, isLoading, isError, error } = useNotes(
  //   {
  //     resource_id: order.id,
  //     limit: NOTE_LIMIT,
  //     offset: 0,
  //   },
  //   {
  //     keepPreviousData: true,
  //   }
  // )
  //
  // if (isError) {
  //   throw error
  // }

  return useMemo(() => {
    if (isLoading) {
      return []
    }

    const items: Activity[] = []

    // for (const payment of order.payments) {
    //   items.push({
    //     title: t("orders.activity.events.payment.awaiting"),
    //     timestamp: payment.created_at,
    //     children: (
    //       <Text size="small" className="text-ui-fg-subtle">
    //         {getStylizedAmount(payment.amount, payment.currency_code)}
    //       </Text>
    //     ),
    //   })
    //
    //   if (payment.canceled_at) {
    //     items.push({
    //       title: t("orders.activity.events.payment.canceled"),
    //       timestamp: payment.canceled_at,
    //       children: (
    //         <Text size="small" className="text-ui-fg-subtle">
    //           {getStylizedAmount(payment.amount, payment.currency_code)}
    //         </Text>
    //       ),
    //     })
    //   }
    //
    //   if (payment.captured_at) {
    //     items.push({
    //       title: t("orders.activity.events.payment.captured"),
    //       timestamp: payment.captured_at,
    //       children: (
    //         <Text size="small" className="text-ui-fg-subtle">
    //           {getStylizedAmount(payment.amount, payment.currency_code)}
    //         </Text>
    //       ),
    //     })
    //   }
    // }

    for (const fulfillment of order.fulfillments) {
      items.push({
        title: t("orders.activity.events.fulfillment.created"),
        timestamp: fulfillment.created_at,
        children: <FulfillmentCreatedBody fulfillment={fulfillment} />,
      })

      if (fulfillment.shipped_at) {
        items.push({
          title: t("orders.activity.events.fulfillment.shipped"),
          timestamp: fulfillment.shipped_at,
          children: (
            <FulfillmentCreatedBody fulfillment={fulfillment} isShipment />
          ),
        })
      }

      if (fulfillment.canceled_at) {
        items.push({
          title: t("orders.activity.events.fulfillment.canceled"),
          timestamp: fulfillment.canceled_at,
        })
      }
    }

    for (const ret of returns) {
      if (ret.status === "requested") {
        items.push({
          title: t("orders.activity.events.return.created"),
          timestamp: ret.created_at,
          children: <ReturnBody orderReturn={ret} />,
        })
      }
      if (ret.status === "received" || ret.status === "partially_received") {
        items.push({
          title: t("orders.activity.events.return.received"),
          timestamp: ret.received_at,
          children: <ReturnBody orderReturn={ret} />,
        })
      }
    }

    // for (const note of notes || []) {
    //   items.push({
    //     title: t("orders.activity.events.note.comment"),
    //     timestamp: note.created_at,
    //     children: <NoteBody note={note} />,
    //   })
    // }

    if (order.canceled_at) {
      items.push({
        title: t("orders.activity.events.canceled.title"),
        timestamp: order.canceled_at,
      })
    }

    const sortedActivities = items.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    const createdAt = {
      title: t("orders.activity.events.placed.title"),
      timestamp: order.created_at,
      children: (
        <Text size="small" className="text-ui-fg-subtle">
          {getStylizedAmount(order.total, order.currency_code)}
        </Text>
      ),
    }

    return [...sortedActivities, createdAt]
  }, [order, notes, isLoading, t])
}

type OrderActivityItemProps = PropsWithChildren<{
  title: string
  timestamp: string | Date
  isFirst?: boolean
}>

const OrderActivityItem = ({
  title,
  timestamp,
  isFirst = false,
  children,
}: OrderActivityItemProps) => {
  const { getFullDate, getRelativeDate } = useDate()

  return (
    <div className="grid grid-cols-[20px_1fr] items-start gap-2">
      <div className="flex size-full flex-col items-center gap-y-0.5">
        <div className="flex size-5 items-center justify-center">
          <div className="bg-ui-bg-base shadow-borders-base flex size-2.5 items-center justify-center rounded-full">
            <div className="bg-ui-tag-neutral-icon size-1.5 rounded-full" />
          </div>
        </div>
        {!isFirst && <div className="bg-ui-border-base w-px flex-1" />}
      </div>
      <div
        className={clx({
          "pb-4": !isFirst,
        })}
      >
        <div className="flex items-center justify-between">
          <Text size="small" leading="compact" weight="plus">
            {title}
          </Text>
          <Tooltip
            content={getFullDate({ date: timestamp, includeTime: true })}
          >
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {getRelativeDate(timestamp)}
            </Text>
          </Tooltip>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

const OrderActivityCollapsible = ({
  activities,
}: {
  activities: Activity[]
}) => {
  const [open, setOpen] = useState(false)

  const { t } = useTranslation()

  if (!activities.length) {
    return null
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      {!open && (
        <div className="grid grid-cols-[20px_1fr] items-start gap-2">
          <div className="flex size-full flex-col items-center">
            <div className="border-ui-border-strong w-px flex-1 bg-[linear-gradient(var(--border-strong)_33%,rgba(255,255,255,0)_0%)] bg-[length:1px_3px] bg-right bg-repeat-y" />
          </div>
          <div className="pb-4">
            <Collapsible.Trigger className="text-left">
              <Text
                size="small"
                leading="compact"
                weight="plus"
                className="text-ui-fg-muted"
              >
                {t("orders.activity.showMoreActivities", {
                  count: activities.length,
                })}
              </Text>
            </Collapsible.Trigger>
          </div>
        </div>
      )}
      <Collapsible.Content>
        <div className="flex flex-col gap-y-0.5">
          {activities.map((item, index) => {
            return (
              <OrderActivityItem
                key={index}
                title={item.title}
                timestamp={item.timestamp}
              >
                {item.children}
              </OrderActivityItem>
            )
          })}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

const NoteBody = ({ note }: { note: Note }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { first_name, last_name, email } = note.author || {}
  const name = [first_name, last_name].filter(Boolean).join(" ")

  const byLine = t("orders.activity.events.note.byLine", {
    author: name || email,
  })

  const { mutateAsync } = {} // useAdminDeleteNote(note.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: "This action cannot be undone",
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <div className="flex flex-col gap-y-2 pt-2">
      <div className="bg-ui-bg-component shadow-borders-base group grid grid-cols-[1fr_20px] items-start gap-x-2 text-pretty rounded-r-2xl rounded-bl-md rounded-tl-xl px-3 py-1.5">
        <div className="flex h-full min-h-7 items-center">
          <Text size="xsmall" className="text-ui-fg-subtle">
            {note.value}
          </Text>
        </div>
        <IconButton
          size="small"
          variant="transparent"
          className="transition-fg invisible opacity-0 group-hover:visible group-hover:opacity-100"
          type="button"
          onClick={handleDelete}
        >
          <span className="sr-only">
            {t("orders.activity.comment.deleteButtonText")}
          </span>
          <XMarkMini className="text-ui-fg-muted" />
        </IconButton>
      </div>
      <Link
        to={`/settings/users/${note.author_id}`}
        className="text-ui-fg-subtle hover:text-ui-fg-base transition-fg w-fit"
      >
        <Text size="small">{byLine}</Text>
      </Link>
    </div>
  )
}

const FulfillmentCreatedBody = ({
  fulfillment,
}: {
  fulfillment: AdminFulfillment
}) => {
  const { t } = useTranslation()

  const numberOfItems = fulfillment.items.reduce((acc, item) => {
    return acc + item.quantity
  }, 0)

  return (
    <div>
      <Text size="small" className="text-ui-fg-subtle">
        {t("orders.activity.events.fulfillment.items", {
          count: numberOfItems,
        })}
      </Text>
    </div>
  )
}

const ReturnBody = ({ orderReturn }: { orderReturn: AdminReturn }) => {
  const { t } = useTranslation()

  const numberOfItems = orderReturn.items.reduce((acc, item) => {
    return acc + item.quantity
  }, 0)

  return (
    <div>
      <Text size="small" className="text-ui-fg-subtle">
        {t("orders.activity.events.return.items", {
          count: numberOfItems,
        })}
      </Text>
    </div>
  )
}
