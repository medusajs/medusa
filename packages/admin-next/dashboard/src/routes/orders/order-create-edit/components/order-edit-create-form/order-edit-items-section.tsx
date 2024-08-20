import {
  AdminExchange,
  AdminOrder,
  AdminOrderPreview,
  AdminReturn,
  InventoryLevelDTO,
} from "@medusajs/types"
import { Alert, Button, Heading, Text, toast } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  StackedFocusModal,
  useStackedModal,
} from "../../../../../components/modals"
import { useShippingOptions, useStockLocations } from "../../../../../hooks/api"
import {
  useAddExchangeInboundItems,
  useAddExchangeInboundShipping,
  useDeleteExchangeInboundShipping,
  useRemoveExchangeInboundItem,
  useUpdateExchangeInboundItem,
} from "../../../../../hooks/api/exchanges"
import { useUpdateReturn } from "../../../../../hooks/api/returns"
import { sdk } from "../../../../../lib/client"
import { AddOrderEditItemsTable } from "../add-order-edit-items-table"
import { OrderEditItem } from "./order-edit-item"

type ExchangeInboundSectionProps = {
  order: AdminOrder
  preview: AdminOrderPreview
}

export const OrderEditItemsSection = ({
  order,
  preview,
}: ExchangeInboundSectionProps) => {
  const { t } = useTranslation()

  /**
   * STATE
   */
  const { setIsOpen } = useStackedModal()

  const onItemsSelected = async () => {
    // TODO logic on add

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

            {/*<AddOrderEditItemsTable*/}
            {/*  items={order.items!}*/}
            {/*  selectedItems={inboundItems.map((i) => i.item_id)}*/}
            {/*  currencyCode={order.currency_code}*/}
            {/*  onSelectionChange={(finalSelection) => {*/}
            {/*    const alreadySelected = inboundItems.map((i) => i.item_id)*/}

            {/*    itemsToAdd = finalSelection.filter(*/}
            {/*      (selection) => !alreadySelected.includes(selection)*/}
            {/*    )*/}
            {/*    itemsToRemove = alreadySelected.filter(*/}
            {/*      (selection) => !finalSelection.includes(selection)*/}
            {/*    )*/}
            {/*  }}*/}
            {/*/>*/}

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

      {preview.items.map((item, index) => (
        <OrderEditItem
          key={item.id}
          item={item}
          currencyCode={order.currency_code}
          onRemove={() => {
            // TODO: on remove logic
          }}
          onUpdate={(payload) => {
            // TODO: on update logic
          }}
        />
      ))}
    </div>
  )
}
