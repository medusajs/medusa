import React from "react"
import { LineItem, OrderItemChange, ProductVariant } from "@medusajs/medusa"
import {
  useAdminDeleteOrderEditItemChange,
  useAdminOrderEditAddLineItem,
  useAdminOrderEditDeleteLineItem,
  useAdminOrderEditUpdateLineItem,
} from "medusa-react"
import clsx from "clsx"

import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import Actionables from "../../../../components/molecules/actionables"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import DuplicateIcon from "../../../../components/fundamentals/icons/duplicate-icon"
import RefreshIcon from "../../../../components/fundamentals/icons/refresh-icon"
import useNotification from "../../../../hooks/use-notification"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import { AddProductVariant } from "../../edit/modal"
import Tooltip from "../../../../components/atoms/tooltip"
import CopyToClipboard from "../../../../components/atoms/copy-to-clipboard"

type OrderEditLineProps = {
  item: LineItem
  customerId: string
  regionId: string
  currencyCode: string
  change?: OrderItemChange
}

let isLoading = false

const OrderEditLine = ({
  item,
  currencyCode,
  change,
  customerId,
  regionId,
}: OrderEditLineProps) => {
  const notification = useNotification()
  const { pop, push } = React.useContext(LayeredModalContext)

  const isNew = change?.type === "item_add"
  const isModified = change?.type === "item_update"
  const isLocked = !!item.fulfilled_quantity

  const { mutateAsync: addLineItem } = useAdminOrderEditAddLineItem(
    item.order_edit_id!
  )

  const { mutateAsync: removeItem } = useAdminOrderEditDeleteLineItem(
    item.order_edit_id!,
    item.id
  )

  const { mutateAsync: updateItem } = useAdminOrderEditUpdateLineItem(
    item.order_edit_id!,
    item.id
  )

  const { mutateAsync: undoChange } = useAdminDeleteOrderEditItemChange(
    item.order_edit_id!,
    change?.id as string
  )

  const onQuantityUpdate = async (newQuantity: number) => {
    if (isLoading) {
      return
    }

    isLoading = true
    try {
      await updateItem({ quantity: newQuantity })
    } finally {
      isLoading = false
    }
  }

  const onDuplicate = async () => {
    if (!item.variant) {
      notification(
        "Warning",
        "Cannot duplicate an item without a variant",
        "warning"
      )
      return
    }

    try {
      await addLineItem({
        variant_id: item.variant_id,
        quantity: item.quantity,
      })
    } catch (e) {
      notification("Error", "Failed to duplicate item", "error")
    }
  }

  const onRemove = async () => {
    try {
      if (change) {
        if (change.type === "item_add") {
          await undoChange()
        }
        if (change.type === "item_update") {
          await undoChange()
          await removeItem()
        }
      } else {
        await removeItem()
      }
      notification("Success", "Item removed", "success")
    } catch (e) {
      notification("Error", "Failed to remove item", "error")
    }
  }

  const onReplace = async (selected: ProductVariant[]) => {
    const newVariantId = selected[0].id
    try {
      await onRemove()
      await addLineItem({ variant_id: newVariantId, quantity: item.quantity })
      notification("Success", "Item added", "success")
    } catch (e) {
      notification("Error", "Failed to replace the item", "error")
    }
  }

  const replaceProductVariantScreen = {
    title: "Replace Product Variants",
    onBack: pop,
    view: (
      <AddProductVariant
        onSubmit={onReplace}
        customerId={customerId}
        regionId={regionId}
        currencyCode={currencyCode}
        isReplace
      />
    ),
  }

  const actions = [
    !isLocked && {
      label: "Replace with other item",
      onClick: () => push(replaceProductVariantScreen),
      icon: <RefreshIcon size="20" />,
    },
    {
      label: "Duplicate item",
      onClick: onDuplicate,
      icon: <DuplicateIcon size="20" />,
    },
    !isLocked && {
      label: "Remove item",
      onClick: onRemove,
      variant: "danger",
      icon: <TrashIcon size="20" />,
    },
  ].filter(Boolean)

  return (
    <Tooltip
      side="top"
      open={isLocked ? undefined : false}
      content="This line item is part of a fulfillment and cannot be edited. Cancel the fulfillment to edit the line item."
    >
      <div className="flex justify-between mb-1 h-[64px] py-2 mx-[-5px] px-[5px] hover:bg-grey-5 rounded-rounded">
        <div className="flex space-x-4 justify-center flex-grow-1">
          <div className="flex h-[48px] w-[36px] rounded-rounded overflow-hidden">
            {item.thumbnail ? (
              <img src={item.thumbnail} className="object-cover" />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div>
              <span
                className={clsx("inter-small-regular text-grey-900", {
                  "text-gray-400": isLocked,
                })}
              >
                {item.title}
              </span>
            </div>
            <div className="flex items-center">
              {isNew && (
                <div className="text-small text-blue-500 bg-blue-10 h-[24px] w-[42px] mr-2 flex-shrink-0 flex items-center justify-center rounded-rounded">
                  New
                </div>
              )}

              {isModified && (
                <div className="text-small text-orange-500 bg-orange-10 h-[24px] w-[68px] mr-2 flex-shrink-0 flex items-center justify-center rounded-rounded">
                  Modified
                </div>
              )}

              <div className="min-h-[20px]">
                {item?.variant && (
                  <span
                    className={clsx(
                      "inter-small-regular text-gray-500 flex gap-3",
                      {
                        "text-gray-400": isLocked,
                      }
                    )}
                  >
                    {item.variant.title}
                    {item.variant.sku && (
                      <CopyToClipboard value={item.variant.sku} iconSize={14} />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between min-w-[312px]">
          <div
            className={clsx("flex items-center flex-grow-0 text-gray-400", {
              "pointer-events-none": isLocked,
            })}
          >
            <MinusIcon
              className={clsx("cursor-pointer text-gray-400", {
                "pointer-events-none": isLoading,
              })}
              onClick={() =>
                item.quantity > 1 &&
                !isLocked &&
                onQuantityUpdate(item.quantity - 1)
              }
            />
            <span
              className={clsx("px-8 text-center text-gray-900 min-w-[74px]", {
                "!text-gray-400": isLocked,
              })}
            >
              {item.quantity}
            </span>
            <PlusIcon
              className={clsx("cursor-pointer text-gray-400", {
                "pointer-events-none": isLoading,
              })}
              onClick={() => onQuantityUpdate(item.quantity + 1)}
            />
          </div>

          <div
            className={clsx(
              "flex small:space-x-2 medium:space-x-4 large:space-x-6",
              { "!text-gray-400 pointer-events-none": isLocked }
            )}
          >
            <div
              className={clsx(
                "inter-small-regular text-gray-900 min-w-[60px] text-right",
                {
                  "!text-gray-400 pointer-events-none": isLocked,
                }
              )}
            >
              {formatAmountWithSymbol({
                amount: item.unit_price * item.quantity,
                currency: currencyCode,
                tax: item.tax_lines,
                digits: 2,
              })}
            </div>
          </div>
          <div className="inter-small-regular text-gray-400">
            {currencyCode.toUpperCase()}
          </div>
          <Actionables forceDropdown actions={actions} />
        </div>
      </div>
    </Tooltip>
  )
}

export default OrderEditLine
