import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAdminOrders } from "medusa-react"
import clsx from "clsx"
import { useSelectedVendor } from "../../context/vendor"
import { formatAmountWithSymbol } from "../../utils/prices"
import Button from "../../components/fundamentals/button"
import DollarSignIcon from "../../components/fundamentals/icons/dollar-sign-icon"
import ClipboardDocumentCheck from "../../components/fundamentals/icons/clipboard-document-check"
import BanknotesIcon from "../../components/fundamentals/icons/banknotes-icon"
import { useBasePath } from "../../utils/routePathing"
import RequestPayoutModal from "../balance/components/request-payout-modal"
import { useFeatureFlag } from "../../context/feature-flag"
import RequestTopupModal from "../balance/components/request-topup-modal"
import { BalanceAlert } from "../balance/components/alert"
import { useBalanceInfo } from "../../hooks/use-balance-info"
import { useGetVendorTodos } from "../../hooks/admin/todo/queries"
import Todo from "../../components/molecules/todo-item"

export interface TodoListItem {
  id: string
  title: string
  description: string
  action?: {
    label?: string
    onClick: () => void
  }
  isLoading?: boolean
  isComplete: boolean
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [requestPayoutModalOpen, setRequestPayoutModalOpen] = useState(false)
  const [requestTopupModalOpen, setRequestTopupModalOpen] = useState(false)
  const { selectedVendor } = useSelectedVendor()
  const basePath = useBasePath()
  const { count: ordersCount = 0, isLoading: isLoadingOrders } = useAdminOrders(
    {
      offset: 0,
      limit: 1,
      fulfillment_status: ["not_fulfilled", "partially_fulfilled"],
      expand: "vendor",
      fields: "id",
      vendor_id: selectedVendor?.id ?? "null",
    }
  )

  const {
    isLoading: isLoadingPayoutAccount,
    balance,
    currentAmount,
    isPositive,
    isNegative,
    isZero,
    payoutsEnabled,
    payoutAccountNeedsAttention,
  } = useBalanceInfo()
  const { isFeatureEnabled } = useFeatureFlag()

  const { todos } = useGetVendorTodos(selectedVendor?.id ?? "")

  const todoListComplete = (todos ?? []).filter((item) => !!item.completed_at)

  return (
    <>
      <div className="container max-w-3xl mx-auto pb-16">
        {/* TODO: If payouts are disabled, that means there was an error w/ the Stripe Connect account
        that needs to be resolved before they may be re-enabled. We should show an alert that sends the
        user to the `/payouts/manage/update` route to fix their account details.  */}

        {payoutAccountNeedsAttention && <BalanceAlert />}

        <header className="mb-xlarge">
          <h1 className="inter-2xlarge-semibold mb-xsmall">Dashboard</h1>
          <h2 className="inter-base-regular text-grey-50">
            View the latest activity in your store
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div
              className={clsx("bg-white rounded-lg", {
                "border border-grey-20": isZero,
                "border-2 border-violet-40": isPositive,
                "border-2 border-rose-40": isNegative,
              })}
            >
              <div className="p-6">
                <div className="flex items-center gap-6">
                  <div
                    className={clsx(
                      "flex flex-shrink-0 flex-grow-0 items-center justify-center w-16 h-16 rounded-md",
                      {
                        "text-violet-50 bg-violet-100": !isNegative,
                        "text-rose-50 bg-rose-100": isNegative,
                      }
                    )}
                  >
                    <BanknotesIcon className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col">
                    <div
                      className={clsx(
                        `inter-2xlarge-semibold text-grey-90 leading-8`,
                        {
                          "text-emerald-50": isPositive,
                          "text-rose-50": isNegative,
                          "text-gray-400": !balance,
                        }
                      )}
                    >
                      {balance
                        ? formatAmountWithSymbol({
                            amount: currentAmount,
                            currency: "USD",
                          })
                        : "-"}
                    </div>
                    <div className="inter-base-regular leading-5 text-grey-50 mt-1">
                      Current balance
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div className="px-2 flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`${basePath}/balance`)}
                    >
                      View transactions
                    </Button>

                    {isFeatureEnabled("stripe_connect") && (
                      <>
                        {!payoutsEnabled && !payoutAccountNeedsAttention && (
                          <Button
                            variant="primary"
                            disabled={isLoadingPayoutAccount}
                            onClick={() =>
                              navigate(`${basePath}/payouts/manage/onboarding`)
                            }
                          >
                            Set up Payouts
                          </Button>
                        )}
                        {payoutsEnabled &&
                          !payoutAccountNeedsAttention &&
                          !isNegative && (
                            <Button
                              variant="primary"
                              disabled={isLoadingPayoutAccount || !isPositive}
                              onClick={() => setRequestPayoutModalOpen(true)}
                            >
                              Request payout
                            </Button>
                          )}
                        {payoutsEnabled && isNegative && (
                          <Button
                            variant="nuclear"
                            disabled={isLoadingPayoutAccount}
                            onClick={() => setRequestTopupModalOpen(true)}
                          >
                            Topup Balance
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
                </div>
              </div>
            </div>
          </div>

          {selectedVendor && (
            <div className="col-span-12">
              <div className="bg-white rounded-lg border border-grey-20">
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-shrink-0 flex-grow-0 items-center justify-center w-16 h-16 rounded-md text-violet-50 bg-violet-100">
                      <DollarSignIcon className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col">
                      <div className="inter-2xlarge-semibold text-grey-90 leading-8">
                        {isLoadingOrders ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: "&ndash;&ndash;",
                            }}
                          />
                        ) : (
                          ordersCount
                        )}
                      </div>
                      <div className="inter-base-regular leading-5 text-grey-50 mt-1">
                        Unfulfilled Orders
                      </div>
                    </div>
                    <div className="flex-1" />
                    <div className="px-2">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          navigate(
                            `${basePath}/orders?fulfillment_status[]=not_fulfilled&fulfillment_status[]=partially_fulfilled&offset=0&limit=15`
                          )
                        }
                      >
                        View orders
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-span-12">
            <div className="bg-white rounded-lg border border-grey-20">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex flex-shrink-0 flex-grow-0 items-center justify-center w-12 h-12 rounded-md text-violet-50 bg-violet-100">
                    <ClipboardDocumentCheck className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="inter-large-semibold text-grey-90 leading-6">
                      To-do list
                    </h3>
                    <div className="inter-base-regular leading-5 text-grey-50">
                      A list of items to ensure your store is purring like a
                      kitten.
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div className="flex flex-col justify-end inter-small-regular leading-none text-right gap-1.5">
                    <span className="font-semibold">
                      {todoListComplete.length}{" "}
                      <span className="font-normal">of</span> {todos?.length}
                    </span>
                    <span className="text-grey-50">Completed</span>
                  </div>
                </div>
              </div>

              {!!todos &&
                todos.map((todo) => <Todo todo={todo} key={todo.id} />)}
            </div>
          </div>
        </div>
      </div>

      {balance && requestPayoutModalOpen && (
        <RequestPayoutModal
          open={requestPayoutModalOpen}
          balance={balance}
          handleClose={() => setRequestPayoutModalOpen(false)}
        />
      )}

      {requestTopupModalOpen && (
        <RequestTopupModal
          open={requestTopupModalOpen}
          handleClose={() => setRequestTopupModalOpen(false)}
        />
      )}
    </>
  )
}

export default Dashboard
