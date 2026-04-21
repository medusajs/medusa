import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { Client } from "../client"
import { Store } from "../store"

const baseUrl = "https://someurl.com"
const cartId = "cart-id"

// This is just a network-layer mocking, it doesn't start an actual server
const server = setupServer(
  http.post(`${baseUrl}/store/carts/*/promotions`, ({ request, params, cookies }) => {
    return HttpResponse.json({
        test: "addPromotions",
    });
  }),
  http.delete(`${baseUrl}/store/carts/*/promotions`, ({ request, params, cookies }) => {
    return HttpResponse.json({
        test: "removePromotions",
    });
  }),

  http.all("*", ({ request, params, cookies }) => {
    return new HttpResponse(null, {
      status: 404,
      statusText: "Not Found",
    })
  })
)

describe("Store", () => {
  let client: Client
  let store: Store

  beforeAll(() => {
    client = new Client({
      baseUrl,
    })
    store = new Store(client)

    server.listen()
  })
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())


  describe("cart", () => {
    it("should expose a function to add a promtion to a cart", async () => {
      const resp  = await store.cart.addPromotions(cartId, { promo_codes: ["promo-1", "promo-2"] });
      expect(resp).toEqual({
        test: "addPromotions",
      })
    });

    it("should expose a function to remove a promtion from a cart", async () => {
      const resp  = await store.cart.removePromotions(cartId, { promo_codes: ["promo-1", "promo-2"] });
      expect(resp).toEqual({
        test: "removePromotions",
      })
    });

  });
});
