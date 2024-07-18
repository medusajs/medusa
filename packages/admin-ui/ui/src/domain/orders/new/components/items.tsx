import { Product, ProductVariant, Region } from "@medusajs/medusa"
import clsx from "clsx"
import React, { useContext, useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
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
import { useMedusa } from "medusa-react"

const Items = () => {
  const { t } = useTranslation()
  const { enableNextPage, disableNextPage, nextStepEnabled } =
    React.useContext(SteppedContext)

  const {
    context: { region, items },
    form: { control, register, setValue },
  } = useNewOrderForm()

  const { client } = useMedusa()

  const { fields, append, remove, update } = items

  const [editQuantity, setEditQuantity] = useState(-1)
  const [editPrice, setEditPrice] = useState(-1)

  const layeredContext = useContext(LayeredModalContext)

  const addItem = async (variants: ProductVariant[]) => {
    const ids = fields.map((field) => field.variant_id)

    const itemsToAdd = variants.filter((v) => !ids.includes(v.id))

    const variantIds = itemsToAdd.map((v) => v.id)

    const { variants: newVariants } = await client.admin.variants.list({
      id: variantIds,
      region_id: region?.id,
    })

    append(
      newVariants.map((item) => ({
        quantity: 1,
        variant_id: item.id,
        title: item.title as string,
        unit_price: extractUnitPrice(item, region as Region, false),
        product_title: (item.product as Product)?.title,
        thumbnail: (item.product as Product)?.thumbnail,
      }))
    )

    if (!nextStepEnabled) {
      enableNextPage()
    }
  }

  const handleEditQuantity = (index: number, value: number) => {
    const field = fields[index]
    field.quantity = field.quantity + value

    if (field.quantity > 0) {
      update(index, field)
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
    <div className="flex min-h-[705px] flex-col pt-4">
      <span className="inter-base-semibold mb-4">
        {t("components-items-for-the-order", "Items for the order")}
      </span>
      {fields.length > 0 && region && (
        <Table>
          <Table.Head>
            <Table.HeadRow className="text-grey-50 inter-small-semibold border-t">
              <Table.HeadCell>
                {t("components-details", "Details")}
              </Table.HeadCell>
              <Table.HeadCell className="pe-8 text-end">
                {t("components-quantity", "Quantity")}
              </Table.HeadCell>
              <Table.HeadCell className="text-end">
                {t("components-price-excl-taxes", "Price (excl. Taxes)")}
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
                    <div className="flex min-w-[240px] items-center py-2">
                      <div className="h-[40px] w-[30px] ">
                        {item.thumbnail ? (
                          <img
                            className="h-full w-full rounded object-cover"
                            src={item.thumbnail}
                          />
                        ) : (
                          <ImagePlaceholder />
                        )}
                      </div>
                      <div className="inter-small-regular text-grey-50 ms-4 flex flex-col">
                        {item.product_title && (
                          <span className="text-grey-90">
                            {item.product_title}
                          </span>
                        )}
                        <span>{item.title}</span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="w-32 pe-8 text-end">
                    {editQuantity === index ? (
                      <InputField
                        type="number"
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        onBlur={() => setEditQuantity(-1)}
                      />
                    ) : (
                      <div className="text-grey-50 flex w-full justify-end text-end ">
                        <span
                          onClick={() => handleEditQuantity(index, -1)}
                          className="hover:bg-grey-20 me-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded"
                        >
                          <MinusIcon size={16} />
                        </span>
                        <button
                          type="button"
                          className="hover:bg-grey-20 cursor-pointer rounded px-1"
                          onClick={() => setEditQuantity(index)}
                        >
                          <input
                            type="number"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            className="text-grey-90 w-full bg-transparent text-center"
                            disabled
                          />
                        </button>
                        <span
                          onClick={() => handleEditQuantity(index, 1)}
                          className={clsx(
                            "hover:bg-grey-20 ms-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded"
                          )}
                        >
                          <PlusIcon size={16} />
                        </span>
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-end">
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
                  <Table.Cell className="text-grey-40 pe-1 text-end">
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
      <div className="gap-x-xsmall mt-3 flex w-full justify-end">
        <Button
          variant="ghost"
          size="small"
          className="border-grey-20 border"
          onClick={() => {
            layeredContext.push(
              CreateCustomProductScreen(
                layeredContext.pop,
                addCustomItem,
                region,
                t
              )
            )
          }}
        >
          <PlusIcon size={20} />
          {t("components-add-custom", "Add Custom")}
        </Button>
        <Button
          variant="ghost"
          size="small"
          className="border-grey-20 border"
          onClick={() => {
            layeredContext.push(
              SelectProductsScreen(
                layeredContext.pop,
                items.fields.map((item) => ({ id: item.variant_id })),
                addItem,
                t
              )
            )
          }}
        >
          <PlusIcon size={20} />
          {t("components-add-existing", "Add Existing")}
        </Button>
      </div>
    </div>
  )
}

const SelectProductsScreen = (pop, itemsToAdd, setSelectedItems, t) => {
  return {
    title: t("components-add-products", "Add Products"),
    onBack: () => pop(),
    view: (
      <RMASelectProductSubModal
        selectedItems={itemsToAdd || []}
        onSubmit={setSelectedItems}
      />
    ),
  }
}

const CreateCustomProductScreen = (pop, onSubmit, region, t) => {
  return {
    title: t("components-add-custom-item", "Add Custom Item"),
    onBack: () => pop(),
    view: <CustomItemSubModal onSubmit={onSubmit} region={region} />,
  }
}

export default Items
