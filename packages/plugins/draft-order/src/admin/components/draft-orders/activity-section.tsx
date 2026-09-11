import { HttpTypes } from "@medusajs/types"
import {
  Avatar,
  clx,
  Container,
  Heading,
  Skeleton,
  Text,
  Tooltip,
} from "@medusajs/ui"
import type { TFunction } from "i18next"
import { Collapsible } from "radix-ui"
import { ReactNode, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useUser } from "../../hooks/api/users"
import { getFullDate, getRelativeDate } from "../../lib/utils/date-utils"

interface ActivitySectionProps {
  order: HttpTypes.AdminOrder
  changes: HttpTypes.AdminOrderChange[]
}

export const ActivitySection = ({ order, changes }: ActivitySectionProps) => {
  const { t } = useTranslation()
  const activityItems = useMemo(
    () => getActivityItems(order, changes, t),
    [order, changes, t]
  )

  return (
    <Container className="overflow-hidden p-0">
      <div className="px-6 py-4">
        <Heading>{t("orders.activity.header")}</Heading>
      </div>
      <ActivityItemList items={activityItems} />
    </Container>
  )
}

interface ActivityItemListProps {
  items: ActivityItem[]
}

const ActivityItemList = ({ items }: ActivityItemListProps) => {
  if (items.length <= 3) {
    return (
      <div className="flex flex-col gap-y-0.5 px-6 pb-6">
        {items.map((item, idx) => (
          <ActivityItem
            key={idx}
            item={item}
            isFirst={idx === items.length - 1}
          />
        ))}
      </div>
    )
  }

  const lastItems = items.slice(0, 2)
  const collapsibleItems = items.slice(2, items.length - 1)
  const firstItem = items[items.length - 1]

  return (
    <div className="flex flex-col gap-y-0.5 px-6 pb-6">
      {lastItems.map((item, idx) => (
        <ActivityItem key={idx} item={item} />
      ))}
      <CollapsibleActivityItemList items={collapsibleItems} />
      <ActivityItem key={items.length - 1} item={firstItem} isFirst />
    </div>
  )
}

interface CollapsibleActivityItemListProps {
  items: ActivityItem[]
}

