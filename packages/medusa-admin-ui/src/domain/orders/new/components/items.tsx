import { ProductVariant } from "@medusajs/medusa"
import clsx from "clsx"
import React, { useContext, useEffect, useState } from "react"
import { Controller } from "react-hook-form"

import Button from "../../../../components/fundamentals/button"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import InputField from "../../../../components/molecules/input"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import Table from "../../../../components/molecules/table"
import {
  displayAmount,
  extractUnitPrice,
  getNativeSymbol,
  persistedPrice,
} from "../../../../utils/prices"
import RMASelectProductSubModal from "../../details/rma-sub-modals/products"
import { useNewOrderForm } from "../form"
import CustomItemSubModal from "./custom-item-sub-modal"

const Items = () => {
  const { enableNextPage, disableNextPage, nextStepEnabled } = React.useContext(
    SteppedContext
  )

  const {
    context: { region, items },
    form: { control, register, setValue, getValues },
  } = useNewOrderForm()
  const { fields, append, remove } = items

  const [editQuantity, setEditQuantity] = useState(-1)
  const [editPrice, setEditPrice] = useState(-1)

  const layeredContext = useContext(LayeredModalContext)

  const addItem = (variants: ProductVariant[]) => {
    const ids = fields.map((field) => field.variant_id)
    const itemsToAdd = variants.filter((v) => !ids.includes(v.id))

    append(
      itemsToAdd.map((item) => ({
        quantity: 1,
        variant_id: item.id,
        title: item.title,
        unit_price: extractUnitPrice(item, region, false),
        product_title: item.product.title,
        thumbnail: item.product.thumbnail,
      }))
    )

    if (!nextStepEnabled) {
      enableNextPage()
    }
  }

  const handleEditQuantity = (index: number, value: number) => {
    const oldQuantity = getValues(`items.${index}.quantity`)
    const newQuantity = +oldQuantity + value

    if (newQuantity > 0) {
      setValue(`items.${index}.quantity`, newQuantity)
    }
  }

  const handlePriceChange = (
    index: number,
    value: number,
    currency: string
  ) => {
    const dbPrice = persistedPrice(currency, value)
    setValue(`items.${index}.unit_price`, dbPrice)
  }

  const addCustomItem = (title: string, quantity: number, amount: number) => {
    append({
      title,
      unit_price: amount,
      quantity: quantity,
    })

    if (!nextStepEnabled) {
      enableNextPage()
    }
  }

  const removeItem = (index: number) => {
    remove(index)

    if (nextStepEnabled && items.fields.length < 1) {
      disableNextPage()
    }
  }

  useEffect(() => {
    if (items.fields.length) {
      enableNextPage()
    } else {
      disableNextPage()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-[705px] pt-4">
      <span className="inter-base-semibold mb-4">Items for the order</span>
      {fields.length > 0 && region && (
        <Table>
          <Table.Head>
            <Table.HeadRow className="text-grey-50 border-t inter-small-semibold">
              <Table.HeadCell>Details</Table.HeadCell>
              <Table.HeadCell className="text-right pr-8">
                Quantity
              </Table.HeadCell>
              <Table.HeadCell className="text-right">
                Price (excl. Taxes)
              </Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.HeadRow>
          </Table.Head>
          <Table.Body>
            {fields.map((item, index) => {
              return (
                <Table.Row
                  key={item.id}
                  className={clsx("border-b-grey-0 hover:bg-grey-0")}
                >
                  <Table.Cell>
                    <div className="min-w-[240px] flex items-center py-2">
                      <div className="w-[30px] h-[40px] ">
                        {item.thumbnail ? (
                          <img
                            className="h-full w-full object-cover rounded"
                            src={item.thumbnail}
                          />
                        ) : (
                          <ImagePlaceholder />
                        )}
                      </div>
                      <div className="inter-small-regular text-grey-50 flex flex-col ml-4">
                        {item.product_title && (
                          <span className="text-grey-90">
                            {item.product_title}
                          </span>
                        )}
                        <span>{item.title}</span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-right w-32 pr-8">
                    {editQuantity === index ? (
                      <InputField
                        type="number"
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        onBlur={() => setEditQuantity(-1)}
                      />
                    ) : (
                      <div className="flex w-full text-right justify-end text-grey-50 ">
                        <span
                          onClick={() => handleEditQuantity(index, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 mr-2"
                        >
                          <MinusIcon size={16} />
                        </span>
                        <button
                          type="button"
                          className="px-1 hover:bg-grey-20 rounded cursor-pointer"
                          onClick={() => setEditQuantity(index)}
                        >
                          <input
                            type="number"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            className="bg-transparent w-full text-center text-grey-90"
                            disabled
                          />
                        </button>
                        <span
                          onClick={() => handleEditQuantity(index, 1)}
                          className={clsx(
                            "w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 ml-2"
                          )}
                        >
                          <PlusIcon size={16} />
                        </span>
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {editPrice === index ? (
                      <Controller
                        control={control}
                        name={`items.${index}.unit_price`}
                        render={({ field: { value } }) => {
                          return (
                            <InputField
                              type="number"
                              value={displayAmount(region.currency_code, value)}
                              onBlur={() => {
                                setEditPrice(-1)
                              }}
                              prefix={getNativeSymbol(region.currency_code)}
                              onChange={(e) => {
                                handlePriceChange(
                                  index,
                                  +e.target.value,
                                  region.currency_code
                                )
                              }}
                            />
                          )
                        }}
                      />
                    ) : (
                      <Controller
                        name={`items.${index}.unit_price`}
                        control={control}
                        render={({ field: { value } }) => {
                          return (
                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                setEditPrice(index)
                              }}
                            >
                              {displayAmount(region!.currency_code, value)}
                            </span>
                          )
                        }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-right text-grey-40 pr-1">
                    {region!.currency_code.toUpperCase()}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => removeItem(index)}
                    >
                      <TrashIcon size={20} className="text-grey-50" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      )}
      <div className="flex w-full justify-end mt-3 gap-x-xsmall">
        <Button
          variant="ghost"
          size="small"
          className="border border-grey-20"
          onClick={() => {
            layeredContext.push(
              CreateCustomProductScreen(
                layeredContext.pop,
                addCustomItem,
                region
              )
            )
          }}
        >
          <PlusIcon size={20} />
          Add Custom
        </Button>
        <Button
          variant="ghost"
          size="small"
          className="border border-grey-20"
          onClick={() => {
            layeredContext.push(
              SelectProductsScreen(
                layeredContext.pop,
                items.fields.map((item) => ({ id: item.variant_id })),
                addItem
              )
            )
          }}
        >
          <PlusIcon size={20} />
          Add Existing
        </Button>
      </div>
    </div>
  )
}

const SelectProductsScreen = (pop, itemsToAdd, setSelectedItems) => {
  return {
    title: "Add Products",
    onBack: () => pop(),
    view: (
      <RMASelectProductSubModal
        selectedItems={itemsToAdd || []}
        onSubmit={setSelectedItems}
      />
    ),
  }
}

const CreateCustomProductScreen = (pop, onSubmit, region) => {
  return {
    title: "Add Custom Item",
    onBack: () => pop(),
    view: <CustomItemSubModal onSubmit={onSubmit} region={region} />,
  }
}

export default Items
