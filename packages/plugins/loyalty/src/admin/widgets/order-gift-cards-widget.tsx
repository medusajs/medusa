import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Gift, TriangleRightMini } from "@medusajs/icons";
import { Container, StatusBadge } from "@medusajs/ui";
import { useParams } from "react-router-dom";
import { AdminGiftCard } from "../../types";
import { Header } from "../components/header";
import { NoRecords } from "../components/no-records";
import { SidebarLink } from "../components/sidebar-link";
import { useOrder } from "../hooks/api/order";
import { formatAmount } from "../utils/format-amount";

const OrderGiftCardsWidget = () => {
  const params = useParams();

  const { order } = useOrder(params.id!, {
    fields: "+*gift_cards",
  });

  if (!order?.gift_cards?.length) {
    return;
  }

  return (
    <Container className="divide-y p-0">
      <Header
        title="Gift Cards"
        subtitle="Gift cards that have been applied to this order"
        tooltip={`A credit line “refund” will always attempt to apply the credit to the customers store credit account first. If the customers doesn't have a store credit account, a new one will be created.`}
      />

      {order?.gift_cards?.length === 0 && (
        <NoRecords
          className="border-t"
          title="No gift cards"
          message="There are no gift cards on this order"
          icon={null}
        />
      )}

      {order?.gift_cards?.map((giftCard: AdminGiftCard) => {
        const hasGiftCardExpired =
          giftCard.expires_at && new Date(giftCard.expires_at) < new Date();

        return (
          <SidebarLink
            icon={<Gift />}
            key={giftCard.id}
            labelKey={giftCard.code}
            descriptionKey={formatAmount(
              (giftCard.value as number) ?? 0,
              giftCard.currency_code
            )}
            to={`/gift-cards/${giftCard.id}`}
          >
            <>
              <StatusBadge
                color={hasGiftCardExpired ? "orange" : "green"}
                className="capitalize"
              >
                {hasGiftCardExpired ? "Expired" : "Active"}
              </StatusBadge>

              <TriangleRightMini className="text-ui-fg-muted" />
            </>
          </SidebarLink>
        );
      })}
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
});

export default OrderGiftCardsWidget;
