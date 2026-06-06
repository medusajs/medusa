import { Plus, ReceiptPercent } from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import {
  Button,
  clx,
  Container,
  Divider,
  Heading,
  Text,
  toast,
  usePrompt,
} from "@zjedene-medusa/ui"
import { Link, useNavigate } from "react-router-dom"
import { useConvertDraftOrder } from "../../hooks/api/draft-orders"
import { getLocaleAmount, getStylizedAmount } from "../../lib/data/currencies"
import { ActionMenu } from "../common/action-menu"
import { Thumbnail } from "../common/thumbnail"

interface SummarySectionProps {
  order: HttpTypes.AdminOrder & {
    promotions: HttpTypes.AdminPromotion[]
  }
}

export const SummarySection = ({ order }: SummarySectionProps) => {
  const promotions: HttpTypes.AdminPromotion[] | null = order.promotions || []

  return (
    <Container className="p-0 overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between gap-x-4">
        <Heading>Summary</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: "Edit items",
                  icon: <Plus />,
                  to: "items",
                },
              ],
            },
            {
              actions: [
                {
                  label: "Edit promotions",
                  icon: <ReceiptPercent />,
                  to: "promotions",
                },
              ],
            },
          ]}
        />
      </div>
      <Divider variant="dashed" />
      <div>
        {order.items
          .sort((a, b) => {
            // sort the items so items with no variant id go last
            if (a.variant_id && !b.variant_id) {
              return -1
            }

            return 1
          })
          .map((item, idx) => (
            <div key={item.id}>
              <Item item={item} currencyCode={order.currency_code} />
              {idx !== order.items.length - 1 && <Divider variant="dashed" />}
            </div>
          ))}
      </div>
      <Divider variant="dashed" />
      <Total
        currencyCode={order.currency_code}
        total={order.total}
        shippingSubtotal={order.shipping_subtotal}
        discountTotal={order.discount_total}
        promotions={promotions}
        taxTotal={order.tax_total}
        itemSubTotal={order.item_subtotal}
        itemCount={
          order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
        }
      />
      <Divider variant="dashed" />
      <Footer order={order} />
    </Container>
  )
}

interface ItemProps {
  item: HttpTypes.AdminOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <div className="px-6 py-4 grid grid-cols-2 gap-3">
      <div className="flex items-center gap-x-3">
        {/* Only display a thumbnail for non-custom items */}
        {item.variant_id && (
          <Thumbnail thumbnail={item.thumbnail} alt={item.title} />
        )}
        <div>
          <div className="flex items-center gap-x-1">
            <Text size="small" weight="plus" leading="compact">
              {item.product_title || item.title}
            </Text>
            {item.variant_title && (
              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                ({item.variant_title})
              </Text>
            )}
          </div>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {item.variant_sku}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-3 items-center gap-3 [&>div]:text-right text-ui-fg-subtle">
        <div>
          <Text>{getLocaleAmount(item.unit_price, currencyCode)}</Text>
        </div>
        <div>
          <Text>{item.quantity}x</Text>
        </div>
        <div>
          <Text>{getLocaleAmount(item.subtotal, currencyCode)}</Text>
        </div>
      </div>
    </div>
  )
}

interface TotalProps {
  total: number
  shippingSubtotal: number | null
  discountTotal: number | null
  promotions: HttpTypes.AdminPromotion[]
  taxTotal: number | null
  currencyCode: string
  itemSubTotal: number
  itemCount: number
}

const Total = ({
  total,
  discountTotal,
  shippingSubtotal,
  taxTotal,
  currencyCode,
  promotions,
  itemSubTotal,
  itemCount,
}: TotalProps) => {
  return (
    <div className="flex flex-col px-6 py-4 gap-y-2">
      {itemCount > 0 && (
        <div className="grid grid-cols-3 items-center justify-between gap-x-4 text-ui-fg-subtle">
          <Text size="small" leading="compact">
            Subtotal
          </Text>
          <div className="flex items-center justify-end">
            <Text size="small" leading="compact">
              {`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            </Text>
          </div>
          <div className="flex items-center justify-end">
            <Text size="small" leading="compact">
              {getLocaleAmount(itemSubTotal, currencyCode)}
            </Text>
          </div>
        </div>
      )}
      {shippingSubtotal !== null && (
        <div className="flex items-center justify-between gap-x-4 text-ui-fg-subtle">
          <Text size="small" leading="compact">
            Shipping
          </Text>
          <Text size="small" leading="compact">
            {getLocaleAmount(shippingSubtotal, currencyCode)}
          </Text>
        </div>
      )}
      {discountTotal !== null && (
        <div
          className={clx(
            "grid grid-cols-2 items-center gap-x-4 text-ui-fg-subtle",
            {
              "grid-cols-3": !!promotions,
            }
          )}
        >
          <Text size="small" leading="compact">
            Discount
          </Text>
          <div className="flex items-center justify-end gap-x-2">
            {promotions.map((promotion) => (
              <Link to={`/promotions/${promotion.id}`} key={promotion.id}>
                <Text size="small" leading="compact">
                  {promotion.code}
                </Text>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <Text size="small" leading="compact">
              {getLocaleAmount(discountTotal, currencyCode)}
            </Text>
          </div>
        </div>
      )}
      {taxTotal !== null && (
        <div className="flex items-center justify-between gap-x-4 text-ui-fg-subtle">
          <Text size="small" leading="compact">
            Tax
          </Text>
          <Text size="small" leading="compact">
            {taxTotal > 0 ? getLocaleAmount(taxTotal, currencyCode) : "-"}
          </Text>
        </div>
      )}
      <div className="flex items-center justify-between gap-x-4">
        <Text size="small" leading="compact" weight="plus">
          Total
        </Text>
        <Text
          size="small"
          leading="compact"
          weight="plus"
          className="text-right"
        >
          {getStylizedAmount(total, currencyCode)}
        </Text>
      </div>
    </div>
  )
}

const Footer = ({ order }: { order: HttpTypes.AdminOrder }) => {
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync: convertDraftOrder, isPending } = useConvertDraftOrder(
    order.id
  )

  const handleConvert = async () => {
    const res = await prompt({
      title: "Are you sure?",
      description:
        "You are about to convert this draft order to an order. This action cannot be undone.",
      variant: "confirmation",
    })

    if (!res) {
      return
    }

    await convertDraftOrder(undefined, {
      onSuccess: () => {
        toast.success("Draft order converted to order")
        navigate(`/orders/${order.id}`)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <div className="px-6 py-4 flex items-center justify-end gap-x-2 bg-ui-bg-component">
      <Button
        size="small"
        variant="secondary"
        isLoading={isPending}
        onClick={handleConvert}
      >
        Convert to order
      </Button>
    </div>
  )
}