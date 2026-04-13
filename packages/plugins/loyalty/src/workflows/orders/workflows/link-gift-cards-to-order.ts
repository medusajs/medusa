import { Modules } from "@medusajs/framework/utils";
import {
  createLinksWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PluginModule } from "../../../types";

/*
  A workflow that clones gift cards from a cart to an order
*/
export const cloneCartGiftCardsToOrderWorkflow = createWorkflow(
  "clone-cart-gift-cards-to-order",
  function (input: { order_id: string; cart_id: string }) {
    const orderQuery = useQueryGraphStep({
      entity: "order",
      filters: { id: input.order_id },
      fields: [
        "id",
        "currency_code",
        "total",
        "gift_cards.code",
        "customer_id",
      ],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-order-query" });

    const order = transform({ orderQuery }, ({ orderQuery }) => {
      return orderQuery.data[0];
    });

    const cartQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: ["id", "currency_code", "total", "gift_cards.id", "customer_id"],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-cart-query" });

    const cart = transform({ cartQuery }, ({ cartQuery }) => {
      return cartQuery.data[0];
    });

    const giftCardIds = transform({ cart }, ({ cart }) => {
      return cart.gift_cards.map((giftCard) => giftCard.id);
    });

    const giftCardsQuery = useQueryGraphStep({
      entity: "gift_card",
      filters: { id: giftCardIds },
      fields: ["id", "code", "status", "customer_id", "currency_code"],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-gift-card-query" });

    const giftCards = transform({ giftCardsQuery }, ({ giftCardsQuery }) => {
      return giftCardsQuery.data;
    });

    const linksToCreate = transform(
      { giftCards, order },
      ({ giftCards, order }) => {
        const links = giftCards.map((giftCard) => ({
          [Modules.ORDER]: { order_id: order.id },
          [PluginModule.LOYALTY]: { gift_card_id: giftCard.id },
        }));

        return links;
      }
    );

    createLinksWorkflow.runAsStep({ input: linksToCreate });

    return new WorkflowResponse(null);
  }
);
