import {
  AdminExchange,
  AdminOrder,
  AdminOrderPreview,
  AdminReturn,
  InventoryLevelDTO,
} from "@medusajs/types"
import { Button, Heading, Text, toast } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  RouteFocusModal,
  StackedFocusModal,
  useStackedModal,
} from "../../../../../components/modals"
import { AddOrderEditItemsTable } from "../add-order-edit-items-table"
import { OrderEditItem } from "./order-edit-item"
import {
  useAddOrderEditItems,
  useRemoveOrderEditItem,
} from "../../../../../hooks/api/order-edits.tsx"

type ExchangeInboundSectionProps = {
  order: AdminOrder
  preview: AdminOrderPreview
}

let addedVariants: string[] = []

export const OrderEditItemsSection = ({
  order,
  preview,
}: ExchangeInboundSectionProps) => {
  const { t } = useTranslation()

  /**
   * STATE
   */
  const { setIsOpen } = useStackedModal()

  /*
   * MUTATIONS
   */

  const { mutateAsync: addItems } = useAddOrderEditItems(order.id)
  const { mutateAsync: removeItem } = useRemoveOrderEditItem(order.id)

  const onItemsSelected = async () => {
    try {
      await addItems({
        items: addedVariants.map((i) => ({
          variant_id: i,
          quantity: 1,
        })),
      })
    } catch (e) {
      toast.error(e.message)
    }

    setIsOpen("inbound-items", false)
  }

  return (
    <div>
      <div className="mt-8 flex items-center justify-between">
        <Heading level="h2">{t("orders.edits.items")}</Heading>

        <StackedFocusModal id="inbound-items">
          <StackedFocusModal.Trigger asChild>
            <Button variant="secondary" size="small">
              {t("actions.addItems")}
            </Button>
          </StackedFocusModal.Trigger>

          <StackedFocusModal.Content>
            <StackedFocusModal.Header />

            <AddOrderEditItemsTable
              items={preview.items}
              selectedItems={[] /* TODO */}
              currencyCode={order.currency_code}
              onSelectionChange={(finalSelection) => {
                addedVariants = finalSelection
              }}
            />

            <StackedFocusModal.Footer>
              <div className="flex w-full items-center justify-end gap-x-4">
                <div className="flex items-center justify-end gap-x-2">
                  <RouteFocusModal.Close asChild>
                    <Button type="button" variant="secondary" size="small">
                      {t("actions.cancel")}
                    </Button>
                  </RouteFocusModal.Close>
                  <Button
                    key="submit-button"
                    type="submit"
                    variant="primary"
                    size="small"
                    role="button"
                    onClick={async () => await onItemsSelected()}
                  >
                    {t("actions.save")}
                  </Button>
                </div>
              </div>
            </StackedFocusModal.Footer>
          </StackedFocusModal.Content>
        </StackedFocusModal>
      </div>

      {preview.items.map((item) => (
        <OrderEditItem
          key={item.id}
          item={item}
          currencyCode={order.currency_code}
          onRemove={async () => {
            const addItemAction = item.actions?.find(
              (a) => a.action === "ITEM_ADD"
            )

            if (addItemAction) {
              try {
                await removeItem(addItemAction.id)
              } catch (e) {
                toast.error(e.message)
              }
            } else {
              // TODO: set quantity to 0
            }
          }}
          onUpdate={(payload) => {
            // TODO: on update logic
          }}
        />
      ))}
    </div>
  )
}
