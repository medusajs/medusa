import { defineRouteConfig } from "@zjedene-medusa/admin-sdk";
import { Toaster } from "@zjedene-medusa/ui";
import { GiftCardProductsTable } from "./components/gift-card-products-table/gift-card-products-table";

const GiftCardProductsPage = () => {
  return (
    <>
      <GiftCardProductsTable />

      <Toaster />
    </>
  );
};

export const config = defineRouteConfig({
  label: "Gift Card Products",
});

export default GiftCardProductsPage;
