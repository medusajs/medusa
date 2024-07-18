import { createColumnHelper } from "@tanstack/react-table"
import React, { useCallback, useMemo } from "react"
import { Controller, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ItemsToReturnFormType, ReturnItemObject } from "."
import CopyToClipboard from "../../../../components/atoms/copy-to-clipboard"
import { Thumbnail } from "../../../../components/atoms/thumbnail/thumbnail"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import TableQuantitySelector from "../table-quantity-selector"

const columnHelper = createColumnHelper<ReturnItemObject>()

type Props = {
  form: NestedForm<ItemsToReturnFormType>
  orderCurrency: string
}

export const useItemsToReturnColumns = ({ form, orderCurrency }: Props) => {
  const { t } = useTranslation()
  const { control, setValue, getValues, path } = form

  const updateQuantity = useCallback(
    (index: number, change: number) => {
      const pathToQuantity = path(`items.${index}.quantity`)
      const selectedQuantity = getValues(pathToQuantity)

      setValue(pathToQuantity, selectedQuantity + change)

      if (selectedQuantity + change === 0) {
        setValue(path(`items.${index}.return`), false, {
          shouldDirty: true,
        })
      }
    },
    [getValues, path, setValue]
  )

  const items = useWatch({
    control,
    name: path("items"),
  })

  const toggleAllRowsSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      items.forEach((_item, index) => {
        setValue(path(`items.${index}.return`), e.target.checked, {
          shouldDirty: true,
        })
      })
    },
    [items, path, setValue]
  )

  const colums = useMemo(
    () => [
      columnHelper.display({
        id: "selection",
        maxSize: 36,
        header: ({ table }) => {
          return (
            <div className="ps-base pe-large">
              <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                onChange={(e) => {
                  table.toggleAllRowsSelected(e.target.checked)
                  table.toggleAllRowsExpanded(e.target.checked)
                  toggleAllRowsSelected(e)
                }}
                indeterminate={table.getIsSomeRowsSelected()}
              />
            </div>
          )
        },
        cell: ({
          row: { index, getToggleSelectedHandler, toggleExpanded },
        }) => {
          return (
            <Controller
              control={control}
              name={path(`items.${index}.return`)}
              render={({ field: { value, onChange } }) => {
                return (
                  <div className="ps-base pe-large">
                    <IndeterminateCheckbox
                      checked={value}
                      onChange={(v: React.ChangeEvent<HTMLInputElement>) => {
                        getToggleSelectedHandler()(v)
                        toggleExpanded(v.target.checked)
                        onChange(v)
                      }}
                    />
                  </div>
                )
              }}
            />
          )
        },
      }),
      columnHelper.accessor("variant_title", {
        header: t("items-to-return-form-product", "Product"),
        cell: ({ getValue, row: { original } }) => {
          const value = getValue()

          return (
            <div className="gap-x-base py-xsmall flex items-center">
              <div>
                <Thumbnail src={original.thumbnail} />
              </div>
              <div className="inter-small-regular">
                <div className="gap-x-2xsmall flex items-center">
                  <p>{original.product_title}</p>
                  {value && <p className="text-grey-50">({value})</p>}
                </div>
                {original.sku && (
                  <span>
                    <CopyToClipboard
                      value={original.sku}
                      displayValue={original.sku}
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
            {t("items-to-return-form-quantity", "Quantity")}
          </p>
        ),
        maxSize: 50,
        cell: ({
          row: {
            index,
            original: { original_quantity },
          },
        }) => {
          return (
            <TableQuantitySelector
              {...{
                index,
                maxQuantity: original_quantity,
                isSelectable: true,
                control,
                path,
                updateQuantity,
                name: path(`items.${index}.quantity`),
                isSelectedPath: path(`items.${index}.return`),
              }}
              key={index}
            />
          )
        },
      }),
      columnHelper.accessor("refundable", {
        maxSize: 80,
        header: () => (
          <p className="text-end">
            {t("items-to-return-form-refundable", "Refundable")}
          </p>
        ),
        cell: ({ getValue }) => {
          return (
            <p className="text-end">
              {formatAmountWithSymbol({
                amount: getValue() || 0,
                currency: orderCurrency,
              })}
            </p>
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
    ],
    [control, orderCurrency, path, toggleAllRowsSelected, updateQuantity]
  )

  return colums
}
