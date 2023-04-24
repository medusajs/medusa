import React, { useState } from "react"
import clsx from "clsx"
import Button from "../../components/fundamentals/button"
import TransactionTable from "../../components/templates/transaction-table"
import { formatAmountWithSymbol } from "../../utils/prices"
import { useSelectedVendor } from "../../context/vendor"
import { useBasePath } from "../../utils/routePathing"
import EditIcon from "../../components/fundamentals/icons/edit-icon"
import BankIcon from "../../components/fundamentals/icons/bank-icon"
import RequestPayoutModal from "./components/request-payout-modal"
import { useFeatureFlag } from "../../context/feature-flag"
import { useNavigate } from "react-router-dom"
import { BalanceAlert } from "./components/alert"
import { useBalanceInfo } from "../../hooks/use-balance-info"
import RequestTopupModal from "./components/request-topup-modal"

const Balance = () => {
  const navigate = useNavigate()
  const [requestPayoutModalOpen, setRequestPayoutModalOpen] = useState(false)
  const [requestTopupModalOpen, setRequestTopupModalOpen] = useState(false)
  const basePath = useBasePath()
  const { selectedVendor } = useSelectedVendor()
  const balanceId = selectedVendor?.balance_id || ""

  const {
    currentAmount,
    balance,
    bankAccount,
    payoutAccountNeedsAttention,
    isLoading,
    isNegative,
    isPositive,
    payoutsEnabled,
  } = useBalanceInfo()

  const { isFeatureEnabled } = useFeatureFlag()

  // This needs to be the `balance.available_amount` instead of `balance.total_amount`

  return (
    <>
      {payoutAccountNeedsAttention && <BalanceAlert />}

      <div className="rounded-rounded border bg-grey-0 border-grey-20 flex flex-col w-full">
        <header className="flex items-center py-6 px-8">
          <div>
            <h1 className="inter-base-regular text-grey-50 leading-none">
              Current Balance
            </h1>
            <h2
              className={clsx(
                "inter-2xlarge-semibold text-grey-90 leading-none mt-2",
                {
                  "text-emerald-50": isPositive,
                  "text-rose-50": isNegative,
                }
              )}
            >
              {formatAmountWithSymbol({
                amount: currentAmount,
                currency: "USD",
              })}
            </h2>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {isFeatureEnabled("stripe_connect") && (
              <>
                {payoutsEnabled && (
                  <>
                    <Button
                      variant="secondary"
                      className="gap-2 px-4"
                      onClick={() =>
                        navigate(`${basePath}/payouts/manage/update`)
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-grey-40">
                          <BankIcon size={20} />
                        </div>
                        <span>Account</span>
                        <span className="inter-base-regular margin-0 font-mono">
                          &bull;&bull;&bull;&bull;
                          {bankAccount?.last4}
                        </span>
                      </div>
                      <div className="text-grey-40">
                        <EditIcon size={16} />
                      </div>
                    </Button>

                    {!payoutAccountNeedsAttention && !isNegative && (
                      <Button
                        variant="primary"
                        disabled={isLoading || !isPositive}
                        onClick={() => setRequestPayoutModalOpen(true)}
                      >
                        Request payout
                      </Button>
                    )}
                    {isNegative && (
                      <Button
                        variant="nuclear"
                        disabled={isLoading}
                        onClick={() => setRequestTopupModalOpen(true)}
                      >
                        Topup Balance
                      </Button>
                    )}
                  </>
                )}

                {!payoutsEnabled && (
                  <Button
                    variant="primary"
                    disabled={isLoading}
                    onClick={() =>
                      navigate(`${basePath}/payouts/manage/onboarding`)
                    }
                  >
                    Set up Payouts
                  </Button>
                )}

                {payoutAccountNeedsAttention && (
                  <Button
                    variant="nuclear"
                    onClick={() =>
                      navigate(`${basePath}/payouts/manage/update`)
                    }
                  >
                    Fix account
                  </Button>
                )}
              </>
            )}
          </div>
        </header>

        <div className="py-6 px-8 border-t border-t-grey-20">
          <h3 className="inter-large-semibold text-grey-90 mb-4">
            Latest transactions
          </h3>
          <TransactionTable balanceId={balanceId} />
        </div>
      </div>

      {balance && requestPayoutModalOpen && (
        <RequestPayoutModal
          open={requestPayoutModalOpen}
          balance={balance}
          handleClose={() => setRequestPayoutModalOpen(false)}
        />
      )}

      {balance && requestTopupModalOpen && (
        <RequestTopupModal
          open={requestTopupModalOpen}
          handleClose={() => setRequestTopupModalOpen(false)}
        />
      )}
    </>
  )
}

export default Balance
