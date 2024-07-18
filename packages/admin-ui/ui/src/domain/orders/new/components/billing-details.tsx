import clsx from "clsx"
import { useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import AddressForm, {
  AddressType,
} from "../../../../components/templates/address-form"
import isNullishObject from "../../../../utils/is-nullish-object"
import { nestedForm } from "../../../../utils/nested-form"
import { useNewOrderForm } from "../form"

const Billing = () => {
  const { t } = useTranslation()
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
      <span className="inter-base-semibold">
        {t("components-billing-address", "Billing Address")}
      </span>
      {!isNullishObject(shippingAddress) || shippingAddressId ? (
        <div
          className="mb-6 mt-4 flex cursor-pointer items-center"
          onClick={updateSameAsShipping}
        >
          <div
            className={`text-grey-0 border-grey-30 rounded-base flex h-5 w-5 justify-center border ${
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
          <span className="text-grey-90 ms-3">
            {t("components-use-same-as-shipping", "Use same as shipping")}
          </span>
        </div>
      ) : null}
      <div
        className={clsx({ "pointer-events-none opacity-50": sameAsShipping })}
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
