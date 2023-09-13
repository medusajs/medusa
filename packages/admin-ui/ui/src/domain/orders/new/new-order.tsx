import { useAdminCreateDraftOrder } from "medusa-react"
import React from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LayeredModalContext } from "../../../components/molecules/modal/layered-modal"
import SteppedModal, {
  SteppedContext,
} from "../../../components/molecules/modal/stepped-modal"
import useNotification from "../../../hooks/use-notification"
import isNullishObject from "../../../utils/is-nullish-object"
import Billing from "./components/billing-details"
import Items from "./components/items"
import SelectRegionScreen from "./components/select-region"
import SelectShippingMethod from "./components/select-shipping"
import ShippingDetails from "./components/shipping-details"
import Summary from "./components/summary"
import { useNewOrderForm } from "./form"

type NewOrderProps = {
  onDismiss: () => void
}

const NewOrder = ({ onDismiss }: NewOrderProps) => {
  const steppedContext = React.useContext(SteppedContext)
  const layeredContext = React.useContext(LayeredModalContext)

  const { t } = useTranslation()
  const navigate = useNavigate()
  const notification = useNotification()
  const { mutate } = useAdminCreateDraftOrder()

  const {
    form: { handleSubmit, reset },
    context: { region },
  } = useNewOrderForm()

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        email: data.email,
        items: data.items.map((i) => {
          if (i.variant_id) {
            return {
              quantity: i.quantity,
              variant_id: i.variant_id,
            }
          } else {
            return {
              quantity: i.quantity,
              title: i.title,
              unit_price: i.unit_price,
            }
          }
        }),
        region_id: data.region.value,
        shipping_methods: [
          {
            option_id: data.shipping_option.value,
            price:
              typeof data.custom_shipping_price === "number"
                ? data.custom_shipping_price
                : undefined,
          },
        ],
        shipping_address: data.shipping_address_id
          ? data.shipping_address_id
          : !isNullishObject(data.shipping_address)
          ? {
              address_1: data.shipping_address?.address_1,
              address_2: data.shipping_address?.address_2 || undefined,
              city: data.shipping_address?.city,
              country_code: data.shipping_address?.country_code?.value,
              company: data.shipping_address?.company || undefined,
              first_name: data.shipping_address?.first_name,
              last_name: data.shipping_address?.last_name,
              phone: data.shipping_address?.phone || undefined,
              postal_code: data.shipping_address?.postal_code,
              province: data.shipping_address?.province || undefined,
            }
          : undefined,
        billing_address: data.billing_address_id
          ? data.billing_address_id
          : data.billing_address
          ? {
              address_1: data.billing_address?.address_1,
              address_2: data.billing_address?.address_2 || undefined,
              city: data.billing_address?.city,
              country_code: data.billing_address?.country_code?.value,
              company: data.billing_address?.company || undefined,
              first_name: data.billing_address?.first_name,
              last_name: data.billing_address?.last_name,
              phone: data.billing_address?.phone || undefined,
              postal_code: data.billing_address?.postal_code,
              province: data.billing_address?.province || undefined,
            }
          : undefined,
        customer_id: data.customer_id?.value,
        discounts: data.discount_code
          ? [{ code: data.discount_code }]
          : undefined,
      },
      {
        onSuccess: ({ draft_order }) => {
          notification(
            t("new-success", "Success"),
            t("new-order-created", "Order created"),
            "success"
          )
          reset()
          onDismiss()
          steppedContext.reset()
          navigate(`/a/draft-orders/${draft_order.id}`)
        },
        onError: (error) => {
          notification(t("new-error", "Error"), error.message, "error")
        },
      }
    )
  })

  return (
    <SteppedModal
      layeredContext={layeredContext}
      context={steppedContext}
      onSubmit={onSubmit}
      steps={[
        <SelectRegionScreen />,
        <Items />,
        <SelectShippingMethod />,
        <ShippingDetails />,
        <Billing />,
        <Summary />,
      ]}
      lastScreenIsSummary={true}
      title={t("new-create-draft-order", "Create Draft Order")}
      handleClose={onDismiss}
    />
  )
}

export default NewOrder