const CollapsibleActivityItemList = ({
  items,
}: CollapsibleActivityItemListProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      {!open && (
        <div className="grid grid-cols-[20px_1fr] items-start gap-2">
          <div className="flex size-full flex-col items-center">
            <div className="border-ui-border-strong w-px flex-1 bg-[linear-gradient(var(--border-strong)_33%,rgba(255,255,255,0)_0%)] bg-[length:1px_3px] bg-clip-content bg-right bg-repeat-y" />
          </div>
          <Collapsible.Trigger className="text-ui-fg-muted hover:text-ui-fg-base focus:text-ui-fg-base m-0 p-0 pb-4 text-left outline-none transition-colors">
            <Text size="small" leading="compact" weight="plus">
              {`Show ${items.length} more ${
                items.length === 1 ? "activity" : "activities"
              }`}
            </Text>
          </Collapsible.Trigger>
        </div>
      )}
      <Collapsible.Content>
        <div className="flex flex-col gap-y-0.5">
          {items.map((item, idx) => {
            return <ActivityItem key={idx} item={item} />
          })}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

interface ActivityItem {
  label: string
  content?: ReactNode
  timestamp: string
  userId?: string | null
}

interface ActivityItemProps {
  item: ActivityItem
  isFirst?: boolean
}

const ActivityItem = ({ item, isFirst = false }: ActivityItemProps) => {
  const { user, isPending, isError, error } = useUser(item.userId!, undefined, {
    enabled: !!item.userId,
  })

  if (isError) {
    throw error
  }

  const isUserLoaded = !isPending && !!user && !!item.userId

  return (
    <div
      className={clx("grid w-full grid-cols-[20px_1fr] items-start gap-x-2")}
    >
      <div className="flex h-full flex-col items-center gap-0.5">
        <div className="flex size-5 items-center justify-center">
          <div className="shadow-borders-base flex size-2.5 items-center justify-center rounded-full">
            <div className="bg-ui-tag-neutral-icon size-1.5 rounded-full" />
          </div>
        </div>
        {!isFirst && (
          <div className="flex flex-1 items-center justify-center">
            <div className="bg-ui-border-base h-full w-px" />
          </div>
        )}
      </div>
      <div className={clx("flex flex-col", !isFirst && "pb-4")}>
        <div className="flex items-center justify-between gap-x-2">
          <Text size="small" weight="plus" leading="compact">
            {item.label}
          </Text>
          <Tooltip
            content={getFullDate({ date: item.timestamp, includeTime: true })}
          >
            <Text size="small" leading="compact" className="cursor-default">
              {getRelativeDate(item.timestamp)}
            </Text>
          </Tooltip>
        </div>
        {item.content && renderContent(item.content)}
        {item.userId && (
          <div className="text-ui-fg-muted pt-2">
            {isUserLoaded ? (
              <Link to={`/settings/users/${user.id}`} className="w-fit">
                <div className="flex w-fit items-center gap-x-1.5">
                  <Text size="small">By</Text>
                  <Avatar
                    size="2xsmall"
                    fallback={[user.first_name, user.last_name]
                      .filter(Boolean)
                      .join("")
                      .slice(0, 1)}
                  />
                  <Text size="small">
                    {user.first_name} {user.last_name}
                  </Text>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-x-1.5">
                <Text size="small">By</Text>
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-[75px]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function renderContent(content: ReactNode) {
  if (typeof content === "string") {
    return (
      <Text size="small" className="text-ui-fg-subtle">
        {content}
      </Text>
    )
  }

  return content
}

const ACTIVITY_COUNT_KEYS = {
  items: "general.items",
  shipping: "draftOrders.activity.shippingMethodCount",
  promotions: "draftOrders.activity.promotionCount",
} as const

const ACTIVITY_LABEL_KEYS = {
  items: {
    added: "draftOrders.activity.labels.itemsAdded",
    removed: "draftOrders.activity.labels.itemsRemoved",
    updated: "draftOrders.activity.labels.itemsUpdated",
  },
  shipping: {
    added: "draftOrders.activity.labels.shippingAdded",
    removed: "draftOrders.activity.labels.shippingRemoved",
    updated: "draftOrders.activity.labels.shippingUpdated",
  },
  promotions: {
    added: "draftOrders.activity.labels.promotionsAdded",
    removed: "draftOrders.activity.labels.promotionsRemoved",
    updated: "draftOrders.activity.labels.promotionsUpdated",
  },
} as const

function getEditActivityItems(
  change: HttpTypes.AdminOrderChange,
  t: TFunction
): ActivityItem[] {
  const activityItems: ActivityItem[] = []
  const counts = {
    itemsAdded: 0,
    itemsRemoved: 0,
    shippingMethodsAdded: 0,
    shippingMethodsRemoved: 0,
    promotionsAdded: 0,
    promotionsRemoved: 0,
  }

  const orderedActions = change.actions.sort((a, b) => {
    return a.ordering - b.ordering
  })

  const addedPromotionMap = new Map<string, true>()
  const removedPromotionMap = new Map<string, true>()

  for (const action of orderedActions) {
    if (!action.details) {
      continue
    }

    switch (action.action) {
      case "ITEM_ADD":
        counts.itemsAdded += action.details.quantity as number
        break
      case "ITEM_UPDATE":
        const diff = action.details.quantity_diff as number
        diff > 0 ? (counts.itemsAdded += diff) : (counts.itemsRemoved += diff)
        break
      case "SHIPPING_ADD":
        counts.shippingMethodsAdded += 1
        break
      case "SHIPPING_REMOVE":
        counts.shippingMethodsRemoved += 1
        break
      case "PROMOTION_ADD": {
        addedPromotionMap.set(action.reference_id!, true)
        break
      }
      case "PROMOTION_REMOVE": {
        if (addedPromotionMap.has(action.reference_id!)) {
          addedPromotionMap.delete(action.reference_id!)
        } else {
          removedPromotionMap.set(action.reference_id!, true)
        }
        break
      }
    }

    counts.promotionsAdded = addedPromotionMap.size
    counts.promotionsRemoved = removedPromotionMap.size
  }

  const createActivityItem = (
    type: "items" | "shipping" | "promotions",
    added: number,
    removed: number
  ) => {
    if (added === 0 && removed === 0) return

    const countKey = ACTIVITY_COUNT_KEYS[type]

    const addedText = t(countKey, { count: added })
    const removedText = t(countKey, { count: Math.abs(removed) })

    const content =
      added && removed
        ? t("draftOrders.activity.addedAndRemoved", {
            added: addedText,
            removed: removedText,
          })
        : added
        ? t("draftOrders.activity.added", { added: addedText })
        : t("draftOrders.activity.removed", { removed: removedText })

    const label = t(
      ACTIVITY_LABEL_KEYS[type][
        added && removed ? "updated" : added ? "added" : "removed"
      ]
    )

    activityItems.push({
      label,
      content,
      timestamp: new Date(change.created_at).toISOString(),
      userId: change.confirmed_by,
    })
  }

  createActivityItem("items", counts.itemsAdded, counts.itemsRemoved)
  createActivityItem(
    "shipping",
    counts.shippingMethodsAdded,
    counts.shippingMethodsRemoved
  )
  createActivityItem(
    "promotions",
    counts.promotionsAdded,
    counts.promotionsRemoved
  )

  return activityItems
}

function getTransferActivityItem(
  change: HttpTypes.AdminOrderChange,
  t: TFunction
) {
  return {
    label: t("draftOrders.activity.transferredLabel"),
    content: t("draftOrders.activity.transferredContent"),
    timestamp: new Date(change.created_at).toISOString(),
  }
}

function getUpdateOrderActivityItem(
  change: HttpTypes.AdminOrderChange,
  t: TFunction
) {
  const { details } = change.actions?.[0] || {}

  if (!details) {
    return null
  }

  switch (details.type) {
    case "customer_id":
      return {
        label: t("orders.activity.events.update_order.customer_id"),
        timestamp: new Date(change.created_at).toISOString(),
        userId: change.confirmed_by,
      }
    case "sales_channel_id":
      return {
        label: t("orders.activity.events.update_order.sales_channel_id"),
        timestamp: new Date(change.created_at).toISOString(),
        userId: change.confirmed_by,
      }
    case "billing_address":
      return {
        label: t("orders.activity.events.update_order.billing_address"),
        timestamp: new Date(change.created_at).toISOString(),
        userId: change.confirmed_by,
      }
    case "shipping_address":
      return {
        label: t("orders.activity.events.update_order.shipping_address"),
        timestamp: new Date(change.created_at).toISOString(),
        userId: change.confirmed_by,
      }
    case "email":
      return {
        label: t("orders.activity.events.update_order.email"),
        timestamp: new Date(change.created_at).toISOString(),
        userId: change.confirmed_by,
      }

    default:
      return null
  }
}

function getActivityItems(
  order: HttpTypes.AdminOrder,
  changes: HttpTypes.AdminOrderChange[],
  t: TFunction
) {
  const items: ActivityItem[] = []

  if (order.created_at) {
    items.push({
      label: t("fields.created"),
      content: t("draftOrders.activity.createdContent"),
      timestamp: new Date(order.created_at).toISOString(),
    })
  }

  changes.forEach((change) => {
    if (!change.change_type || !change.confirmed_at) {
      return
    }

    switch (change.change_type) {
      case "edit": {
        items.push(...getEditActivityItems(change, t))
        break
      }
      case "transfer":
        items.push(getTransferActivityItem(change, t))
        break
      case "update_order": {
        const item = getUpdateOrderActivityItem(change, t)

        if (item) {
          items.push(item)
        }
        break
      }
      default:
        break
    }
  })

  return items.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}
