import clsx from "clsx"
import React from "react"
import { useWatch } from "react-hook-form"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import AddressForm, {
  AddressType,
} from "../../../../components/templates/address-form"
import isNullishObject from "../../../../utils/is-nullish-object"
import { nestedForm } from "../../../../utils/nested-form"
import { useNewOrderForm } from "../form"

const Billing = () => {
  const {
    context: { validCountries },
    form,
  } = useNewOrderForm()
  const shippingAddress = useWatch({
    control: form.control,
    name: "shipping_address",
  })

  const shippingAddressId = useWatch({
    control: form.control,
    name: "shipping_address_id",
  })

  const sameAsShipping = useWatch({
    control: form.control,
    name: "same_as_shipping",
  })

  const updateSameAsShipping = () => {
    if (!sameAsShipping) {
      form.setValue("billing_address", shippingAddress)
      form.setValue("billing_address_id", shippingAddressId)
    } else {
      form.resetField("billing_address")
      form.resetField("billing_address_id")
    }

    form.setValue("same_as_shipping", !sameAsShipping)
  }

  return (
    <div className="min-h-[705px]">
      <span className="inter-base-semibold">Billing Address</span>
      {!isNullishObject(shippingAddress) || shippingAddressId ? (
        <div
          className="items-center flex mt-4 mb-6 cursor-pointer"
          onClick={updateSameAsShipping}
        >
          <div
            className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
              sameAsShipping && "bg-violet-60"
            }`}
          >
            <span className="self-center">
              {sameAsShipping && <CheckIcon size={16} />}
            </span>
          </div>
          <input
            className="hidden"
            type="checkbox"
            {...form.register("same_as_shipping")}
            tabIndex={-1}
          />
          <span className="ml-3 text-grey-90">Use same as shipping</span>
        </div>
      ) : null}
      <div
        className={clsx({ "opacity-50 pointer-events-none": sameAsShipping })}
        tabIndex={sameAsShipping ? -1 : undefined}
      >
        <AddressForm
          countryOptions={validCountries}
          form={nestedForm(form, "billing_address")}
          type={AddressType.BILLING}
        />
      </div>
    </div>
  )
}

export default Billing
