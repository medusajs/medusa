import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Toaster } from "@medusajs/ui";
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
