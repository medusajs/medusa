import { Order } from "@medusajs/medusa"
import { useAdminRefundPayment } from "medusa-react"
import React, { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import Button from "../../../../components/fundamentals/button"
import AlertIcon from "../../../../components/fundamentals/icons/alert-icon"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import Select from "../../../../components/molecules/select"
import TextArea from "../../../../components/molecules/textarea"
import CurrencyInput from "../../../../components/organisms/currency-input"
import useNotification from "../../../../hooks/use-notification"
import { Option } from "../../../../types/shared"
import { getErrorMessage } from "../../../../utils/error-messages"
import FormValidator from "../../../../utils/form-validator"

type RefundMenuFormData = {
  amount: number
  reason: Option
  no_notification: boolean
  note?: string
}

const reasonOptions = [
  { label: "Discount", value: "discount" },
  { label: "Other", value: "other" },
]

type RefundMenuProps = {
  order: Order
  onDismiss: () => void
  initialAmount?: number
  initialReason: "other" | "discount"
}

const RefundMenu = ({
  order,
  onDismiss,
  initialAmount,
  initialReason,
}: RefundMenuProps) => {
  const { register, handleSubmit, control } = useForm<RefundMenuFormData>({
    defaultValues: {
      amount: initialAmount,
      reason: reasonOptions[initialReason === "other" ? 1 : 0],
    },
  })

  const [noNotification, setNoNotification] = useState(order.no_notification)

  const notification = useNotification()
  const { mutate, isLoading } = useAdminRefundPayment(order.id)

  const refundable = useMemo(() => {
    return order.paid_total - order.refunded_total
  }, [order])

  const handleValidateRefundAmount = (value) => {
    return value <= refundable
  }

  const onSubmit = (data: RefundMenuFormData) => {
    mutate(
      {
        amount: data.amount,
        reason: data.reason.value,
        no_notification: noNotification,
        note: data.note,
      },
      {
        onSuccess: () => {
          notification("Success", "Successfully refunded order", "success")
          onDismiss()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  const isSystemPayment = order.payments.some((p) => p.provider_id === "system")

  return (
    <Modal handleClose={onDismiss}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={onDismiss}>
            <h2 className="inter-xlarge-semibold">Create a refund</h2>
          </Modal.Header>
          <Modal.Content>
            {isSystemPayment && (
              <div className="inter-small-regular mb-6 p-4 text-orange-50 bg-orange-5 rounded-rounded flex">
                <div className="h-full mr-3">
                  <AlertIcon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="inter-small-semibold">Attention!</span>
                  One or more of your payments is a system payment. Be aware,
                  that captures and refunds are not handled by Medusa for such
                  payments.
                </div>
              </div>
            )}
            <span className="inter-base-semibold">Details</span>
            <div className="grid gap-y-base mt-4">
              <CurrencyInput.Root
                size="small"
                currentCurrency={order.currency_code}
                readOnly
              >
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: FormValidator.required("Amount"),
                    min: FormValidator.min("Amount", 1),
                    max: FormValidator.maxInteger(
                      "Amount",
                      order.currency_code
                    ),
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CurrencyInput.Amount
                      label={"Refund Amount"}
                      amount={value}
                      onBlur={onBlur}
                      invalidMessage={`Cannot refund more than the order's net total.`}
                      onValidate={handleValidateRefundAmount}
                      onChange={onChange}
                    />
                  )}
                />
              </CurrencyInput.Root>
              <Controller
                name="reason"
                control={control}
                defaultValue={{ label: "Discount", value: "discount" }}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Reason"
                    options={reasonOptions}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <TextArea
                {...register("note")}
                label="Note"
                placeholder="Discount for loyal customer"
              />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full  justify-between">
              <div
                className="items-center h-full flex cursor-pointer"
                onClick={() => setNoNotification(!noNotification)}
              >
                <div
                  className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                    !noNotification && "bg-violet-60"
                  }`}
                >
                  <span className="self-center">
                    {!noNotification && <CheckIcon size={16} />}
                  </span>
                </div>
                <input
                  id="noNotification"
                  className="hidden"
                  name="noNotification"
                  checked={!noNotification}
                  onChange={() => setNoNotification(!noNotification)}
                  type="checkbox"
                />
                <span className="ml-3 flex items-center text-grey-90 gap-x-xsmall">
                  Send notifications
                  <IconTooltip content="Notify customer of created return" />
                </span>
              </div>
              <div className="flex gap-x-xsmall">
                <Button
                  onClick={onDismiss}
                  size="small"
                  className="w-[112px]"
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="small"
                  className="w-[112px]"
                  variant="primary"
                  loading={isLoading}
                  disabled={isLoading}
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

export default RefundMenu
