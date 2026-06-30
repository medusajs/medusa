import { defineRouteConfig } from "@zjedene-medusa/admin-sdk";
import { CurrencyDollar } from "@zjedene-medusa/icons";
import { Toaster } from "@zjedene-medusa/ui";
import { StoreCreditAccountsTable } from "./components/store-credit-accounts-table/table";

const StoreCreditAccountsPage = () => {
  return (
    <>
      <StoreCreditAccountsTable />

      <Toaster />
    </>
  );
};

export const config = defineRouteConfig({
  label: "Store Credits",
  icon: CurrencyDollar,
});

export default StoreCreditAccountsPage;
