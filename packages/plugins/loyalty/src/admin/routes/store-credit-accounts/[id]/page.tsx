import { useParams } from "react-router-dom";
import { TwoColumnLayout } from "../../../components/layouts/two-column";
import { useStoreCreditAccount } from "../../../hooks/api/store-credit-accounts";
import StoreCreditAccountBalanceSection from "./components/store-credit-account-balance-section";
import StoreCreditAccountDetailsSection from "./components/store-credit-account-details-section";
import StoreCreditAccountCustomerSection from "./components/store-credit-account-customer-section";
import { TransactionsTable } from "./components/transactions-table/table";
import StoreCreditAccountCodeSection from "./components/store-credit-account-code";

const StoreCreditAccountPage = () => {
  const { id } = useParams();

  const { store_credit_account: storeCreditAccount } = useStoreCreditAccount(
    id!
  );

  if (!storeCreditAccount) {
    return;
  }

  return (
    <>
      <TwoColumnLayout
        firstCol={
          <>
            <StoreCreditAccountDetailsSection
              storeCreditAccount={storeCreditAccount}
            />

            <TransactionsTable id={storeCreditAccount.id} />
          </>
        }
        secondCol={
          <>
            <StoreCreditAccountBalanceSection
              storeCreditAccount={storeCreditAccount}
            />
            <StoreCreditAccountCodeSection code={storeCreditAccount.code} />
            <StoreCreditAccountCustomerSection
              customerId={storeCreditAccount.customer_id}
            />
          </>
        }
      />
    </>
  );
};

export default StoreCreditAccountPage;
