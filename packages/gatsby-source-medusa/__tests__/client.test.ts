import { createClient } from "../src/client"
import { medusaRequest } from "../src/utils/medusaRequest"

jest.mock("../src/utils/medusaRequest");

afterEach(() => {
    medusaRequest.mockClear();
  });

describe("client", () => {
    it("should return all products", async () => {

        medusaRequest.mockResolvedValueOnce({
            data: { products: Array<object>(5).fill({}), count: 12 }
        }).mockResolvedValueOnce({
            data: { products: Array<object>(5).fill({}), count: 12 }
        }).mockResolvedValueOnce({
            data: { products: Array<object>(2).fill({}), count: 12 }
        });

        const client = createClient({ storeUrl: "baseURL" });
        const result = await client["products"]();

        expect(medusaRequest).toHaveBeenCalledTimes(3);
        expect(result).toHaveLength(12);
        expect(medusaRequest).nthCalledWith(1, "baseURL", "/store/products?offset=0")
        expect(medusaRequest).nthCalledWith(2, "baseURL", "/store/products?offset=5")
        expect(medusaRequest).nthCalledWith(3, "baseURL", "/store/products?offset=10")
    })

    it("should return all collections", async () => {
        
        medusaRequest.mockResolvedValueOnce({
            data: { collections: Array<object>(5).fill({}), count: 12 }
        }).mockResolvedValueOnce({
            data: { collections: Array<object>(5).fill({}), count: 12 }
        }).mockResolvedValueOnce({
            data: { collections: Array<object>(2).fill({}), count: 12 }
        });

        const client = createClient({ storeUrl: "baseURL" });
        const result = await client["collections"]();

        expect(medusaRequest).toHaveBeenCalledTimes(3);
        expect(result).toHaveLength(12);
        expect(medusaRequest).nthCalledWith(1, "baseURL", "/store/collections?offset=0")
        expect(medusaRequest).nthCalledWith(2, "baseURL", "/store/collections?offset=5")
        expect(medusaRequest).nthCalledWith(3, "baseURL", "/store/collections?offset=10")
    })
})