import { Alert, Button, Popover, Text } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useCreateOrderFulfillment } from "../../../../../../hooks/api/orders"
import { getFulfillableQuantity } from "../../../../../../lib/order-item"
import {
  DisabledFulfillCell,
  getShipFromLocationId,
  getShipFromLocationName,
  ReadyToShipOrder,
} from "./ready-to-ship-table"

type FulfillConfirmPopoverProps = {
  order: ReadyToShipOrder
}

/**
 * Read-only confirmation popover for the Ready to Ship table's Fulfill
 * action. Shows the order's default fulfillment location (resolved via the
 * same shipping method -> shipping option -> service zone -> fulfillment
 * set -> location chain `order-create-fulfillment-form.tsx` uses) and the
 * order's remaining (unfulfilled) line items, using the same
 * `quantity - detail.fulfilled_quantity` formula as that form and
 * `computeOrderParcel`. Confirm calls `useCreateOrderFulfillment` with
 * those exact, unmodified values - this is a confirmation display, never
 * an editable form. An order that needs a different location or
 * quantities still goes through the full fulfillment form on the order
 * detail page, which this plan leaves unchanged.
 *
 * On success the popover closes. `useCreateOrderFulfillment`'s own
 * `onSuccess` already invalidates `ordersQueryKeys.all`, and
 * `ReadyToShipTable`'s `useOrders` query key is built under that same
 * `orders` key hierarchy, so no additional invalidation is needed here.
 *
 * On failure (e.g. the fulfillment provider can't quote/buy a label for an
 * incomplete address) the popover stays open and the error message is
 * rendered inline inside the content, per the design spec's Error
 * handling section - deliberately not a toast, unlike the full
 * fulfillment form's own error handling.
 */
export const FulfillConfirmPopover = ({
  order,
}: FulfillConfirmPopoverProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { mutateAsync, isPending } = useCreateOrderFulfillment(order.id)

  const shippingMethod = order.shipping_methods?.[0]
  // Deliberately `!!shippingMethod`, not `orderHasShippingMethod(order)`:
  // TS's control-flow narrowing of `shippingMethod` after the `if
  // (!hasShippingMethod) return` below only works for a directly aliased
  // condition - routing it through a separate function call would lose
  // that narrowing and need a cast everywhere `shippingMethod` is used
  // past this point. Both forms are equivalent; `orderHasShippingMethod`
  // exists for the bulk row-selection check in `ready-to-ship-table.tsx`,
  // which has no such narrowing to preserve.
  const hasShippingMethod = !!shippingMethod

  if (!hasShippingMethod) {
    return <DisabledFulfillCell />
  }

  const locationId = getShipFromLocationId(shippingMethod)
  const locationName = getShipFromLocationName(shippingMethod)

  const fulfillableItems = (order.items ?? []).filter(
    (item) => getFulfillableQuantity(item) > 0
  )

  const handleOpenChange = (next: boolean) => {
    if (isPending) {
      return
    }

    setOpen(next)

    if (next) {
      setErrorMessage(null)
    }
  }

  const handleConfirm = async () => {
    setErrorMessage(null)

    try {
      await mutateAsync({
        location_id: locationId,
        shipping_option_id: shippingMethod.shipping_option_id ?? undefined,
        items: fulfillableItems.map((item) => ({
          id: item.id,
          quantity: getFulfillableQuantity(item),
        })),
      })
      setOpen(false)
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : t("errorBoundary.defaultTitle")
      )
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {/*
       * `DisabledFulfillCell` isn't used as the trigger here: Radix's
       * `asChild` clones its injected props (ref, onClick, aria
       * attributes) onto the literal child element, which only works when
       * that child forwards them on to a real DOM node (as `Button`
       * does). `DisabledFulfillCell` is a plain function component that
       * ignores extra props, so the button below mirrors its rendering
       * (same label, size and variant) instead. The no-shipping-method
       * case above still reuses `DisabledFulfillCell` (and its `Tooltip`)
       * verbatim, since that branch never needs to compose with the
       * popover trigger.
       */}
      <Popover.Trigger asChild>
        <Button
          size="small"
          variant="secondary"
          onClick={(e) => {
            // This cell sits inside `_DataTable`'s own `navigateTo` `Link`
            // (`data-table-root.tsx`'s `shouldRenderAsLink`), which wraps
            // every non-`select` cell. `Link`'s own navigation is just
            // another React click handler (react-router is client-side
            // routing, not a real anchor follow), so stopping this
            // synthetic event from bubbling up to it - the same pattern
            // the "select" checkbox column and `ActionMenu` already use -
            // is enough to keep this click from navigating away instead of
            // opening the popover. Deliberately not `preventDefault`: Radix
            // composes this handler with its own open-toggle handler via
            // `composeEventHandlers`, which skips its handler once
            // `defaultPrevented` is set, so calling it here would stop the
            // popover from ever opening.
            e.stopPropagation()
          }}
        >
          {t("orders.readyToShip.fulfill")}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        align="end"
        side="top"
        className="w-[320px] overflow-hidden"
        // Radix portals this content elsewhere in the DOM, but React's
        // synthetic event system still dispatches through the *original*
        // component tree (the row's `Link` is an ancestor there), so a
        // click on Confirm/Cancel/the content itself would otherwise still
        // bubble up to - and navigate via - that `Link`. Stopping it here
        // covers the whole popover (content background, Cancel, Confirm)
        // in one place rather than on each button individually.
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="flex flex-col gap-y-3 p-3">
          <Text size="small" weight="plus">
            {t("orders.readyToShip.confirmHeading")}
          </Text>

          <div className="flex flex-col gap-y-1">
            <Text size="xsmall" className="text-ui-fg-subtle">
              {t("fields.location")}
            </Text>
            <Text size="small">{locationName}</Text>
          </div>

          <div className="flex flex-col gap-y-1">
            <Text size="xsmall" className="text-ui-fg-subtle">
              {t("fields.items")}
            </Text>
            <div className="flex flex-col gap-y-0.5">
              {fulfillableItems.map((item) => (
                <Text size="small" key={item.id}>
                  {getFulfillableQuantity(item)}x {item.title}
                </Text>
              ))}
            </div>
          </div>

          {errorMessage && (
            <Alert variant="error" dismissible={false} className="p-2">
              {errorMessage}
            </Alert>
          )}

          <div className="flex items-center justify-end gap-x-2">
            <Popover.Close asChild>
              <Button size="small" variant="secondary" disabled={isPending}>
                {t("actions.cancel")}
              </Button>
            </Popover.Close>
            <Button
              size="small"
              type="button"
              isLoading={isPending}
              disabled={!fulfillableItems.length}
              onClick={handleConfirm}
            >
              {t("actions.confirm")}
            </Button>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  )
}
