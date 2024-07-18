import { createColumnHelper } from "@tanstack/react-table"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import CopyToClipboard from "../../../../components/atoms/copy-to-clipboard"
import Thumbnail from "../../../../components/atoms/thumbnail"
import Tooltip from "../../../../components/atoms/tooltip"
import Button from "../../../../components/fundamentals/button"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import TableQuantitySelector from "../table-quantity-selector"
import { AdditionalItemObject, ItemsToSendFormType } from "./index"

const columnHelper = createColumnHelper<AdditionalItemObject>()

type AdditionalItemsColumnProps = {
  form: NestedForm<ItemsToSendFormType>
  orderCurrency: string
  removeItem: (index: number) => void
}

export const useAdditionalItemsColumns = ({
  form,
  orderCurrency,
  removeItem,
}: AdditionalItemsColumnProps) => {
  const { t } = useTranslation()
  const { control, setValue, getValues, path } = form

  const updateQuantity = useCallback(
    (index: number, change: number) => {
      const pathToQuantity = path(`items.${index}.quantity`)
      const selectedQuantity = getValues(pathToQuantity)

      setValue(pathToQuantity, selectedQuantity + change)
    },
    [getValues, path, setValue]
  )

  const columns = useMemo(() => {
    return [
      columnHelper.display({
        id: "product_display",
        header: t("items-to-send-form-product", "Product"),
        cell: ({
          row: {
            original: { thumbnail, product_title, variant_title, sku },
          },
        }) => {
          return (
            <div className="gap-base flex items-center">
              <Thumbnail src={thumbnail} />
              <div className="inter-small-regular">
                <div className="gap-x-2xsmall flex items-center">
                  <p>{product_title}</p>
                  {variant_title && (
                    <p className="text-grey-50">({variant_title})</p>
                  )}
                </div>
                {sku && (
                  <span>
                    <CopyToClipboard
                      value={sku}
                      displayValue={sku}
                      iconSize={14}
                    />
                  </span>
                )}
              </div>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "quantity",
        header: () => (
          <p className="text-end">
            {t("items-to-send-form-quantity", "Quantity")}
          </p>
        ),
        maxSize: 50,
        cell: ({
          row: {
            index,
            original: { in_stock },
          },
        }) => {
          return (
            <TableQuantitySelector
              {...{
                index,
                maxQuantity: in_stock,
                control,
                updateQuantity,
                name: path(`items.${index}.quantity`),
                isSelectable: false,
              }}
              key={index}
            />
          )
        },
      }),
      columnHelper.accessor("price", {
        maxSize: 50,
        header: () => (
          <p className="text-end">{t("items-to-send-form-price", "Price")}</p>
        ),
        cell: ({
          getValue,
          row: {
            original: { original_price },
          },
        }) => {
          const price = getValue()

          return (
            <div className="text-end">
              {original_price !== price && (
                <Tooltip
                  content={t(
                    "items-to-send-form-price-overridden-in-price-list-applicable-to-this-order",
                    "The price has been overridden in a price list, that is applicable to this order."
                  )}
                  side="top"
                >
                  <p className="text-grey-40 cursor-default line-through">
                    {formatAmountWithSymbol({
                      amount: original_price,
                      currency: orderCurrency,
                    })}
                  </p>
                </Tooltip>
              )}
              <p>
                {formatAmountWithSymbol({
                  amount: price,
                  currency: orderCurrency,
                })}
              </p>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "order_currency",
        maxSize: 20,
        cell: () => {
          return (
            <p className="ps-base text-grey-50">
              {orderCurrency.toUpperCase()}
            </p>
          )
        },
      }),
      columnHelper.display({
        id: "remove",
        maxSize: 28,
        cell: ({ row: { index } }) => {
          return (
            <div className="flex items-center justify-end">
              <Button
                variant="ghost"
                size="small"
                className="h-xlarge w-xlarge text-grey-40"
                type="button"
                onClick={() => removeItem(index)}
              >
                <TrashIcon size={20} />
              </Button>
            </div>
          )
        },
      }),
    ]
  }, [control, orderCurrency, path, removeItem, updateQuantity])

  return columns
}
