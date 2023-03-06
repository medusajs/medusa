import { Fulfillment } from "@medusajs/medusa"
import {
  useAdminCreateClaimShipment,
  useAdminCreateShipment,
  useAdminCreateSwapShipment,
} from "medusa-react"
import React, { useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
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
    let successText = "Successfully marked order as shipped"
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
        successText = "Successfully marked swap as shipped"
        break

      case "claim":
        action = markClaimShipped
        requestObj = {
          fulfillment_id: fulfillment.id,
          claim_id: resourceId,
          tracking_numbers,
        }
        successText = "Successfully marked claim as shipped"
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
        notification("Success", successText, "success")
        handleCancel()
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
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
              Mark Fulfillment Shipped
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col">
              <span className="inter-base-semibold mb-2">Tracking</span>
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
                          label={index === 0 ? "Tracking number" : ""}
                          type="text"
                          placeholder={"Tracking number..."}
                          {...field}
                          onDelete={() => removeTracking(index)}
                        />
                      )
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex w-full justify-end mt-4">
              <Button
                size="small"
                onClick={() => appendTracking({ value: undefined })}
                variant="secondary"
                disabled={trackingNumbers.some((tn) => !tn.value)}
              >
                + Add Additional Tracking Number
              </Button>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full h-8 justify-between">
              <div
                className="items-center h-full flex cursor-pointer"
                onClick={() => setNoNotis(!noNotis)}
              >
                <div
                  className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
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
                <span className="ml-3 flex items-center text-grey-90 gap-x-xsmall">
                  Send notifications
                  <IconTooltip content="" />
                </span>
              </div>
              <div className="flex">
                <Button
                  variant="ghost"
                  className="mr-2 w-32 text-small justify-center"
                  size="large"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  size="large"
                  className="w-32 text-small justify-center"
                  variant="primary"
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Complete
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
