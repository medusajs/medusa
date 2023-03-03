import { Product } from "@medusajs/medusa"
import { useAdminCreateVariant } from "medusa-react"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import FormValidator from "../../../utils/form-validator"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import IconTooltip from "../../molecules/icon-tooltip"
import Modal from "../../molecules/modal"
import CurrencyInput from "../currency-input"
import { useValuesFieldArray } from "./use-values-field-array"

type AddDenominationModalProps = {
  giftCard: Omit<Product, "beforeInsert">
  storeCurrency: string
  currencyCodes: string[]
  handleClose: () => void
}

const AddDenominationModal: React.FC<AddDenominationModalProps> = ({
  giftCard,
  storeCurrency,
  currencyCodes,
  handleClose,
}) => {
  const { watch, handleSubmit, control } = useForm<{
    default_price: number
    prices: {
      price: {
        amount: number
        currency_code: string
      }
    }[]
  }>()
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateVariant(giftCard.id)

  // passed to useValuesFieldArray so new prices are intialized with the currenct default price
  const defaultValue = watch("default_price", 10000)

  const {
    fields,
    appendPrice,
    deletePrice,
    availableCurrencies,
  } = useValuesFieldArray(
    currencyCodes,
    {
      control,
      name: "prices",
      keyName: "indexId",
    },
    {
      defaultAmount: defaultValue,
      defaultCurrencyCode: storeCurrency,
    }
  )

  const onSubmit = async (data: any) => {
    const prices = [
      {
        amount: data.default_price,
        currency_code: storeCurrency,
      },
    ]

    if (data.prices) {
      data.prices.forEach((p) => {
        prices.push({
          amount: p.price.amount,
          currency_code: p.price.currency_code,
        })
      })
    }

    mutate(
      {
        title: `${giftCard.variants.length}`,
        options: [
          {
            value: `${data.default_price}`,
            option_id: giftCard.options[0].id,
          },
        ],
        prices,
        inventory_quantity: 0,
        manage_inventory: false,
      },
      {
        onSuccess: () => {
          notification("Success", "Denomination added successfully", "success")
          handleClose()
        },
        onError: (error) => {
          const errorMessage = () => {
            // @ts-ignore
            if (error.response?.data?.type === "duplicate_error") {
              return `A denomination with that default value already exists`
            } else {
              return getErrorMessage(error)
            }
          }

          notification("Error", errorMessage(), "error")
        },
      }
    )
  }

  return (
    <Modal handleClose={handleClose} isLargeModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Add Denomination</span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex-1 mb-xlarge">
              <div className="flex gap-x-2 mb-base">
                <h3 className="inter-base-semibold">Default Value</h3>
                <IconTooltip content="This is the denomination in your store's default currency" />
              </div>
              <Controller
                control={control}
                name="default_price"
                rules={{
                  required: "Default value is required",
                  max: FormValidator.maxInteger("Default value", storeCurrency),
                }}
                render={({ field: { onChange, value, ref } }) => {
                  return (
                    <CurrencyInput.Root
                      currentCurrency={storeCurrency}
                      readOnly
                      size="medium"
                    >
                      <CurrencyInput.Amount
                        ref={ref}
                        label="Amount"
                        amount={value}
                        onChange={onChange}
                      />
                    </CurrencyInput.Root>
                  )
                }}
              />
            </div>
            <div>
              <div className="flex gap-x-2 mb-base">
                <h3 className="inter-base-semibold">Other Values</h3>
                <IconTooltip content="Here you can add values in other currencies" />
              </div>
              <div className="flex flex-col gap-y-xsmall">
                {fields.map((field, index) => {
                  return (
                    <div
                      key={field.indexId}
                      className="last:mb-0 mb-xsmall flex items-end"
                    >
                      <div className="flex-1">
                        <Controller
                          control={control}
                          key={field.indexId}
                          name={`prices.${index}.price`}
                          rules={{
                            required: FormValidator.required("Price"),
                            validate: (val) => {
                              return FormValidator.validateMaxInteger(
                                "Price",
                                val.amount,
                                val.currency_code
                              )
                            },
                          }}
                          defaultValue={field.price}
                          render={({ field: { onChange, value } }) => {
                            const codes = [
                              value?.currency_code,
                              ...availableCurrencies,
                            ]
                            codes.sort()
                            return (
                              <CurrencyInput.Root
                                currencyCodes={codes}
                                currentCurrency={value?.currency_code}
                                size="medium"
                                readOnly={index === 0}
                                onChange={(code) =>
                                  onChange({ ...value, currency_code: code })
                                }
                              >
                                <CurrencyInput.Amount
                                  label="Amount"
                                  onChange={(amount) =>
                                    onChange({ ...value, amount })
                                  }
                                  amount={value?.amount}
                                />
                              </CurrencyInput.Root>
                            )
                          }}
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="small"
                        className="ml-large w-10 h-10"
                        type="button"
                      >
                        <TrashIcon
                          onClick={deletePrice(index)}
                          className="text-grey-40"
                          size="20"
                        />
                      </Button>
                    </div>
                  )
                })}
              </div>
              <div className="mt-large mb-small">
                <Button
                  onClick={appendPrice}
                  type="button"
                  variant="ghost"
                  size="small"
                  disabled={availableCurrencies?.length === 0}
                >
                  <PlusIcon size={20} />
                  Add a price
                </Button>
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="w-full flex justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2 min-w-[130px] justify-center"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                className="mr-2 min-w-[130px] justify-center"
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default AddDenominationModal
