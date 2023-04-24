import { useSelectedVendor } from "../context/vendor"
import { useGetBalance } from "./admin/balances/queries"
import { useGetPayoutsAccount } from "./admin/stripe-connect"

export const useBalanceInfo = () => {
  const { selectedVendor } = useSelectedVendor()
  const balanceId = selectedVendor?.balance_id || ""
  const { balance, isLoading: balanceLoading } = useGetBalance(balanceId)
  const { account: payoutAccount, isLoading: accountLoading } =
    useGetPayoutsAccount(balanceId)

  if (balanceLoading || accountLoading)
    return {
      isLoading: true,
      balance: undefined,
      payoutAccount: undefined,
      currentAmount: 0,
      bankAccount: undefined,
      isPositive: false,
      isNegative: false,
      isZero: true,
      payoutsEnabled: false,
      payoutAccountNeedsAttention: false,
    }

  // This needs to be the `balance.available_amount` instead of `balance.total_amount`
  const currentAmount = balance?.total_amount ?? 0
  const bankAccount = (payoutAccount?.external_accounts?.data || [])[0]
  const isPositive = currentAmount > 0
  const isNegative = currentAmount < 0
  const isZero = currentAmount === 0
  const payoutsEnabled = payoutAccount?.payouts_enabled
  const payoutAccountNeedsAttention =
    payoutAccount?.details_submitted && !payoutAccount?.payouts_enabled

  return {
    isLoading: false,
    balance,
    payoutAccount,
    currentAmount,
    bankAccount,
    isPositive,
    isNegative,
    isZero,
    payoutsEnabled,
    payoutAccountNeedsAttention,
  }
}
