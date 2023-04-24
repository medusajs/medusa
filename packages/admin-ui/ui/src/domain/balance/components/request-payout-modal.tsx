import React, { FC, useEffect } from "react"
import { BalanceWithAmounts } from "@medusajs/medusa"
import { useGetPayoutsAccount } from "../../../hooks/admin/stripe-connect/queries"
import Modal, { ModalProps } from "../../../components/molecules/modal"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useAdminCreatePayout } from "../../../hooks/admin/stripe-connect"
import { useSelectedVendor } from "../../../context/vendor"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Button from "../../../components/fundamentals/button"
import Checkbox from "../../../components/atoms/checkbox"
import Spinner from "../../../components/atoms/spinner"
import { useBasePath } from "../../../utils/routePathing"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import BankIcon from "../../../components/fundamentals/icons/bank-icon"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import CurrencyInput from "../../../components/organisms/currency-input"
import { useAdminStore } from "medusa-react"
import { useNavigate } from "react-router-dom"

export interface RequestPayoutModalProps extends ModalProps {
  balance: BalanceWithAmounts
}

const RequestPayoutModal: FC<RequestPayoutModalProps> = ({
  open,
  handleClose,
  balance,
}) => {
  const navigate = useNavigate()
  const { store } = useAdminStore()
  const basePath = useBasePath()
  const { selectedVendor } = useSelectedVendor()
  const notification = useNotification()
  const { account: payoutAccount, isLoading } = useGetPayoutsAccount(
    selectedVendor?.balance_id
  )
  const createPayout = useAdminCreatePayout(selectedVendor?.balance_id || "")
  const bankAccount = (payoutAccount?.external_accounts?.data || [])[0]
  const availableAmount = balance.available_amount
  const currencyCode = store?.default_currency_code || "usd"

  const formMethods = useForm({
    defaultValues: {
      amount: availableAmount,
      full_amount: true,
    },
  })

  const fullAmount = formMethods.watch("full_amount")

  const onClose = () => {
    if (handleClose) handleClose()
  }

  const onSubmit = async (data: { amount: number; full_amount: boolean }) => {
    try {
      const {
        data: { payout },
      } = await createPayout.mutateAsync({ amount: data.amount })

      handleClose()

      notification(
        "Payout request sent",
        `Your payout request for ${formatAmountWithSymbol({
          amount: payout.amount,
          currency: currencyCode,
        })} has been sent.`,
        "success"
      )
    } catch (error) {
      notification(
        "Unable to process payout request",
        getErrorMessage(error),
        "error"
      )
    }
  }

  useEffect(() => {
    formMethods.setValue("amount", availableAmount)
    formMethods.clearErrors("amount")
  }, [fullAmount])

  return (
    <Modal open={open} handleClose={onClose} className="max-w-md">
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h2 className="inter-xlarge-semibold">Request payout</h2>
        </Modal.Header>

        <Modal.Content>
          {!payoutAccount && isLoading && (
            <div className="flex flex-col gap-2 items-center justify-center max-w-xs mx-auto text-center">
              <Spinner variant="secondary" size="large" />
              <div className="inter-large-regular">
                Please wait while we fetch your account details...
              </div>
            </div>
          )}

          {payoutAccount && (
            <>
              <p className="inter-base-regular mb-4">
                The requested amount will be paid out to your linked bank
                account.
              </p>
              <button
                onClick={() => navigate(`${basePath}/payouts/manage/update`)}
                className="btn btn-secondary btn-large w-full flex gap-2 px-4 py-3 mb-4"
              >
                <div className="text-grey-40">
                  <BankIcon size={20} />
                </div>
                <div className="inter-base-semibold">Account</div>
                <div className=" font-normal font-mono">
                  &bull;&bull;&bull;&bull;
                  {bankAccount?.last4}
                </div>
                <div className="flex-1" />
                <div className="text-grey-40">
                  <EditIcon size={16} />
                </div>
              </button>

              <FormProvider {...formMethods}>
                <p className="inter-base-regular mb-4">
                  You may request a payout up to the maximum available balance.
                </p>
                <div className="rounded-rounded border border-gray-30 p-4 pb-3 mb-4">
                  {balance.pending_amount !== 0 && (
                    <>
                      <p className="inter-small-semibold text-grey-50">
                        Your pending balance is:
                      </p>
                      <p className="inter-xlarge-semibold text-grey-60 mb-2">
                        {formatAmountWithSymbol({
                          amount: balance.pending_amount,
                          currency: currencyCode,
                        })}
                      </p>
                    </>
                  )}

                  <p className="inter-small-semibold text-grey-50">
                    Your available balance is:
                  </p>
                  <p className="inter-xlarge-semibold text-emerald-50">
                    {formatAmountWithSymbol({
                      amount: balance.available_amount,
                      currency: currencyCode,
                    })}
                  </p>
                </div>

                <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-4">
                    <Checkbox
                      type="checkbox"
                      label="Request full amount"
                      {...formMethods.register("full_amount")}
                    />

                    {!fullAmount && (
                      <Controller
                        control={formMethods.control}
                        name="amount"
                        rules={{
                          required: `Minimum of ${formatAmountWithSymbol({
                            amount: 100,
                            currency: currencyCode,
                          })} is required`,
                          min: {
                            value: 100,
                            message: `Minimum of ${formatAmountWithSymbol({
                              amount: 100,
                              currency: currencyCode,
                            })} is required`,
                          },
                          max: {
                            value: availableAmount,
                            message: `Amount may not exceed available balance of ${formatAmountWithSymbol(
                              {
                                amount: availableAmount,
                                currency: currencyCode,
                              }
                            )}.`,
                          },
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                          <CurrencyInput.Root
                            currentCurrency={currencyCode}
                            readOnly
                            size="medium"
                          >
                            <CurrencyInput.Amount
                              ref={ref}
                              label="Custom amount"
                              name="amount"
                              amount={value}
                              max={availableAmount}
                              onChange={onChange}
                              errors={formMethods.formState.errors.amount}
                            />
                          </CurrencyInput.Root>
                        )}
                      />
                    )}

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={formMethods.formState.isSubmitting}
                    >
                      {formMethods.formState.isSubmitting
                        ? "Sending request..."
                        : "Request payout"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </>
          )}
        </Modal.Content>
      </Modal.Body>
    </Modal>
  )
}

export default RequestPayoutModal
