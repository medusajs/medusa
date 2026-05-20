import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container } from "@medusajs/ui";
import { useParams } from "react-router-dom";
import { Header } from "../components/header";
import { NoRecords } from "../components/no-records";
import { SidebarLink } from "../components/sidebar-link";
import { useStoreCreditAccounts } from "../hooks/api/store-credit-accounts";
import CreditCardIcon from "../routes/store-credit-accounts/[id]/components/credit-card-icon";
import { formatAmount } from "../utils/format-amount";

const CustomerStoreCreditWidget = () => {
  const params = useParams();

  const { store_credit_accounts: storeCreditAccounts, isPending } =
    useStoreCreditAccounts({
      customer_id: params.id!,
    });

  if (isPending || !storeCreditAccounts?.length) {
    return null;
  }

  return (
    <Container className="p-0">
      <Header title="Store Credit Accounts" />

      {storeCreditAccounts?.length === 0 && (
        <NoRecords
          className="border-t"
          title="No store credit accounts"
          message="There are no store credit accounts to show"
          icon={null}
        />
      )}

      {storeCreditAccounts?.map((storeCreditAccount) => (
        <SidebarLink
          icon={<CreditCardIcon className="w-[32px] h-[24px]" />}
          key={storeCreditAccount.id}
          labelKey={`${storeCreditAccount.currency_code.toUpperCase()} Account`}
          descriptionKey={formatAmount(
            (storeCreditAccount.balance as number) ?? 0,
            storeCreditAccount.currency_code
          )}
          to={`/store-credit-accounts/${storeCreditAccount.id}`}
        />
      ))}
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "customer.details.side.after",
});

export default CustomerStoreCreditWidget;
