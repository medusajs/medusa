import { DocumentSeries, XCircle } from "@medusajs/icons"
import { AdminOrderLineItem } from "@medusajs/types"
import { Badge, Input, Text, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { useMemo } from "react"
import {
  useAddOrderEditItems,
  useRemoveOrderEditItem,
  useUpdateOrderEditAddedItem,
  useUpdateOrderEditOriginalItem,
} from "../../../../../hooks/api/order-edits"

type OrderEditItemProps = {
  item: AdminOrderLineItem
  currencyCode: string
  orderId: string
}

function OrderEditItem({ item, currencyCode, orderId }: OrderEditItemProps) {
  const { t } = useTranslation()

  const { mutateAsync: addItems } = useAddOrderEditItems(orderId)
  const { mutateAsync: updateAddedItem } = useUpdateOrderEditAddedItem(orderId)
  const { mutateAsync: updateOriginalItem } =
    useUpdateOrderEditOriginalItem(orderId)
  const { mutateAsync: removeItem } = useRemoveOrderEditItem(orderId)

  const isAddedItem = useMemo(
    () => !!item.actions?.find((a) => a.action === "ITEM_ADD"),
    [item]
  )

  const ITEM_UPDATE = useMemo(
    () => !!item.actions?.find((a) => a.action === "ITEM_UPDATE"),
    [item]
  )

  /**
   * HANDLERS
   */

  const onUpdate = async (quantity: number) => {
    if (quantity <= item.detail.fulfilled_quantity) {
      toast.error(t("orders.edits.validation.quantityLowerThanFulfillment"))
      return
    }

    if (quantity === item.quantity) {
      return
    }

    const addItemAction = item.actions?.find((a) => a.action === "ITEM_ADD")

    try {
      if (addItemAction) {
        await updateAddedItem({ quantity, actionId: addItemAction.id })
      } else {
        await updateOriginalItem({ quantity, itemId: item.id })
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const onRemove = async () => {
    const addItemAction = item.actions?.find((a) => a.action === "ITEM_ADD")

    try {
      if (addItemAction) {
        await removeItem(addItemAction.id)
      } else {
        await updateOriginalItem({
          quantity: item.detail.fulfilled_quantity, //
          itemId: item.id,
        })
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const onDuplicate = async () => {
    try {
      await addItems({
        items: [
          {
            variant_id: item.variant_id,
            quantity: item.quantity,
          },
        ],
      })
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div
      key={item.quantity}
      className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl "
    >
      <div className="flex flex-col items-center gap-x-2 gap-y-2 p-3 text-sm md:flex-row">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-row items-center gap-x-3">
            <Thumbnail src={item.thumbnail} />

            <div className="flex flex-col">
              <div>
                <Text className="txt-small" as="span" weight="plus">
                  {item.title}{" "}
                </Text>

                {item.variant_sku && <span>({item.variant_sku})</span>}
              </div>
              <Text as="div" className="text-ui-fg-subtle txt-small">
                {item.product_title}
              </Text>
            </div>
          </div>

          {isAddedItem && (
            <Badge size="2xsmall" rounded="full" color="blue" className="mr-1">
              {t("general.new")}
            </Badge>
          )}

          {ITEM_UPDATE && (
            <Badge
              size="2xsmall"
              rounded="full"
              color="orange"
              className="mr-1"
            >
              {t("general.modified")}
            </Badge>
          )}
        </div>

        <div className="flex flex-1 justify-between">
          <div className="flex flex-grow items-center gap-2">
            <Input
              className="bg-ui-bg-base txt-small w-[67px] rounded-lg"
              type="number"
              disabled={item.detail.fulfilled_quantity === item.quantity}
              min={item.detail.fulfilled_quantity}
              defaultValue={item.quantity}
              onBlur={(e) => {
                const val = e.target.value
                const payload = val === "" ? null : Number(val)

                if (payload) {
                  onUpdate(payload)
                }
              }}
            />
            <Text className="txt-small text-ui-fg-subtle">
              {t("fields.qty")}
            </Text>
          </div>

          <div className="text-ui-fg-subtle txt-small mr-2 flex flex-shrink-0">
            <MoneyAmountCell currencyCode={currencyCode} amount={item.total} />
          </div>

          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.duplicate"),
                    onClick: onDuplicate,
                    icon: <DocumentSeries />,
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("actions.remove"),
                    onClick: onRemove,
                    icon: <XCircle />,
                    disabled: item.detail.fulfilled_quantity === item.quantity,
                  },
                ].filter(Boolean),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export { OrderEditItem }
