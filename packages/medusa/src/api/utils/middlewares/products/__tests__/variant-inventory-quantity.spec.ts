import {
  ContainerRegistrationKeys,
  deepCopy,
  getTotalVariantAvailability,
  getVariantAvailability,
  MedusaError,
} from "@medusajs/framework/utils"
import { MedusaRequest, MedusaStoreRequest } from "@medusajs/framework/http"
import {
  prepareInventoryQuantityFields,
  wrapVariantsWithInventoryQuantityForSalesChannel,
  wrapVariantsWithTotalInventoryQuantity,
} from "../variant-inventory-quantity"

jest.mock("@medusajs/framework/utils", () => {
  const originalModule = jest.requireActual("@medusajs/framework/utils")
  return {
    ...originalModule,
    getTotalVariantAvailability: jest.fn(),
    getVariantAvailability: jest.fn(),
  }
})

describe("variant-inventory-quantity", () => {
  let req
  let mockQuery
  let variants

  beforeEach(() => {
    mockQuery = jest.fn()
    variants = [
      { id: "variant-1", manage_inventory: true },
      { id: "variant-2", manage_inventory: true },
      { id: "variant-3", manage_inventory: false },
    ]

    req = {
      scope: {
        resolve: jest.fn().mockReturnValue(mockQuery),
      },
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("prepareInventoryQuantityFields", () => {
    it("should leave the fields untouched when inventory_quantity is not requested", () => {
      const fields = ["id", "title", "variants.*"]

      expect(
        prepareInventoryQuantityFields(fields, { relation: "variants" })
      ).toEqual({
        fields,
        withInventoryQuantity: false,
      })
    })

    it("should select the variant fields required to compute inventory_quantity", () => {
      expect(
        prepareInventoryQuantityFields(
          ["id", "title", "variants.inventory_quantity"],
          { relation: "variants" }
        )
      ).toEqual({
        fields: ["id", "title", "variants.id", "variants.manage_inventory"],
        withInventoryQuantity: true,
      })
    })

    it("should not duplicate already requested fields", () => {
      expect(
        prepareInventoryQuantityFields(
          [
            "id",
            "variants.id",
            "variants.manage_inventory",
            "variants.inventory_quantity",
            "variants.*",
          ],
          { relation: "variants" }
        )
      ).toEqual({
        fields: [
          "id",
          "variants.id",
          "variants.manage_inventory",
          "variants.*",
        ],
        withInventoryQuantity: true,
      })
    })

    it("should support variants being queried directly", () => {
      expect(
        prepareInventoryQuantityFields(["id", "inventory_quantity"])
      ).toEqual({
        fields: ["id", "manage_inventory"],
        withInventoryQuantity: true,
      })
    })

    it("should not treat a relation's inventory_quantity as the requested field when no relation is passed", () => {
      const fields = ["id", "variants.inventory_quantity"]

      expect(prepareInventoryQuantityFields(fields)).toEqual({
        fields,
        withInventoryQuantity: false,
      })
    })
  })

  describe("wrapVariantsWithTotalInventoryQuantity", () => {
    it("should not call getTotalVariantAvailability when variants array is empty", async () => {
      await wrapVariantsWithTotalInventoryQuantity(req as MedusaRequest, [])

      expect(getTotalVariantAvailability).not.toHaveBeenCalled()
    })

    it("should ignore nullish entries in the variants array", async () => {
      const mockAvailability = {
        "variant-1": { availability: 10 },
      }
      const _variants = [
        undefined,
        { id: "variant-1", manage_inventory: true },
        null,
      ] as any

      ;(getTotalVariantAvailability as jest.Mock).mockResolvedValueOnce(
        mockAvailability
      )

      await wrapVariantsWithTotalInventoryQuantity(
        req as MedusaRequest,
        _variants
      )

      expect(getTotalVariantAvailability).toHaveBeenCalledWith(mockQuery, {
        variant_ids: ["variant-1"],
      })
      expect(_variants[1].inventory_quantity).toBe(10)
    })

    it("should not call getTotalVariantAvailability when all variants are nullish", async () => {
      await wrapVariantsWithTotalInventoryQuantity(
        req as MedusaRequest,
        [undefined] as any
      )

      expect(getTotalVariantAvailability).not.toHaveBeenCalled()
    })

    it("should call getTotalVariantAvailability with correct parameters", async () => {
      const mockAvailability = {
        "variant-1": { availability: 10 },
        "variant-2": { availability: 5 },
      }

      ;(getTotalVariantAvailability as jest.Mock).mockResolvedValueOnce(
        mockAvailability
      )

      await wrapVariantsWithTotalInventoryQuantity(
        req as MedusaRequest,
        variants
      )

      expect(req.scope.resolve).toHaveBeenCalledWith(
        ContainerRegistrationKeys.QUERY
      )
      expect(getTotalVariantAvailability).toHaveBeenCalledWith(mockQuery, {
        variant_ids: ["variant-1", "variant-2", "variant-3"],
      })
    })

    it("should update inventory_quantity for variants with manage_inventory=true", async () => {
      const mockAvailability = {
        "variant-1": { availability: 10 },
        "variant-2": { availability: 5 },
        "variant-3": { availability: 20 },
        "variant-4": { availability: null },
      }
      const _variants = [
        ...variants,
        { id: "variant-4", manage_inventory: true },
      ]

      ;(getTotalVariantAvailability as jest.Mock).mockResolvedValueOnce(
        mockAvailability
      )

      await wrapVariantsWithTotalInventoryQuantity(
        req as MedusaRequest,
        _variants
      )

      expect(_variants[0].inventory_quantity).toBe(10)
      expect(_variants[1].inventory_quantity).toBe(5)
      expect(_variants[2].inventory_quantity).toBeUndefined()
      expect(_variants[3].inventory_quantity).toBeNull()
    })
  })

  describe("wrapVariantsWithInventoryQuantityForSalesChannel", () => {
    beforeEach(() => {
      req = {
        scope: {
          resolve: jest.fn().mockReturnValue(mockQuery),
        },
        publishable_key_context: {
          sales_channel_ids: ["sc-1"],
        },
        validatedQuery: {},
      }
    })

    it("should throw an error when multiple sales channels are available and no single one is specified", async () => {
      req.publishable_key_context.sales_channel_ids = ["sc-1", "sc-2"]
      req.validatedQuery = { sales_channel_id: ["sc-1", "sc-2"] }

      await expect(
        wrapVariantsWithInventoryQuantityForSalesChannel(
          req as MedusaStoreRequest<unknown>,
          variants
        )
      ).rejects.toThrow(MedusaError)
    })

    it("should use sales channel from query when single channel is specified", async () => {
      req.validatedQuery = { sales_channel_id: ["sc-2"] }
      req.publishable_key_context = {
        key: "test-key",
        sales_channel_ids: ["sc-1", "sc-2"],
      }
      const mockAvailability = {
        "variant-1": { availability: 7 },
        "variant-2": { availability: 3 },
      }

      ;(getVariantAvailability as jest.Mock).mockResolvedValueOnce(
        mockAvailability
      )

      await wrapVariantsWithInventoryQuantityForSalesChannel(
        req as MedusaStoreRequest<unknown>,
        variants
      )

      expect(getVariantAvailability).toHaveBeenCalledWith(mockQuery, {
        variant_ids: ["variant-1", "variant-2", "variant-3"],
        sales_channel_id: "sc-2",
      })
    })

    it("should use sales channel from publishable key when single channel is available", async () => {
      const mockAvailability = {
        "variant-1": { availability: 12 },
        "variant-2": { availability: 8 },
      }

      ;(getVariantAvailability as jest.Mock).mockResolvedValueOnce(
        mockAvailability
      )

      await wrapVariantsWithInventoryQuantityForSalesChannel(
        req as MedusaStoreRequest<unknown>,
        variants
      )

      expect(getVariantAvailability).toHaveBeenCalledWith(mockQuery, {
        variant_ids: ["variant-1", "variant-2", "variant-3"],
        sales_channel_id: "sc-1",
      })
    })

    it("should handle non-array sales_channel_id in query", async () => {
      req.validatedQuery = { sales_channel_id: "sc-2" }

      const originalPublishableKeyContext = deepCopy(
        req.publishable_key_context
      )
      req.publishable_key_context = {
        key: "test-key",
        sales_channel_ids: ["sc-1", "sc-2"],
      }
      const mockAvailability = {
        "variant-1": { availability: 7 },
        "variant-2": { availability: 3 },
      }

      ;(getVariantAvailability as jest.Mock).mockResolvedValueOnce(
        mockAvailability
      )

      await wrapVariantsWithInventoryQuantityForSalesChannel(
        req as MedusaStoreRequest<unknown>,
        variants
      )

      expect(getVariantAvailability).toHaveBeenCalledWith(mockQuery, {
        variant_ids: ["variant-1", "variant-2", "variant-3"],
        sales_channel_id: "sc-2",
      })

      req.publishable_key_context = originalPublishableKeyContext
    })

    it("should update inventory_quantity for variants with manage_inventory=true", async () => {
      const mockAvailability = {
        "variant-1": { availability: 15 },
        "variant-2": { availability: 9 },
        "variant-3": { availability: 25 },
      }

      ;(getVariantAvailability as jest.Mock).mockResolvedValueOnce(
        mockAvailability
      )

      await wrapVariantsWithInventoryQuantityForSalesChannel(
        req as MedusaStoreRequest<unknown>,
        variants
      )

      expect(variants[0].inventory_quantity).toBe(15)
      expect(variants[1].inventory_quantity).toBe(9)
      expect(variants[2].inventory_quantity).toBeUndefined()
    })

    it("should not call getVariantAvailability when variants array is empty", async () => {
      await wrapVariantsWithInventoryQuantityForSalesChannel(
        req as MedusaStoreRequest<unknown>,
        []
      )

      expect(getVariantAvailability).not.toHaveBeenCalled()
    })

    it("should ignore nullish entries in the variants array", async () => {
      const mockAvailability = {
        "variant-1": { availability: 4 },
      }
      const _variants = [
        undefined,
        { id: "variant-1", manage_inventory: true },
        null,
      ] as any

      ;(getVariantAvailability as jest.Mock).mockResolvedValueOnce(
        mockAvailability
      )

      await wrapVariantsWithInventoryQuantityForSalesChannel(
        req as MedusaStoreRequest<unknown>,
        _variants
      )

      expect(getVariantAvailability).toHaveBeenCalledWith(mockQuery, {
        variant_ids: ["variant-1"],
        sales_channel_id: "sc-1",
      })
      expect(_variants[1].inventory_quantity).toBe(4)
    })

    it("should not call getVariantAvailability when all variants are nullish", async () => {
      await wrapVariantsWithInventoryQuantityForSalesChannel(
        req as MedusaStoreRequest<unknown>,
        [undefined] as any
      )

      expect(getVariantAvailability).not.toHaveBeenCalled()
    })
  })
})
