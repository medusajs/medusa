import { Container } from "@medusajs/ui";
import { ModuleStoreCreditAccount } from "../../../../../types";
import { TransactionsTable } from "../../../store-credit-accounts/[id]/components/transactions-table/table";

const GiftCardTransactionsSection = ({
  storeCreditAccount,
}: {
  storeCreditAccount: ModuleStoreCreditAccount;
}) => {
  return (
    <Container key={storeCreditAccount.id} className="divide-y p-0">
      <TransactionsTable id={storeCreditAccount.id} />
    </Container>
  );
};

export default GiftCardTransactionsSection;
