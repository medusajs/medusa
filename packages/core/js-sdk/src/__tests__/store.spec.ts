import { Store } from "../store"

describe("Store cart promotions", () => {
  it("should add promotions to cart", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      cart: {
        id: "cart_123",
      },
    })

    const store = new Store({ fetch: fetchMock } as any)
    const body = { promo_codes: ["PROMO_10"] }
    const query = { fields: "id,*promotions" }
    const headers = { "x-test": "header" }

    await store.cart.addPromotions("cart_123", body, query, headers)

    expect(fetchMock).toHaveBeenCalledWith("/store/carts/cart_123/promotions", {
      method: "POST",
      headers,
      body,
      query,
    })
  })

  it("should remove promotions from cart", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      cart: {
        id: "cart_123",
      },
    })

    const store = new Store({ fetch: fetchMock } as any)
    const body = { promo_codes: ["PROMO_10"] }
    const query = { fields: "id,*promotions" }
    const headers = { "x-test": "header" }

    await store.cart.removePromotions("cart_123", body, query, headers)

    expect(fetchMock).toHaveBeenCalledWith("/store/carts/cart_123/promotions", {
      method: "DELETE",
      headers,
      body,
      query,
    })
  })
})
