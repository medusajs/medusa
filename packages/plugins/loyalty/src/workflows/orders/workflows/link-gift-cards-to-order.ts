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

/**
 * Input to clone gift card links from a cart to a newly created order.
 */
export interface CloneCartGiftCardsToOrderWorkflowInput {
  /**
   * The ID of the order to link the gift cards to.
   */
  order_id: string
  /**
   * The ID of the cart that the order was created from.
   */
  cart_id: string
}

/**
 * This workflow clones gift cards from a cart to an order by creating links between
 * the order and the gift cards that were applied to the cart.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around linking gift cards to an order.
 *
 * @example
 * const { result } = await cloneCartGiftCardsToOrderWorkflow(container)
 *   .run({
 *     input: {
 *       order_id: "order_123",
 *       cart_id: "cart_123",
 *     },
 *   })
 *
 * @summary
 *
 * Clone gift card links from a cart to an order.
 */
export const cloneCartGiftCardsToOrderWorkflow = createWorkflow(
  "clone-cart-gift-cards-to-order",
  function (input: CloneCartGiftCardsToOrderWorkflowInput) {
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
