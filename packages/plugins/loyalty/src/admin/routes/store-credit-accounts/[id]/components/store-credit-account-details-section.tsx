import { Container, Text } from "@medusajs/ui";
import { CreditCard } from "@medusajs/icons";

import { AdminStoreCreditAccount } from "../../../../../types";
import DisplayId from "../../../../components/display-id";
import CreditCardIcon from "./credit-card-icon";
import { ActionMenu } from "../../../../components/action-menu";

const StoreCreditAccountDetailsSection = ({
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
    <Container className="flex justify-between gap-x-2 px-6 py-6">
      <Text
        weight="plus"
        size="xlarge"
        className="text-ui-fg-base flex gap-x-4"
      >
        <div className="flex items-center gap-x-2">
          <CreditCardIcon className="inline" />{" "}
        </div>
        <div>
          <div className="text-ui-fg-subtle">
            {storeCreditAccount.currency_code.toUpperCase()} Account
          </div>
          <div className="text-ui-fg-base">
            <Text
              weight="regular"
              size="small"
              className="text-ui-fg-base flex gap-x-4"
            >
              <DisplayId id={storeCreditAccount.id} />
            </Text>
          </div>
        </div>
      </Text>

      <div className="flex items-center gap-x-4">
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <CreditCard />,
                  label: "Credit the account",
                  to: "credit",
                },
              ],
            },
          ]}
        />
      </div>
    </Container>
  );
};

export default StoreCreditAccountDetailsSection;
