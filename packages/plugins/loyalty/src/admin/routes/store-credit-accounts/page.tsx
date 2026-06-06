import { defineRouteConfig } from "@zjedene-medusa/admin-sdk";
import { Toaster } from "@zjedene-medusa/ui";
import StoreCreditIcon from "../../components/icons/store-credit-icon";
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
  icon: StoreCreditIcon,
});

export default StoreCreditAccountsPage;
