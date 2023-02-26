import { AdminPostGiftCardsGiftCardReq, GiftCard } from "@medusajs/medusa"
import clsx from "clsx"
import React from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import Tooltip from "../../../components/atoms/tooltip"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import CurrencyInput from "../../../components/organisms/currency-input"

type UpdateBalanceModalProps = {
  handleClose: () => void
  handleSave: (update: AdminPostGiftCardsGiftCardReq) => void
  currencyCode: string
  giftCard: GiftCard
  updating: boolean
}

type UpdateBalanceModalFormData = {
  balance: number
}

const UpdateBalanceModal = ({
  handleClose,
  handleSave,
  currencyCode,
  giftCard,
  updating,
}: UpdateBalanceModalProps) => {
  const { control, handleSubmit } = useForm<UpdateBalanceModalFormData>({
    defaultValues: {
      balance: giftCard.balance,
    },
  })

  const balance = useWatch({
    control,
    name: "balance",
  })

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSave)}>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Update Balance</span>
            <span
              className={clsx(
                "inter-small-regular text-rose-50 mt-2xsmall transition-display delay-75",
                {
                  hidden: !(balance > giftCard.value),
                }
              )}
            >
              Balance can't be updated to a value that is greater than the
              original amount
            </span>
          </Modal.Header>
          <Modal.Content>
            <CurrencyInput.Root
              readOnly
              currentCurrency={currencyCode}
              size="small"
            >
              <Controller
                control={control}
                name="balance"
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange } }) => {
                  return (
                    <CurrencyInput.Amount
                      amount={value}
                      label="Price"
                      onChange={onChange}
                    />
                  )
                }}
              />
            </CurrencyInput.Root>
          </Modal.Content>
          <Modal.Footer>
            <div className="w-full flex justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2"
                type="button"
              >
                Cancel
              </Button>
              <Button
                loading={updating}
                variant="primary"
                className="min-w-[100px]"
                size="small"
                type="submit"
                disabled={balance > giftCard.value || updating}
              >
                {balance > giftCard.value ? (
                  <Tooltip content="Balance is above original value">
                    Save
                  </Tooltip>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}
export default UpdateBalanceModal
