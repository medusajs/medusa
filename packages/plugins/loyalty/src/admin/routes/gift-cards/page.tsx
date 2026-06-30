import { defineRouteConfig } from "@zjedene-medusa/admin-sdk";
import { Gift } from "@zjedene-medusa/icons";
import { Toaster } from "@zjedene-medusa/ui";
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
  icon: Gift,
});

export default GiftCardsPage;
