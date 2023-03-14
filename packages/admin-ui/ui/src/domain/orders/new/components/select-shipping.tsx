import { useContext, useEffect, useState } from "react"
import { Controller, useWatch } from "react-hook-form"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import AlertIcon from "../../../../components/fundamentals/icons/alert-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import Select from "../../../../components/molecules/select"
import CurrencyInput from "../../../../components/organisms/currency-input"
import { extractOptionPrice } from "../../../../utils/prices"
import { useNewOrderForm } from "../form"

const SelectShippingMethod = () => {
  const { disableNextPage, enableNextPage } = useContext(SteppedContext)
  const [showCustomPrice, setShowCustomPrice] = useState(false)

  const {
    context: { region, shippingOptions },
    form: { control, setValue },
  } = useNewOrderForm()

  const currentCustomPrice = useWatch({
    control,
    name: "custom_shipping_price",
  })

  useEffect(() => {
    if (!showCustomPrice && currentCustomPrice) {
      setShowCustomPrice(true)
    }
  }, [currentCustomPrice])

  const selectedShippingOption = useWatch({
    control,
    name: "shipping_option",
  })

  const removeCustomPrice = () => {
    setShowCustomPrice(false)
    setValue("custom_shipping_price", undefined)
  }

  useEffect(() => {
    if (!selectedShippingOption) {
      disableNextPage()
    }

    if (selectedShippingOption) {
      enableNextPage()
    }
  }, [selectedShippingOption])

  return (
    <div className="min-h-[705px]">
      <span className="inter-base-semibold">
        Shipping method{" "}
        <span className="inter-base-regular text-grey-50">
          (To {region!.name})
        </span>
      </span>

      {region ? (
        !shippingOptions?.length ? (
          <div className="inter-small-regular bg-orange-5 rounded-rounded mt-6 flex p-4 text-orange-50">
            <div className="mr-3 h-full">
              <AlertIcon size={20} />
            </div>
            <div className="flex flex-col">
              <span className="inter-small-semibold">Attention!</span>
              You don't have any options for orders without shipping. Please add
              one (e.g. "In-store fulfillment") with "Show on website" unchecked
              in region settings and continue.
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <Controller
              control={control}
              name="shipping_option"
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Choose a shipping method"
                    onChange={onChange}
                    value={value}
                    options={
                      shippingOptions?.map((so) => ({
                        value: so.id,
                        label: `${so.name} - ${extractOptionPrice(
                          so.amount,
                          region
                        )}`,
                      })) || []
                    }
                  />
                )
              }}
            />
            <div className="mt-4">
              {!showCustomPrice && (
                <div className="flex w-full justify-end">
                  <Button
                    variant="ghost"
                    size="small"
                    className="border-grey-20 w-[125px] border"
                    disabled={!selectedShippingOption}
                    onClick={() => setShowCustomPrice(true)}
                  >
                    Set custom price
                  </Button>
                </div>
              )}
              {showCustomPrice && (
                <div className="flex items-center">
                  <div className="w-full">
                    <Controller
                      control={control}
                      name="custom_shipping_price"
                      render={({ field: { value, onChange } }) => {
                        return (
                          <CurrencyInput.Root
                            readOnly
                            size="small"
                            currentCurrency={region.currency_code}
                          >
                            <CurrencyInput.Amount
                              label="Custom Price"
                              amount={value}
                              onChange={onChange}
                            />
                          </CurrencyInput.Root>
                        )
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={removeCustomPrice}
                    className="text-grey-40 ml-8 h-8 w-8"
                  >
                    <TrashIcon size={20} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default SelectShippingMethod
