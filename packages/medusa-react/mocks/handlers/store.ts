import { fixtures } from "../data"
import { rest } from "msw"

export const storeHandlers = [
  rest.get("/store/products", (req, res, ctx) => {
    const limit = parseInt(req.url.searchParams.get("limit") || "2")
    const offset = parseInt(req.url.searchParams.get("offset") || "0")
    return res(
      ctx.status(200),
      ctx.json({
        products: fixtures.list("product", limit),
        offset,
        limit,
      })
    )
  }),

  rest.get("/store/products/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        product: fixtures.get("product"),
      })
    )
  }),

  rest.get("/store/collections/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        collections: fixtures.list("product_collection"),
      })
    )
  }),

  rest.get("/store/collections/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        collection: fixtures.get("product_collection"),
      })
    )
  }),

  rest.get("/store/regions/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        regions: fixtures.list("region"),
      })
    )
  }),

  rest.get("/store/regions/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        region: fixtures.get("region"),
      })
    )
  }),

  rest.get("/store/gift-cards/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        gift_card: fixtures.get("gift_card"),
      })
    )
  }),

  rest.post("/store/order-edits/:id/decline", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order_edit: {...fixtures.get("order_edit"), declined_reason: req.body.declined_reason, status: 'declined'},
      })
    )
  }),

  rest.get("/store/orders/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.get("/store/orders/cart/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        order: fixtures.get("order"),
      })
    )
  }),

  rest.get("/store/orders/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        orders: fixtures.get("order"),
      })
    )
  }),

  rest.get("/store/return-reasons/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        return_reasons: fixtures.list("return_reason"),
      })
    )
  }),

  rest.get("/store/return-reasons/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        return_reason: fixtures.get("return_reason"),
      })
    )
  }),

  rest.get("/store/shipping-options/:cart_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        shipping_options: fixtures.list("shipping_option"),
      })
    )
  }),

  rest.get("/store/shipping-options/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        shipping_options: fixtures.list("shipping_option", 5),
      })
    )
  }),

  rest.get("/store/swaps/:cart_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        swap: fixtures.get("swap"),
      })
    )
  }),

  rest.get("/store/customers/me", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        customer: fixtures.get("customer"),
      })
    )
  }),

  rest.get("/store/customers/me/orders", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        orders: fixtures.list("order", 5),
        limit: 5,
        offset: 0,
      })
    )
  }),

  rest.post("/store/customers/", (req, res, ctx) => {
    const body = req.body as Record<string, string>
    const dummyCustomer = fixtures.get("customer")
    const customer = {
      ...dummyCustomer,
      ...body,
    }

    return res(
      ctx.status(200),
      ctx.json({
        customer,
      })
    )
  }),

  rest.post("/store/customers/me", (req, res, ctx) => {
    const body = req.body as Record<string, string>
    const dummyCustomer = fixtures.get("customer")
    const customer = {
      ...dummyCustomer,
      ...body,
    }

    return res(
      ctx.status(200),
      ctx.json({
        customer,
      })
    )
  }),

  rest.get("/store/carts/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        cart: fixtures.get("cart"),
      })
    )
  }),

  rest.post("/store/returns/", (req, res, ctx) => {
    const { items, ...body } = req.body as Record<string, any>
    const ret = fixtures.get("return")
    const item = ret.items[0]
    ret.items = items.map((i) => ({ ...i, ...item }))

    return res(
      ctx.status(200),
      ctx.json({
        return: {
          ...ret,
          ...body,
        },
      })
    )
  }),

  rest.post("/store/swaps/", (req, res, ctx) => {
    const { additional_items, return_items, ...body } = req.body as Record<
      string,
      any
    >
    const swap = fixtures.get("swap")
    const additional_item = swap.additional_items[0]
    swap.additional_items = additional_items.map((i) => ({
      ...i,
      ...additional_item,
    }))
    const return_item = swap.return_order.items[0]
    swap.return_order.items = return_items.map((i) => ({
      ...i,
      ...return_item,
    }))

    return res(
      ctx.status(200),
      ctx.json({
        swap: {
          ...swap,
          ...body,
        },
      })
    )
  }),

  rest.post("/store/carts/:id/line-items", (req, res, ctx) => {
    const { id } = req.params
    const { quantity, variant_id } = req.body as Record<string, any>
    const item = fixtures.get("line_item")
    return res(
      ctx.status(200),
      ctx.json({
        cart: {
          ...fixtures.get("cart"),
          id,
          items: [
            {
              ...item,
              quantity,
              variant_id,
            },
          ],
        },
      })
    )
  }),

  rest.post("/store/carts/:id/line-items/:line_id", (req, res, ctx) => {
    const { id, line_id } = req.params
    const { quantity } = req.body as Record<string, any>
    const item = fixtures.get("line_item")
    return res(
      ctx.status(200),
      ctx.json({
        cart: {
          ...fixtures.get("cart"),
          id,
          items: [
            {
              ...item,
              id: line_id,
              quantity,
            },
          ],
        },
      })
    )
  }),

  rest.delete("/store/carts/:id/line-items/:line_id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        cart: fixtures.get("cart"),
      })
    )
  }),

  rest.post("/store/carts/", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        cart: fixtures.get("cart"),
      })
    )
  }),

  rest.post("/store/carts/:id", (req, res, ctx) => {
    const { id } = req.params
    const body = req.body as Record<string, any>
    return res(
      ctx.status(200),
      ctx.json({
        cart: {
          ...fixtures.get("cart"),
          id,
          ...body,
        },
      })
    )
  }),

  rest.post("/store/carts/:id/complete", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        type: "order",
        data: fixtures.get("order"),
      })
    )
  }),

  rest.post("/store/carts/:id/payment-sessions", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        cart: {
          ...fixtures.get("cart"),
          id,
        },
      })
    )
  }),

  rest.post(
    "/store/carts/:id/payment-sessions/:provider_id",
    (req, res, ctx) => {
      const { id } = req.params
      return res(
        ctx.status(200),
        ctx.json({
          cart: {
            ...fixtures.get("cart"),
            id,
          },
        })
      )
    }
  ),

  rest.post(
    "/store/carts/:id/payment-sessions/:provider_id/refresh",
    (req, res, ctx) => {
      const { id } = req.params
      return res(
        ctx.status(200),
        ctx.json({
          cart: {
            ...fixtures.get("cart"),
            id,
          },
        })
      )
    }
  ),

  rest.post("/store/carts/:id/payment-session", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        cart: {
          ...fixtures.get("cart"),
          id,
        },
      })
    )
  }),

  rest.delete(
    "/store/carts/:id/payment-sessions/:provider_id",
    (req, res, ctx) => {
      const { id } = req.params
      return res(
        ctx.status(200),
        ctx.json({
          cart: {
            ...fixtures.get("cart"),
            id,
          },
        })
      )
    }
  ),

  rest.post("/store/carts/:id/shipping-methods", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        cart: {
          ...fixtures.get("cart"),
          id,
        },
      })
    )
  }),
]
