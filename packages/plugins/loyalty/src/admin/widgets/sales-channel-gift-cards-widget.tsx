import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { usePermissions } from "@medusajs/dashboard/hooks";
import { useParams } from "react-router-dom";
import { useSalesChannel } from "../hooks/api/sales-channels";
import { SalesChannelGiftCardsSection } from "./sales-channel-gift-cards/sales-channel-gift-cards-section";

const SalesChannelGiftCardsWidget = () => {
  const params = useParams();
  const { hasPermission } = usePermissions();
  const canReadProducts = hasPermission("product:read");

  const { sales_channel: salesChannel } = useSalesChannel(params.id!, {
    enabled: !!params.id && canReadProducts,
  });

  if (!canReadProducts || !salesChannel) {
    return null;
  }

  return <SalesChannelGiftCardsSection salesChannel={salesChannel} />;
};

export const config = defineWidgetConfig({
  zone: "sales_channel.details.after",
  id: "medusa:sales-channel-gift-cards-widget",
});

export default SalesChannelGiftCardsWidget;
