import { FC } from "react"
import { useGetPayoutsAccount } from "../../../hooks/admin/stripe-connect/queries"
import Modal, { ModalProps } from "../../../components/molecules/modal"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useAdminCreateTopup } from "../../../hooks/admin/stripe-connect"
import { useSelectedVendor } from "../../../context/vendor"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Button from "../../../components/fundamentals/button"
import Spinner from "../../../components/atoms/spinner"
import { useBasePath } from "../../../utils/routePathing"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import BankIcon from "../../../components/fundamentals/icons/bank-icon"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import CurrencyInput from "../../../components/organisms/currency-input"
import { useAdminStore } from "medusa-react"
import { useNavigate } from "react-router-dom"
import Alert from "../../../components/molecules/alert"
import { useGetBalance } from "../../../hooks/admin/balances/queries"

export interface RequestTopupModalProps extends ModalProps {
  amount?: number
  message?: string
}

const RequestTopupModal: FC<RequestTopupModalProps> = ({
  open,
  handleClose,
  message,
  amount: initialAmount = 5000,
}) => {
  const navigate = useNavigate()
  const { store } = useAdminStore()
  const basePath = useBasePath()
  const { selectedVendor } = useSelectedVendor()
  const notification = useNotification()
  const { balance, isLoading: balanceLoading } = useGetBalance(
    selectedVendor?.balance_id || ""
  )
  const { account: payoutAccount, isLoading: payoutAccountLoading } =
    useGetPayoutsAccount(selectedVendor?.balance_id)
  const createTopup = useAdminCreateTopup(selectedVendor?.balance_id || "")
  const bankAccount = (payoutAccount?.external_accounts?.data || [])[0]
  const currencyCode = store?.default_currency_code || "usd"
  const isLoading = payoutAccountLoading || balanceLoading
  const balanceAmount = balance?.total_amount || 0

  const formMethods = useForm({
    defaultValues: {
      amount: initialAmount,
    },
  })

  const amount = formMethods.watch("amount")

  const totalCharged = Math.ceil(amount * 1.015)

  const onClose = () => {
    if (handleClose) handleClose()
  }

  const onSubmit = async (data: { amount: number }) => {
    try {
      const {
        data: { topup },
      } = await createTopup.mutateAsync({ amount: data.amount })

      handleClose()

      notification(
        "Topup request sent",
        `Your topup request for ${formatAmountWithSymbol({
          amount: data.amount,
          currency: currencyCode,
        })} has been sent.`,
        "success"
      )
    } catch (error) {
      notification(
        "Unable to process topup request",
        getErrorMessage(error),
        "error"
      )
    }
  }

  return (
    <>
      <Modal open={open} handleClose={onClose} className="max-w-md">
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <h2 className="inter-xlarge-semibold">Topup Balance</h2>
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
                {!!message && (
                  <Alert
                    variant="warning"
                    className="mb-6"
                    title="Insufficient funds"
                    content={<>{message}</>}
                  />
                )}
                <div className="rounded-rounded border border-gray-30 p-4 pb-3 mb-4">
                  <p className="inter-small-semibold text-grey-50">
                    Your current available balance is:
                  </p>

                  <p className="inter-xlarge-semibold text-emerald-50">
                    {formatAmountWithSymbol({
                      amount: balanceAmount,
                      currency: currencyCode,
                    })}
                  </p>
                </div>

                <FormProvider {...formMethods}>
                  <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
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
                        }}
                        render={({ field: { onChange, value, ref } }) => (
                          <CurrencyInput.Root
                            currentCurrency={currencyCode}
                            readOnly
                            size="medium"
                          >
                            <CurrencyInput.Amount
                              ref={ref}
                              label="Topup amount"
                              name="amount"
                              amount={value}
                              onChange={onChange}
                              errors={formMethods.formState.errors.amount}
                            />
                          </CurrencyInput.Root>
                        )}
                      />

                      <p className="inter-base-regular">
                        Funds will be retrieved from bank account:
                      </p>
                      <button
                        onClick={() =>
                          navigate(`${basePath}/payouts/manage/update`)
                        }
                        className="btn btn-secondary btn-large w-full flex gap-2 px-4 py-3"
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

                      <p className="inter-small-regular">
                        There is a 1.5% fee to topup your balance from your bank
                        account. The total charge will be{" "}
                        {formatAmountWithSymbol({
                          amount: totalCharged || 0,
                          currency: currencyCode,
                        })}
                      </p>

                      <Button
                        variant="primary"
                        type="submit"
                        disabled={formMethods.formState.isSubmitting}
                      >
                        {formMethods.formState.isSubmitting
                          ? "Sending request..."
                          : `Request ${formatAmountWithSymbol({
                              amount: amount,
                              currency: currencyCode,
                            })} topup`}
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              </>
            )}
          </Modal.Content>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default RequestTopupModal
