import { rest } from "msw"
import { fixtures } from "../data"

export const adminHandlers = [
  rest.post("/admin/batch-jobs/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        batch_job: {
          ...fixtures.get("batch_job"),
          ...body,
        },
      })
    )
  }),

  rest.get("/admin/batch-jobs/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        batch_jobs: fixtures.list("batch_job"),
      })
    )
  }),

  rest.get("/admin/batch-jobs/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        batch_job: fixtures.get("batch_job"),
      })
    )
  }),

  rest.post("/admin/batch-jobs/:id/confirm", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        batch_job: fixtures.get("batch_job"),
      })
    )
  }),

  rest.post("/admin/batch-jobs/:id/cancel", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        batch_job: fixtures.get("batch_job"),
      })
    )
  }),

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

  rest.post("/admin/collections/:id/products/batch", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        collection: {
          ...fixtures.get("product_collection"),
          products: [fixtures.get("product")],
        },
      })
    )
  }),

  rest.delete("/admin/collections/:id/products/batch", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "product-collection",
        removed_products: [fixtures.get("product").id],
      })
    )
  }),

  rest.get("/admin/product-categories/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product_categories: fixtures.list("product_category"),
      })
    )
  }),

  rest.get("/admin/product-categories/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product_category: fixtures.get("product_category"),
      })
    )
  }),

  rest.post("/admin/product-categories/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        product_category: {
          ...fixtures.get("product_category"),
          ...body,
        },
      })
    )
  }),

  rest.post("/admin/product-categories/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        product_category: {
          ...fixtures.get("product_category"),
          ...body,
        },
      })
    )
  }),

  rest.delete("/admin/product-categories/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "product-category",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/product-categories/:id/products/batch", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product_category: fixtures.get("product_category"),
      })
    )
  }),

  rest.delete(
    "/admin/product-categories/:id/products/batch",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          product_category: fixtures.get("product_category"),
        })
      )
    }
  ),

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

  rest.post("/admin/price-lists/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        price_list: {
          ...fixtures.get("price_list"),
          ...body,
        },
      })
    )
  }),

  rest.get("/admin/price-lists/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        price_lists: fixtures.list("price_list"),
        count: 2,
        offset: 0,
        limit: 10,
      })
    )
  }),

  rest.get("/admin/price-lists/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        price_list: fixtures.get("price_list"),
      })
    )
  }),

  rest.post("/admin/price-lists/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        price_list: {
          ...fixtures.get("price_list"),
          ...body,
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/price-lists/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "price_list",
        deleted: true,
      })
    )
  }),

  rest.delete("/admin/price-lists/:id/prices/batch", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        ids: body.price_ids,
        object: "money-amount",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/price-lists/:id/prices/batch", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        price_list: {
          ...fixtures.get("price_list"),
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete(
    "/admin/price-lists/:id/products/:product_id/prices",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          ids: [],
          object: "money-amount",
          deleted: true,
        })
      )
    }
  ),

  rest.delete(
    "/admin/price-lists/:id/variants/:variant_id/prices",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          ids: [],
          object: "money-amount",
          deleted: true,
        })
      )
    }
  ),

  rest.get("/admin/reservations/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        reservations: fixtures.list("reservation"),
      })
    )
  }),
  rest.post("/admin/reservations/", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        reservation: {
          ...fixtures.get("reservation"),
          ...body,
        },
      })
    )
  }),
  rest.get("/admin/reservations/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        reservation: { ...fixtures.get("reservation"), id: req.params.id },
      })
    )
  }),

  rest.post("/admin/reservations/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>

    return res(
      ctx.status(200),
      ctx.json({
        reservation: {
          ...fixtures.get("reservation"),
          ...body,
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/reservations/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "reservation",
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

  rest.get("/admin/stock-locations", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        stock_locations: fixtures.list("stock_location"),
      })
    )
  }),
  rest.post("/admin/stock-locations", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        stock_location: {
          ...fixtures.get("stock_location"),
          ...(req.body as any),
        },
      })
    )
  }),
  rest.get("/admin/stock-locations/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        stock_location: {
          ...fixtures.get("stock_location"),
          id: req.params.id,
        },
      })
    )
  }),

  rest.post("/admin/stock-locations/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        stock_location: {
          ...fixtures.get("stock_location"),
          ...(req.body as any),
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/stock-locations/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "stock_location",
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

  // inventory
  rest.get("/admin/inventory-items", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        inventory_items: fixtures.list("inventory_item"),
      })
    )
  }),

  rest.get("/admin/inventory-items/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        inventory_item: fixtures.get("inventory_item"),
      })
    )
  }),

  rest.post("/admin/inventory-items/:id", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        inventory_item: {
          ...fixtures.get("inventory_item"),
          ...body,
          id: req.params.id,
        },
      })
    )
  }),

  rest.delete("/admin/inventory-items/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "inventory_item",
        deleted: true,
      })
    )
  }),

  rest.get("/admin/inventory-items/:id/location-levels", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        inventory_item: {
          ...fixtures.get("inventory_item"),
          id: req.params.id,
        },
      })
    )
  }),

  rest.post("/admin/inventory-items/:id/location-levels", (req, res, ctx) => {
    const body = req.body as Record<string, any>
    const { location_levels } = fixtures.get("inventory_item")
    return res(
      ctx.status(200),
      ctx.json({
        inventory_item: {
          ...fixtures.get("inventory_item"),
          id: req.params.id,
          location_levels: [...location_levels, { ...body, id: "2" }],
        },
      })
    )
  }),

  rest.post(
    "/admin/inventory-items/:id/location-levels/:location_id",
    (req, res, ctx) => {
      const body = req.body as Record<string, any>
      const inventoryItem = fixtures.get("inventory_item")
      const locationlevel = { ...inventoryItem.location_levels[0], ...body }
      return res(
        ctx.status(200),
        ctx.json({
          inventory_item: {
            ...fixtures.get("inventory_item"),
            id: req.params.id,
            location_levels: [locationlevel],
          },
        })
      )
    }
  ),

  rest.delete(
    "/admin/inventory-items/:id/location-levels/:location_id",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          inventory_item: {
            ...fixtures.get("inventory_item"),
            id: req.params.id,
            location_levels: [],
          },
        })
      )
    }
  ),

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

  rest.get("/admin/customer-groups/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customer_groups: fixtures.list("customer_group"),
      })
    )
  }),

  rest.get("/admin/customer-groups/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customer_group: fixtures.get("customer_group"),
      })
    )
  }),

  rest.post("/admin/customer-groups/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customer_group: {
          ...fixtures.get("customer_group"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/customer-groups/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customer_group: {
          ...fixtures.get("customer_group"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.get("/admin/customer-groups/:id/customers", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customers: fixtures.list("customer"),
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

  rest.post("/admin/discounts/:id/conditions", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: {
          ...fixtures.get("discount"),
        },
      })
    )
  }),

  rest.post("/admin/discounts/:id/conditions/:conditionId", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount: {
          ...fixtures.get("discount"),
        },
      })
    )
  }),

  rest.get("/admin/discounts/:id/conditions/:conditionId", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        discount_condition: {
          ...fixtures
            .get("discount")
            .rule.conditions.find((c) => c.id === req.params.conditionId),
        },
      })
    )
  }),

  rest.delete(
    "/admin/discounts/:id/conditions/:conditionId",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: req.params.conditionId,
          object: "discount-condition",
          deleted: true,
          discount: fixtures.get("discount"),
        })
      )
    }
  ),

  rest.post(
    "/admin/discounts/:id/conditions/:conditionId/batch",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          discount: {
            ...fixtures.get("discount"),
            rule: {
              ...fixtures.get("discount").rule,
              conditions: [
                {
                  ...fixtures.get("discount").rule.conditions[0],
                  products: [
                    ...(fixtures.get("discount").rule.conditions[0]?.products ??
                      []),
                    ...(req.body as any).resources,
                  ],
                },
              ],
            },
          },
        })
      )
    }
  ),

  rest.delete(
    "/admin/discounts/:id/conditions/:conditionId/batch",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          discount: {
            ...fixtures.get("discount"),
            rule: {
              ...fixtures.get("discount").rule,
              conditions: [
                {
                  ...fixtures.get("discount").rule.conditions[0],
                  products: [],
                },
              ],
            },
          },
        })
      )
    }
  ),

  rest.get("/admin/publishable-api-keys/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        publishable_api_keys: fixtures.list("publishable_api_key"),
      })
    )
  }),

  rest.get("/admin/publishable-api-keys/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        publishable_api_key: fixtures.get("publishable_api_key"),
      })
    )
  }),

  rest.post("/admin/publishable-api-keys/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        publishable_api_key: {
          ...fixtures.get("publishable_api_key"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post(
    "/admin/publishable-api-keys/:id/sales-channels/batch",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          publishable_api_key: {
            ...fixtures.get("publishable_api_key"),
            ...(req.body as any),
          },
        })
      )
    }
  ),

  rest.delete(
    "/admin/publishable-api-keys/:id/sales-channels/batch",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          publishable_api_key: {
            ...fixtures.get("publishable_api_key"),
            ...(req.body as any),
          },
        })
      )
    }
  ),

  rest.get(
    "/admin/publishable-api-keys/:id/sales-channels",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          sales_channels: fixtures.get("sales_channels"),
        })
      )
    }
  ),

  rest.post("/admin/publishable-api-keys/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        publishable_api_key: {
          ...fixtures.get("publishable_api_key"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/publishable-api-keys/:id/revoke", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        publishable_api_key: {
          ...fixtures.get("publishable_api_key"),
          revoked_at: "2022-11-10 11:17:46.666Z",
          revoked_by: "admin_user",
        },
      })
    )
  }),

  rest.delete("/admin/publishable-api-keys/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: fixtures.get("publishable_api_key").id,
        object: "publishable_api_key",
        deleted: true,
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

  rest.get("/admin/variants/:id", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        variant: {...fixtures.get("product_variant"), id: id},
      })
    )
  }),

  rest.get("/admin/variants/:id/inventory", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        variant: {
          ...fixtures.get("product_variant"),
          sales_channel_availability: [
            {
              channel_name: "default channel",
              channel_id: "1",
              available_quantity: 10,
            },
          ],
        },
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

  rest.get("/admin/order-edits/:id", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: fixtures.get("order_edit"),
        id,
      })
    )
  }),

  rest.get("/admin/order-edits/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        count: 1,
        limit: 20,
        offset: 0,
        order_edits: [fixtures.get("order_edit")],
      })
    )
  }),

  rest.post("/admin/order-edits/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: {
          ...fixtures.get("order_edit"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.get("/store/order-edits/:id", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: fixtures.get("store_order_edit"),
        id,
      })
    )
  }),

  rest.post("/admin/order-edits/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: { ...fixtures.get("order_edit"), ...(req.body as any) },
      })
    )
  }),

  rest.post("/admin/order-edits/:id/cancel", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: {
          ...fixtures.get("order_edit"),
          canceled_at: new Date(),
          status: "canceled",
        },
      })
    )
  }),

  rest.post("/admin/order-edits/:id/confirm", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: {
          ...fixtures.get("order_edit"),
          confirmed_at: new Date(),
          status: "confirmed",
        },
      })
    )
  }),

  rest.post("/admin/order-edits/:id/items", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: { ...fixtures.get("order_edit"), ...(req.body as any) },
      })
    )
  }),

  rest.post("/admin/order-edits/:id/request", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: {
          ...fixtures.get("order_edit"),
          requested_at: new Date(),
          status: "requested",
        },
      })
    )
  }),

  rest.delete("/admin/order-edits/:id", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        id,
        object: "order_edit",
        deleted: true,
      })
    )
  }),

  rest.delete("/admin/order-edits/:id/changes/:change_id", (req, res, ctx) => {
    const { change_id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        id: change_id,
        object: "item_change",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/order-edits/:id/items/:item_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: {
          ...fixtures.get("order_edit"),
          changes: [
            {
              quantity: (req.body as any).quantity,
            },
          ],
        },
      })
    )
  }),

  rest.delete("/admin/order-edits/:id/items/:item_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: {
          ...fixtures.get("order_edit"),
          changes: [
            {
              type: "item_remove",
            },
          ],
        },
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

  rest.delete("/admin/uploads", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: (req.body as any).file_key,
        object: "file",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/uploads/download-url", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        download_url: fixtures.get("upload").url,
      })
    )
  }),

  rest.get("/admin/sales-channels/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        sales_channel: fixtures.get("sales_channel"),
      })
    )
  }),

  rest.get("/admin/sales-channels", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        count: 1,
        limit: 20,
        offset: 20,
        sales_channels: fixtures.get("sales_channels"),
      })
    )
  }),

  rest.post("/admin/sales-channels/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        sales_channel: {
          ...fixtures.get("sales_channel"),
          ...(req.body as any),
        },
      })
    )
  }),

  rest.post("/admin/sales-channels", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        sales_channel: fixtures.get("sales_channel"),
        ...(req.body as Record<string, unknown>),
      })
    )
  }),

  rest.delete("/admin/sales-channels/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "sales-channel",
        deleted: true,
      })
    )
  }),

  rest.delete("/admin/sales-channels/:id/products/batch", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        sales_channel: fixtures.get("sales_channel"),
      })
    )
  }),

  rest.post("/admin/sales-channels/:id/products/batch", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        sales_channel: fixtures.get("sales_channel"),
      })
    )
  }),

  rest.get("/admin/currencies", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        count: 1,
        limit: 20,
        offset: 20,
        currencies: fixtures.list("currency", 1),
      })
    )
  }),

  rest.post("/admin/currencies/:code", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        currency: { ...fixtures.get("currency"), ...(req.body as any) },
      })
    )
  }),

  rest.get("/admin/payment-collections/:id", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        payment_collection: {
          ...fixtures.get("payment_collection"),
          id,
        },
      })
    )
  }),

  rest.delete("/admin/payment-collections/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        object: "payment_collection",
        deleted: true,
      })
    )
  }),

  rest.post("/admin/payment-collections/:id", (req, res, ctx) => {
    const { id } = req.params
    const { description, metadata } = req.body as any

    return res(
      ctx.status(200),
      ctx.json({
        payment_collection: {
          ...fixtures.get("payment_collection"),
          description,
          metadata,
          id,
        },
      })
    )
  }),

  rest.post("/admin/payment-collections/:id/authorize", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        payment_collection: {
          ...fixtures.get("payment_collection"),
          id,
        },
      })
    )
  }),

  rest.get("/admin/payments/:id", (req, res, ctx) => {
    const { id } = req.params

    return res(
      ctx.status(200),
      ctx.json({
        payment: {
          ...fixtures.get("payment"),
          id,
        },
      })
    )
  }),

  rest.post("/admin/payments/:id/capture", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        payment: {
          ...fixtures.get("payment"),
          id,
        },
      })
    )
  }),

  rest.post("/admin/payments/:id/refund", (req, res, ctx) => {
    const { id } = req.params
    const { amount, reason, note } = req.body as any

    return res(
      ctx.status(200),
      ctx.json({
        refund: {
          ...fixtures.get("refund"),
          payment_id: id,
          amount,
          reason,
          note,
        },
      })
    )
  }),
]
