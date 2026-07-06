import { Container, Text } from "@medusajs/ui";
import { AdminStoreCreditAccount } from "../../../../../types";
import { formatAmount } from "../../../../utils/format-amount";

const StoreCreditAccountBalanceSection = ({
  storeCreditAccount,
}: {
  storeCreditAccount: AdminStoreCreditAccount;
}) => {
  if (
    !storeCreditAccount ||
    typeof storeCreditAccount.balance === "undefined"
  ) {
    return;
  }

  return (
    <Container className="grid grid-cols-2 gap-x-2 px-6 py-4">
      <div className="text-ui-fg-subtle flex items-center gap-x-3">
        <div className="bg-ui-tag-green-icon h-8 w-1 rounded-full" />

        <div>
          <Text weight="plus" size="small" className="text-ui-fg-subtle">
            Current Balance
          </Text>

          <Text
            weight="plus"
            size="xlarge"
            className="tabular-nums text-ui-fg-base"
          >
            {formatAmount(
              storeCreditAccount.balance as number,
              storeCreditAccount.currency_code
            )}
          </Text>
        </div>
      </div>
    </Container>
  );
};

export default StoreCreditAccountBalanceSection;
