import { useParams } from "react-router-dom"
import { LayoutComposer } from "@medusajs/dashboard/components"
import { useStoreCreditAccount } from "../../../hooks/api/store-credit-accounts"
import StoreCreditAccountBalanceSection from "./components/store-credit-account-balance-section"
import StoreCreditAccountDetailsSection from "./components/store-credit-account-details-section"
import StoreCreditAccountCustomerSection from "./components/store-credit-account-customer-section"
import { TransactionsTable } from "./components/transactions-table/table"
import StoreCreditAccountCodeSection from "./components/store-credit-account-code"

const StoreCreditAccountPage = () => {
  const { id } = useParams()

  const { store_credit_account: storeCreditAccount } = useStoreCreditAccount(
    id!
  )

  if (!storeCreditAccount) {
    return
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="store_credit_account.details"
      preferredLayoutId="core:two-column"
      data={storeCreditAccount}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="StoreCreditAccountDetailsSection">
              <StoreCreditAccountDetailsSection
                storeCreditAccount={storeCreditAccount}
              />
            </LayoutComposer.Entry>

            <LayoutComposer.Entry id="TransactionsTable">
              <TransactionsTable id={storeCreditAccount.id} />
            </LayoutComposer.Entry>
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="StoreCreditAccountBalanceSection">
              <StoreCreditAccountBalanceSection
                storeCreditAccount={storeCreditAccount}
              />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="StoreCreditAccountCodeSection">
              <StoreCreditAccountCodeSection code={storeCreditAccount.code} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="StoreCreditAccountCustomerSection">
              <StoreCreditAccountCustomerSection
                customerId={storeCreditAccount.customer_id}
              />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

export default StoreCreditAccountPage
