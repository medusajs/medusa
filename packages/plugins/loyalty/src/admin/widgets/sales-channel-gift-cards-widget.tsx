import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useParams } from "react-router-dom";
import { useSalesChannel } from "../hooks/api/sales-channels";
import { SalesChannelGiftCardsSection } from "./sales-channel-gift-cards/sales-channel-gift-cards-section";

const SalesChannelGiftCardsWidget = () => {
  const params = useParams();

  const { sales_channel: salesChannel } = useSalesChannel(params.id!, {
    enabled: !!params.id,
  });

  if (!salesChannel) {
    return null;
  }

  return <SalesChannelGiftCardsSection salesChannel={salesChannel} />;
};

export const config = defineWidgetConfig({
  zone: "sales_channel.details.after",
});

export default SalesChannelGiftCardsWidget;
