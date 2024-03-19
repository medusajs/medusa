import { Avatar, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { getFormattedAddress } from "../../../../../../lib/addresses"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderCustomerSummary = () => {
  const { form, customer, sameAsShipping, region } = useCreateDraftOrder()
  const { countries } = region || {}

  const { t } = useTranslation()

  const shippingAddress = form.getValues("shipping_address")
  const shippingAddressCountry = countries?.find(
    (c) => c.iso_2 === shippingAddress?.country_code
  )

  const billingAddress = form.getValues("billing_address")
  const billingAddressCountry = countries?.find(
    (c) => c.iso_2 === billingAddress?.country_code
  )

  const email = form.getValues("email")
  const phone =
    shippingAddress?.phone || billingAddress?.phone || customer?.phone

  const { first_name, last_name } = customer || shippingAddress || {}
  const name = [first_name, last_name].filter(Boolean).join(" ")
  const fallback = name
    ? name[0].toUpperCase()
    : email?.[0].toUpperCase() || "?"

  return (
    <div className="text-ui-fg-subtle grid grid-cols-1 gap-2">
      {customer && (
        <div className="grid grid-cols-2">
          <Text size="small" leading="compact">
            {t("fields.id")}
          </Text>
          <div className="flex items-center gap-x-2">
            <Avatar fallback={fallback} size="2xsmall" />
            <Text size="small" leading="compact">
              {name || email}
            </Text>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2">
        <Text size="small" leading="compact">
          {t("fields.email")}
        </Text>
        <Text size="small" leading="compact">
          {email}
        </Text>
      </div>
      <div className="grid grid-cols-2">
        <Text size="small" leading="compact">
          {t("fields.phone")}
        </Text>
        <Text size="small" leading="compact">
          {phone || "-"}
        </Text>
      </div>
      <div className="grid grid-cols-2">
        <Text size="small" leading="compact">
          {t("addresses.shippingAddress.label")}
        </Text>
        <Text size="small" leading="compact">
          {getFormattedAddress({
            address: { ...shippingAddress, country: shippingAddressCountry },
          }).map((line, i) => {
            return (
              <span key={i} className="break-words">
                {line}
                <br />
              </span>
            )
          })}
        </Text>
      </div>
      <div className="grid grid-cols-2">
        <Text size="small" leading="compact">
          {t("addresses.billingAddress.label")}
        </Text>
        {sameAsShipping ? (
          <Text size="small" leading="compact" className="text-ui-fg-muted">
            {t("addresses.billingAddress.sameAsShipping")}
          </Text>
        ) : (
          <Text size="small" leading="compact">
            {getFormattedAddress({
              address: { ...billingAddress, country: billingAddressCountry },
            }).map((line, i) => {
              return (
                <span key={i} className="break-words">
                  {line}
                  <br />
                </span>
              )
            })}
          </Text>
        )}
      </div>
    </div>
  )
}
