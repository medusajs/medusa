import { fixtures } from "../data"
import { rest } from "msw"

export const adminHandlers = [
  rest.post("/admin/collections/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        collection: {
          ...fixtures.get("product_collection"),
          ...body,
        },
      })
    )
  }),

  rest.get("/admin/collections/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        collections: fixtures.list("product_collection"),
      })
    )
  }),

  rest.get("/admin/collections/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        collection: fixtures.get("product_collection"),
      })
    )
  }),

  rest.post("/admin/collections/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        collection: {
          ...fixtures.get("product_collection"),
          ...body,
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/collections/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "collection",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/gift-cards/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        gift_card: {
          ...fixtures.get("gift_card"),
          ...body,
        },
      })
    )
  }),

  rest.get("/admin/gift-cards/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        gift_cards: fixtures.list("gift_card"),
      })
    )
  }),

  rest.get("/admin/gift-cards/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        gift_card: fixtures.get("gift_card"),
      })
    )
  }),

  rest.post("/admin/gift-cards/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        gift_card: {
          ...fixtures.get("gift_card"),
          ...body,
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/gift-cards/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "gift_card",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/notes/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        note: {
          ...fixtures.get("note"),
          ...body,
        },
      })
    )
  }),

  rest.get("/admin/notes/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        notes: fixtures.list("note"),
      })
    )
  }),

  rest.get("/admin/notes/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        note: fixtures.get("note"),
      })
    )
  }),

  rest.post("/admin/notes/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        note: {
          ...fixtures.get("note"),
          ...body,
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/notes/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "note",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/return-reasons/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        return_reason: {
          ...fixtures.get("return_reason"),
          ...body,
        },
      })
    )
  }),

  rest.get("/admin/return-reasons/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        return_reasons: fixtures.list("return_reason"),
      })
    )
  }),

  rest.get("/admin/return-reasons/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        return_reason: fixtures.get("return_reason"),
      })
    )
  }),

  rest.post("/admin/return-reasons/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        return_reason: {
          ...fixtures.get("return_reason"),
          ...body,
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/return-reasons/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "return_reason",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/shipping-options/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        shipping_option: {
          ...fixtures.get("shipping_option"),
          ...body,
        },
      })
    )
  }),

  rest.get("/admin/shipping-options/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        shipping_options: fixtures.list("shipping_option"),
      })
    )
  }),

  rest.get("/admin/shipping-options/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        shipping_option: fixtures.get("shipping_option"),
      })
    )
  }),

  rest.post("/admin/shipping-options/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        shipping_option: {
          ...fixtures.get("shipping_option"),
          ...body,
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/shipping-options/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "shipping_option",
        deleted: true,
      })
    )
  }),

  rest.get("/admin/notifications/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        notifications: fixtures.list("notification"),
      })
    )
  }),

  rest.post("/admin/notifications/:id/resend", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        notification: {
          ...fixtures.get("notification"),
          id: req.params.id,
          ...(req.body as any),
        },
      })
    )
  }),

  rest.get("/admin/invites", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        invites: fixtures.list("invite"),
      })
    )
  }),

  rest.post("/admin/invites/accept", (req, res, ctx) => {
    return res(ctx.status(200))
  }),

  rest.post("/admin/invites", (req, res, ctx) => {
    return res(ctx.status(200))
  }),

  rest.post("/admin/invites/:id", (req, res, ctx) => {
    return res(ctx.status(200))
  }),

  rest.delete("/admin/invites/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "invite",
        deleted: true,
      })
    )
  }),

  rest.get("/admin/returns", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        returns: fixtures.list("return"),
      })
    )
  }),

  rest.post("/admin/returns/:id/receive", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        return: fixtures.get("return"),
      })
    )
  }),

  rest.post("/admin/returns/:id/cancel", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/shipping-profiles/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        shipping_profile: {
          ...fixtures.get("shipping_profile"),
          ...body,
        },
      })
    )
  }),

  rest.get("/admin/shipping-profiles/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        shipping_profiles: fixtures.list("shipping_profile"),
      })
    )
  }),

  rest.get("/admin/shipping-profiles/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        shipping_profile: fixtures.get("shipping_profile"),
      })
    )
  }),

  rest.post("/admin/shipping-profiles/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        shipping_profile: {
          ...fixtures.get("shipping_profile"),
          ...body,
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/shipping-profiles/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "shipping_profile",
        deleted: true,
      })
    )
  }),

  rest.get("/admin/store/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        store: fixtures.get("store"),
      })
    )
  }),

  rest.post("/admin/store/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        store: {
          ...fixtures.get("store"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/store/:currency_code", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        store: fixtures.get("store"),
      })
    )
  }),

  rest.delete("/admin/store/currencies/:currency_code", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        store: fixtures.get("store"),
      })
    )
  }),

  rest.get("/admin/store/payment-providers", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        payment_providers: fixtures.get("store").payment_providers,
      })
    )
  }),

  rest.get("/admin/customers/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customers: fixtures.list("customer"),
      })
    )
  }),

  rest.get("/admin/customers/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customer: fixtures.get("customer"),
      })
    )
  }),

  rest.post("/admin/customers/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customer: {
          ...fixtures.get("customer"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/customers/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customer: {
          ...fixtures.get("customer"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.get("/admin/discounts/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discounts: fixtures.list("discount"),
      })
    )
  }),

  rest.get("/admin/discounts/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: fixtures.get("discount"),
      })
    )
  }),

  rest.get("/admin/discounts/code/:code", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: fixtures.get("discount"),
      })
    )
  }),

  rest.post("/admin/discounts/:id/regions/:region_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: fixtures.get("discount"),
      })
    )
  }),

  rest.post("/admin/discounts/:id/products/:product_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: fixtures.get("discount"),
      })
    )
  }),

  rest.post("/admin/discounts/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: {
          ...fixtures.get("discount"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/discounts/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: {
          ...fixtures.get("discount"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/discounts/:id/dynamic-codes", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: {
          ...fixtures.get("discount"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.delete("/admin/discounts/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "discount",
        deleted: true,
      })
    )
  }),

  rest.delete("/admin/discounts/:id/dynamic-codes/:code", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: fixtures.get("discount"),
      })
    )
  }),

  rest.delete("/admin/discounts/:id/regions/:region_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: fixtures.get("discount"),
      })
    )
  }),

  rest.delete("/admin/discounts/:id/products/:product_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: fixtures.get("discount"),
      })
    )
  }),

  rest.get("/admin/draft-orders/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        draft_orders: fixtures.list("draft_order"),
      })
    )
  }),

  rest.get("/admin/draft-orders/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        draft_order: fixtures.get("draft_order"),
      })
    )
  }),

  rest.post("/admin/draft-orders/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        draft_order: {
          ...fixtures.get("draft_order"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/draft-orders/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        draft_order: {
          ...fixtures.get("draft_order"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.delete("/admin/draft-orders/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: fixtures.get("draft_order").id,
        object: "draft_order",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/draft-orders/:id/line-items", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        draft_order: fixtures.get("draft_order"),
      })
    )
  }),

  rest.post("/admin/draft-orders/:id/line-items/:item_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        draft_order: fixtures.get("draft_order"),
      })
    )
  }),

  rest.delete(
    "/admin/draft-orders/:id/line-items/:item_id",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          draft_order: fixtures.get("draft_order"),
        })
      )
    }
  ),

  rest.post("/admin/draft-orders/:id/pay", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.get("/admin/swaps/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        swaps: fixtures.list("swap"),
      })
    )
  }),

  rest.get("/admin/swaps/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        swap: fixtures.get("swap"),
      })
    )
  }),

  rest.get("/admin/variants/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        variants: fixtures.list("product_variant"),
      })
    )
  }),

  rest.get("/admin/users/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: fixtures.get("user"),
      })
    )
  }),

  rest.get("/admin/users/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        users: fixtures.list("user"),
      })
    )
  }),

  rest.post("/admin/users/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          ...fixtures.get("user"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/users/password-token", (req, res, ctx) => {
    return res(ctx.status(200))
  }),

  rest.post("/admin/users/reset-password", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: fixtures.get("user"),
      })
    )
  }),

  rest.post("/admin/users/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          ...fixtures.get("user"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.delete("/admin/users/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: fixtures.get("user").id,
        object: "user",
        deleted: true,
      })
    )
  }),

  rest.get("/admin/products/types", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        types: fixtures.list("product_type"),
      })
    )
  }),

  rest.get("/admin/products/tag-usage", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        tags: fixtures.list("product_tag"),
      })
    )
  }),

  rest.get("/admin/products/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product: fixtures.get("product"),
      })
    )
  }),

  rest.get("/admin/products/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        products: fixtures.list("product"),
      })
    )
  }),

  rest.post("/admin/products/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product: {
          ...fixtures.get("product"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/products/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product: {
          ...fixtures.get("product"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.delete("/admin/products/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "product",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/products/:id/metadata", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product: fixtures.get("product"),
      })
    )
  }),

  rest.post("/admin/products/:id/variants", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product: fixtures.get("product"),
      })
    )
  }),

  rest.post("/admin/products/:id/variants/:variant_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product: fixtures.get("product"),
      })
    )
  }),

  rest.delete("/admin/products/:id/variants/:variant_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        variant_id: req.params.variant_id,
        object: "product-variant",
        deleted: true,
        product: fixtures.get("product"),
      })
    )
  }),

  rest.post("/admin/products/:id/options", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product: fixtures.get("product"),
      })
    )
  }),

  rest.post("/admin/products/:id/options/:option_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product: fixtures.get("product"),
      })
    )
  }),

  rest.delete("/admin/products/:id/options/:option_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        option_id: req.params.option_id,
        object: "option",
        deleted: true,
        product: fixtures.get("product"),
      })
    )
  }),

  rest.get("/admin/regions/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: fixtures.get("region"),
      })
    )
  }),

  rest.get("/admin/regions/:id/fulfillment-options", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        fulfillment_options: fixtures.get("fulfillment_option"),
      })
    )
  }),

  rest.get("/admin/regions/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        regions: fixtures.list("region"),
      })
    )
  }),

  rest.post("/admin/regions/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: {
          ...fixtures.get("region"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/regions/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: {
          ...fixtures.get("region"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.delete("/admin/regions/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "region",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/regions/:id/metadata", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: fixtures.get("region"),
      })
    )
  }),

  rest.delete("/admin/regions/:id/metadata/:key", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: fixtures.get("region"),
      })
    )
  }),

  rest.post("/admin/regions/:id/countries", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: fixtures.get("product"),
      })
    )
  }),

  rest.delete("/admin/regions/:id/countries/:code", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: fixtures.get("product"),
      })
    )
  }),

  rest.post("/admin/regions/:id/fulfillment-providers", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: fixtures.get("region"),
      })
    )
  }),

  rest.delete(
    "/admin/regions/:id/fulfillment-providers/:provider_id",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          region: fixtures.get("region"),
        })
      )
    }
  ),

  rest.delete(
    "/admin/regions/:id/payment-providers/:provider_id",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          region: fixtures.get("region"),
        })
      )
    }
  ),

  rest.post("/admin/regions/:id/payment-providers", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: fixtures.get("region"),
      })
    )
  }),

  rest.get("/admin/orders/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.get("/admin/orders/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        orders: fixtures.list("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: {
          ...fixtures.get("order"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/orders/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: {
          ...fixtures.get("order"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/orders/:id/complete", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/capture", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/refund", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/fulfillment", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post(
    "/admin/orders/:id/fulfillments/:fulfillment_id/cancel",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          order: fixtures.get("order"),
        })
      )
    }
  ),

  rest.post(
    "/admin/orders/:id/swaps/:swap_id/fulfillments/:fulfillment_id/cancel",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          order: fixtures.get("order"),
        })
      )
    }
  ),

  rest.post(
    "/admin/orders/:id/claims/:claim_id/fulfillments/:fulfillment_id/cancel",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          order: fixtures.get("order"),
        })
      )
    }
  ),

  rest.post("/admin/orders/:id/shipment", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/return", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/cancel", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/shipping-methods", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/archive", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/swaps", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/swaps/:swap_id/cancel", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/swaps/:swap_id/receive", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post(
    "/admin/orders/:id/swaps/:swap_id/fulfillments",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          order: fixtures.get("order"),
        })
      )
    }
  ),

  rest.post("/admin/orders/:id/swaps/:swap_id/shipments", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post(
    "/admin/orders/:id/swaps/:swap_id/process-payment",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          order: fixtures.get("order"),
        })
      )
    }
  ),

  rest.post("/admin/orders/:id/claims", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/claims/:claim_id/cancel", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post("/admin/orders/:id/claims/:claim_id/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.post(
    "/admin/orders/:id/claims/:claim_id/fulfillments",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          order: fixtures.get("order"),
        })
      )
    }
  ),

  rest.post("/admin/orders/:id/claims/:claim_id/shipments", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.delete("/admin/orders/:id/metadata/:key", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.get("/admin/auth", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: fixtures.get("user"),
      })
    )
  }),

  rest.post("/admin/auth", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: fixtures.get("user"),
      })
    )
  }),

  rest.delete("/admin/auth", (req, res, ctx) => {
    return res(ctx.status(200))
  }),
]
