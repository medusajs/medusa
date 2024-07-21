import React from "react"
import { LineItem, OrderItemChange, ProductVariant } from "@medusajs/medusa"
import {
  useAdminDeleteOrderEditItemChange,
  useAdminOrderEditAddLineItem,
  useAdminOrderEditDeleteLineItem,
  useAdminOrderEditUpdateLineItem,
} from "medusa-react"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
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
        t("order-line-warning", "Warning"),
        t(
          "order-line-cannot-duplicate-an-item-without-a-variant",
          "Cannot duplicate an item without a variant"
        ),
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
      notification(
        t("order-line-error", "Error"),
        t("order-line-failed-to-duplicate-item", "Failed to duplicate item"),
        "error"
      )
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
      notification(
        t("order-line-success", "Success"),
        t("order-line-item-removed", "Item removed"),
        "success"
      )
    } catch (e) {
      notification(
        t("order-line-error", "Error"),
        t("order-line-failed-to-remove-item", "Failed to remove item"),
        "error"
      )
    }
  }

  const onReplace = async (selected: ProductVariant[]) => {
    const newVariantId = selected[0].id
    try {
      await onRemove()
      await addLineItem({ variant_id: newVariantId, quantity: item.quantity })
      notification(
        t("order-line-success", "Success"),
        t("order-line-item-added", "Item added"),
        "success"
      )
    } catch (e) {
      notification(
        t("order-line-error", "Error"),
        t(
          "order-line-failed-to-replace-the-item",
          "Failed to replace the item"
        ),
        "error"
      )
    }
  }

  const replaceProductVariantScreen = {
    title: t("order-line-replace-product-variants", "Replace Product Variants"),
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
      label: t("order-line-replace-with-other-item", "Replace with other item"),
      onClick: () => push(replaceProductVariantScreen),
      icon: <RefreshIcon size="20" />,
    },
    {
      label: t("order-line-duplicate-item", "Duplicate item"),
      onClick: onDuplicate,
      icon: <DuplicateIcon size="20" />,
    },
    !isLocked && {
      label: t("order-line-remove-item", "Remove item"),
      onClick: onRemove,
      variant: "danger",
      icon: <TrashIcon size="20" />,
    },
  ].filter(Boolean)

  return (
    <Tooltip
      side="top"
      open={isLocked ? undefined : false}
      content={t(
        "order-line-line-item-cannot-be-edited",
        "This line item is part of a fulfillment and cannot be edited. Cancel the fulfillment to edit the line item."
      )}
    >
      <div className="hover:bg-grey-5 rounded-rounded mx-[-5px] mb-1 flex h-[64px] justify-between px-[5px] py-2">
        <div className="flex-grow-1 flex justify-center gap-x-4">
          <div className="rounded-rounded flex h-[48px] w-[36px] overflow-hidden">
            {item.thumbnail ? (
              <img src={item.thumbnail} className="object-cover" />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex max-w-[310px] items-center gap-2">
              <span
                className={clsx(
                  "text-grey-900 flex-shrink-0 flex-grow font-semibold",
                  {
                    "text-gray-400": isLocked,
                  }
                )}
              >
                {item.title}
              </span>
              {item?.variant?.options && (
                <span
                  className={clsx(
                    "flex-shrink-1 flex gap-3 truncate text-gray-400",
                    {
                      "text-gray-400": isLocked,
                    }
                  )}
                >
                  ({item.variant.options.map((o) => o.value).join(" • ")})
                </span>
              )}
            </div>
            <div className="flex items-center">
              {isNew && (
                <div className="text-small bg-blue-10 rounded-rounded me-2 flex h-[24px] w-[42px] flex-shrink-0 items-center justify-center text-blue-500">
                  {t("order-line-new", "New")}
                </div>
              )}

              {isModified && (
                <div className="text-small bg-orange-10 rounded-rounded me-2 flex h-[24px] w-[68px] flex-shrink-0 items-center justify-center text-orange-500">
                  {t("order-line-modified", "Modified")}
                </div>
              )}

              <div className="min-h-[20px]">
                {item.variant?.sku && (
                  <CopyToClipboard
                    value={item.variant?.sku}
                    displayValue={
                      <span
                        className={clsx("flex gap-3 text-gray-500", {
                          "text-gray-400": isLocked,
                        })}
                      >
                        {item.variant?.sku}
                      </span>
                    }
                    successDuration={1000}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-w-[312px] items-center justify-between">
          <div
            className={clsx("flex flex-grow-0 items-center text-gray-400", {
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
              className={clsx("min-w-[74px] px-8 text-center text-gray-900", {
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

          <div className="flex h-full items-center gap-6">
            <div
              className={clsx(
                "small:gap-x-2 medium:gap-x-4 large:gap-x-6 flex",
                { "pointer-events-none !text-gray-400": isLocked }
              )}
            >
              <div
                className={clsx("min-w-[60px] text-end text-gray-900", {
                  "pointer-events-none !text-gray-400": isLocked,
                })}
              >
                {formatAmountWithSymbol({
                  amount: item.unit_price * item.quantity,
                  currency: currencyCode,
                  tax: item.includes_tax ? 0 : item.tax_lines,
                  digits: 2,
                })}
                <span className="ms-2 text-gray-400">
                  {currencyCode.toUpperCase()}
                </span>
              </div>
            </div>
            <Actionables forceDropdown actions={actions} />
          </div>
        </div>
      </div>
    </Tooltip>
  )
}

export default OrderEditLine
