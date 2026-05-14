import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Toaster } from "@medusajs/ui";
import GiftCardIcon from "../../components/icons/gift-card-icon";
import { TwoColumnLayout } from "../../components/layouts/two-column";
import GiftCardProductsSection from "./components/gift-card-products-section";
import { GiftCardsTable } from "./components/gift-cards-table/gift-cards-table";

const GiftCardsPage = () => {
  return (
    <>
      <TwoColumnLayout
        firstCol={<GiftCardsTable />}
        secondCol={<GiftCardProductsSection />}
      />

      <Toaster />
    </>
  );
};

export const config = defineRouteConfig({
  label: "Gift Cards",
  icon: GiftCardIcon,
});

export default GiftCardsPage;
