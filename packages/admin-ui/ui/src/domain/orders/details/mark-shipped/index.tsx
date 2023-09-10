import { Fulfillment } from "@medusajs/medusa"
import {
  useAdminCreateClaimShipment,
  useAdminCreateShipment,
  useAdminCreateSwapShipment,
} from "medusa-react"
import React, { useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

type MarkShippedModalProps = {
  orderId: string
  fulfillment: Fulfillment
  handleCancel: () => void
}

type MarkShippedFormData = {
  tracking_numbers: {
    value: string | undefined
  }[]
}

const MarkShippedModal: React.FC<MarkShippedModalProps> = ({
  orderId,
  fulfillment,
  handleCancel,
}) => {
  const { t } = useTranslation()
  const { control, watch, handleSubmit } = useForm<MarkShippedFormData>({
    defaultValues: {
      tracking_numbers: [{ value: "" }],
    },
    shouldUnregister: true,
  })
  const [noNotis, setNoNotis] = useState(false)

  const {
    fields,
    append: appendTracking,
    remove: removeTracking,
  } = useFieldArray({
    control,
    name: "tracking_numbers",
  })

  const watchedFields = watch("tracking_numbers")

  // Allows us to listen to onChange events
  const trackingNumbers = fields.map((field, index) => ({
    ...field,
    ...watchedFields[index],
  }))

  const markOrderShipped = useAdminCreateShipment(orderId)
  const markSwapShipped = useAdminCreateSwapShipment(orderId)
  const markClaimShipped = useAdminCreateClaimShipment(orderId)

  const isSubmitting =
    markOrderShipped.isLoading ||
    markSwapShipped.isLoading ||
    markClaimShipped.isLoading

  const notification = useNotification()

  const onSubmit = (data: MarkShippedFormData) => {
    const resourceId =
      fulfillment.claim_order_id || fulfillment.swap_id || fulfillment.order_id
    const [type] = resourceId.split("_")

    const tracking_numbers = data.tracking_numbers.map((tn) => tn.value)

    type actionType =
      | typeof markOrderShipped
      | typeof markSwapShipped
      | typeof markClaimShipped

    let action: actionType = markOrderShipped
    let successText = t(
      "mark-shipped-successfully-marked-order-as-shipped",
      "Successfully marked order as shipped"
    )
    let requestObj

    switch (type) {
      case "swap":
        action = markSwapShipped
        requestObj = {
          fulfillment_id: fulfillment.id,
          swap_id: resourceId,
          tracking_numbers,
          no_notification: noNotis,
        }
        successText = t(
          "mark-shipped-successfully-marked-swap-as-shipped",
          "Successfully marked swap as shipped"
        )
        break

      case "claim":
        action = markClaimShipped
        requestObj = {
          fulfillment_id: fulfillment.id,
          claim_id: resourceId,
          tracking_numbers,
        }
        successText = t(
          "mark-shipped-successfully-marked-claim-as-shipped",
          "Successfully marked claim as shipped"
        )
        break

      default:
        requestObj = {
          fulfillment_id: fulfillment.id,
          tracking_numbers,
          no_notification: noNotis,
        }
        break
    }

    action.mutate(requestObj, {
      onSuccess: () => {
        notification(
          t("mark-shipped-success", "Success"),
          successText,
          "success"
        )
        handleCancel()
      },
      onError: (err) =>
        notification(
          t("mark-shipped-error", "Error"),
          getErrorMessage(err),
          "error"
        ),
    })
  }

  return (
    <Modal handleClose={handleCancel} isLargeModal>
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log(errors)
        })}
      >
        <Modal.Body>
          <Modal.Header handleClose={handleCancel}>
            <span className="inter-xlarge-semibold">
              {t(
                "mark-shipped-mark-fulfillment-shipped",
                "Mark Fulfillment Shipped"
              )}
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col">
              <span className="inter-base-semibold mb-2">
                {t("mark-shipped-tracking", "Tracking")}
              </span>
              <div className="flex flex-col space-y-2">
                {trackingNumbers.map((tn, index) => (
                  <Controller
                    key={tn.id}
                    name={`tracking_numbers.${index}.value`}
                    control={control}
                    rules={{
                      shouldUnregister: true,
                    }}
                    render={({ field }) => {
                      return (
                        <Input
                          deletable={index !== 0}
                          label={
                            index === 0
                              ? t(
                                  "mark-shipped-tracking-number-label",
                                  "Tracking number"
                                )
                              : ""
                          }
                          type="text"
                          placeholder={t(
                            "mark-shipped-tracking-number",
                            "Tracking number..."
                          )}
                          {...field}
                          onDelete={() => removeTracking(index)}
                        />
                      )
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 flex w-full justify-end">
              <Button
                size="small"
                onClick={() => appendTracking({ value: undefined })}
                variant="secondary"
                disabled={trackingNumbers.some((tn) => !tn.value)}
              >
                {t(
                  "mark-shipped-add-additional-tracking-number",
                  "+ Add Additional Tracking Number"
                )}
              </Button>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex h-8 w-full justify-between">
              <div
                className="flex h-full cursor-pointer items-center"
                onClick={() => setNoNotis(!noNotis)}
              >
                <div
                  className={`text-grey-0 border-grey-30 rounded-base flex h-5 w-5 justify-center border ${
                    !noNotis && "bg-violet-60"
                  }`}
                >
                  <span className="self-center">
                    {!noNotis && <CheckIcon size={16} />}
                  </span>
                </div>
                <input
                  id="noNotification"
                  className="hidden"
                  name="noNotification"
                  checked={!noNotis}
                  type="checkbox"
                />
                <span className="text-grey-90 gap-x-xsmall ml-3 flex items-center">
                  {t("mark-shipped-send-notifications", "Send notifications")}
                  <IconTooltip content="" />
                </span>
              </div>
              <div className="flex">
                <Button
                  variant="ghost"
                  className="text-small mr-2 w-32 justify-center"
                  size="large"
                  onClick={handleCancel}
                  type="button"
                >
                  {t("mark-shipped-cancel", "Cancel")}
                </Button>
                <Button
                  size="large"
                  className="text-small w-32 justify-center"
                  variant="primary"
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {t("mark-shipped-complete", "Complete")}
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default MarkShippedModal
