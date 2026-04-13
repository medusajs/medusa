import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Toaster } from "@medusajs/ui";
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
