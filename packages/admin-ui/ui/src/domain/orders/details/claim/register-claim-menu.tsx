import { ClaimReason, Order } from "@medusajs/medusa"
import { useAdminCreateClaim } from "medusa-react"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  useLayeredModal,
} from "../../../../components/molecules/modal/layered-modal"
import { AddressPayload } from "../../../../components/templates/address-form"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import ClaimTypeForm, {
  ClaimTypeFormType,
} from "../../components/claim-type-form"
import ItemsToReturnForm, {
  ItemsToReturnFormType,
} from "../../components/items-to-return-form"
import ItemsToSendForm, {
  ItemsToSendFormType,
} from "../../components/items-to-send-form"
import { RefundAmountFormType } from "../../components/refund-amount-form"
import { ClaimSummary } from "../../components/rma-summaries"
import SendNotificationForm, {
  SendNotificationFormType,
} from "../../components/send-notification-form"
import ShippingAddressForm from "../../components/shipping-address-form"
import ShippingForm, { ShippingFormType } from "../../components/shipping-form"
import { getDefaultClaimValues } from "../utils/get-default-values"

export type CreateClaimFormType = {
  notification: SendNotificationFormType
  return_items: ItemsToReturnFormType
  additional_items: ItemsToSendFormType
  return_shipping: ShippingFormType
  replacement_shipping: ShippingFormType
  shipping_address: AddressPayload
  claim_type: ClaimTypeFormType
  refund_amount: RefundAmountFormType
}

type Props = {
  order: Order
  onClose: () => void
}

const RegisterClaimMenu = ({ order, onClose }: Props) => {
  const context = useLayeredModal()
  const { mutate, isLoading } = useAdminCreateClaim(order.id)

  const form = useForm<CreateClaimFormType>({
    defaultValues: getDefaultClaimValues(order),
  })
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    setError,
  } = form

  const notification = useNotification()
  const dialog = useImperativeDialog()

  useEffect(() => {
    reset(getDefaultClaimValues(order))
  }, [order, reset])

  const handleClose = () => {
    context.reset()
    onClose()
  }

  const onCancel = async () => {
    let shouldClose = true

    if (isDirty) {
      shouldClose = await dialog({
        heading: "Are you sure you want to close?",
        text: "You have unsaved changes, are you sure you want to close?",
      })
    }

    if (shouldClose) {
      handleClose()
    }
  }

  const onSubmit = handleSubmit((data) => {
    const type = data.claim_type.type
    const returnShipping = data.return_shipping
    const refundAmount = data.refund_amount?.amount

    const replacementShipping =
      type === "replace" && data.replacement_shipping.option
        ? {
            option_id: data.replacement_shipping.option.value.id,
            /**
             * We set the price to 0 as we don't want to make the shippng price
             * affect the refund amount currently. This is a temporary solution,
             * and users should instead use the refund amount field to specify
             * the amount to refund when they receive the returned items if they
             * wish to deduct the cost of shipping.
             */
            price: 0,
          }
        : undefined

    const items = data.return_items.items
      .filter((item) => item.return)
      .map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
        note: item.return_reason_details.note || undefined,
        reason: item.return_reason_details.reason?.value as ClaimReason,
      }))

    const returnItemsMissingReason = items.filter((item) => !item.reason)

    if (returnItemsMissingReason.length > 0) {
      returnItemsMissingReason.forEach((item) => {
        const index = items.findIndex((i) => i.item_id === item.item_id)

        setError(
          `return_items.items.${index}.return_reason_details`,
          {
            type: "manual",
            message: "Please select a reason",
          },
          { shouldFocus: true }
        )
      })

      return
    }

    if (type === "replace" && !data.replacement_shipping.option) {
      setError(
        `replacement_shipping.option`,
        {
          type: "manual",
          message: "A shipping method for replacement items is required",
        },
        { shouldFocus: true }
      )
      return
    }

    mutate(
      {
        claim_items: items,
        type: type,
        return_shipping: returnShipping.option
          ? {
              option_id: returnShipping.option.value.id,
              price: 0,
            }
          : undefined,
        additional_items:
          type === "replace"
            ? data.additional_items.items.map((item) => ({
                quantity: item.quantity,
                variant_id: item.variant_id,
              }))
            : undefined,
        no_notification: !data.notification.send_notification,
        refund_amount:
          type === "refund" && refundAmount !== undefined
            ? refundAmount
            : undefined,
        shipping_address:
          type === "replace"
            ? {
                address_1: data.shipping_address.address_1,
                address_2: data.shipping_address.address_2 || undefined,
                city: data.shipping_address.city,
                country_code: data.shipping_address.country_code.value,
                company: data.shipping_address.company || undefined,
                first_name: data.shipping_address.first_name,
                last_name: data.shipping_address.last_name,
                phone: data.shipping_address.phone || undefined,
                postal_code: data.shipping_address.postal_code,
                province: data.shipping_address.province || undefined,
              }
            : undefined,
        shipping_methods: replacementShipping
          ? [replacementShipping]
          : undefined,
      },
      {
        onSuccess: () => {
          notification(
            "Successfully created claim",
            `A claim for order #${order.display_id} was successfully created`,
            "success"
          )
          handleClose()
        },
        onError: (err) => {
          notification("Error creating claim", getErrorMessage(err), "error")
        },
      }
    )
  })

  const watchedType = useWatch({
    control: form.control,
    name: "claim_type.type",
  })

  const watchedItems = useWatch({
    control: form.control,
    name: "return_items.items",
  })

  return (
    <LayeredModal
      open={true}
      handleClose={onCancel}
      context={context}
      isLargeModal
    >
      <Modal.Body>
        <Modal.Header handleClose={onCancel}>
          <h1 className="inter-xlarge-semibold">Create Claim</h1>
        </Modal.Header>
        <form onSubmit={onSubmit} data-testid="register-claim-form">
          <Modal.Content>
            <div className="flex flex-col gap-y-xlarge">
              <ItemsToReturnForm
                form={nestedForm(form, "return_items")}
                order={order}
                isClaim={true}
              />
              <ShippingForm
                form={nestedForm(form, "return_shipping")}
                order={order}
                isReturn={true}
                isClaim={true}
              />
              <ClaimTypeForm form={nestedForm(form, "claim_type")} />
              {watchedType === "replace" && (
                <>
                  <ItemsToSendForm
                    form={nestedForm(form, "additional_items")}
                    order={order}
                  />
                  <ShippingAddressForm
                    form={nestedForm(form, "shipping_address")}
                    order={order}
                  />
                  <ShippingForm
                    form={nestedForm(form, "replacement_shipping")}
                    isClaim={true}
                    order={order}
                  />
                </>
              )}
              <ClaimSummary form={form} order={order} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-between">
              <SendNotificationForm
                form={nestedForm(form, "notification")}
                type="claim"
              />
              <div className="flex items-center justify-end gap-x-xsmall">
                <Button
                  variant="secondary"
                  size="small"
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  disabled={!isDirty || isLoading || watchedItems?.length < 1}
                >
                  Submit and close
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </LayeredModal>
  )
}

export default RegisterClaimMenu
