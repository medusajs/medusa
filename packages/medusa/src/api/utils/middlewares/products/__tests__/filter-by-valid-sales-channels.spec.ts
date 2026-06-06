import { MedusaStoreRequest } from "@zjedene-medusa/framework/http"
import { MedusaError } from "@zjedene-medusa/framework/utils"
import { NextFunction } from "express"
import {
  transformAndValidateSalesChannelIds,
  filterByValidSalesChannels,
} from "../filter-by-valid-sales-channels"

describe("filter-by-valid-sales-channels", () => {
  describe("transformAndValidateSalesChannelIds", () => {
    let req: Partial<MedusaStoreRequest>

    beforeEach(() => {
      req = {
        publishable_key_context: {
          key: "test-key",
          sales_channel_ids: ["sc-1", "sc-2"],
        },
        validatedQuery: {},
      }
    })

    it("should return sales channel ids from request when they exist and are in publishable key", () => {
      req.validatedQuery = { sales_channel_id: ["sc-1"] }

      const result = transformAndValidateSalesChannelIds(
        req as MedusaStoreRequest
      )

      expect(result).toEqual(["sc-1"])
    })

    it("should handle sales_channel_id as string and transform to array", () => {
      req.validatedQuery = { sales_channel_id: "sc-2" }

      const result = transformAndValidateSalesChannelIds(
        req as MedusaStoreRequest
      )

      expect(result).toEqual(["sc-2"])
    })

    it("should throw error when requested sales channel is not in publishable key", () => {
      req.validatedQuery = { sales_channel_id: ["sc-3"] }

      expect(() => {
        transformAndValidateSalesChannelIds(req as MedusaStoreRequest)
      }).toThrow(MedusaError)
    })

    it("should return sales channel ids from publishable key when no ids in request", () => {
      req.validatedQuery = {}

      const result = transformAndValidateSalesChannelIds(
        req as MedusaStoreRequest
      )

      expect(result).toEqual(["sc-1", "sc-2"])
    })

    it("should return empty array when no sales channel ids in publishable key or request", () => {
      req.publishable_key_context = {
        key: "test-key",
        sales_channel_ids: [],
      }
      req.validatedQuery = {}

      const result = transformAndValidateSalesChannelIds(
        req as MedusaStoreRequest
      )

      expect(result).toEqual([])
    })
  })

  describe("filterByValidSalesChannels", () => {
    let req: Partial<MedusaStoreRequest>
    let res: any
    let next: NextFunction
    let middleware: ReturnType<typeof filterByValidSalesChannels>

    beforeEach(() => {
      req = {
        publishable_key_context: {
          key: "test-key",
          sales_channel_ids: ["sc-1", "sc-2"],
        },
        validatedQuery: {},
        filterableFields: {},
      }

      res = {}
      next = jest.fn()
      middleware = filterByValidSalesChannels()
    })

    it("should set filterableFields.sales_channel_id and call next", async () => {
      await middleware(req as MedusaStoreRequest, res, next)

      expect(req.filterableFields!.sales_channel_id).toEqual(["sc-1", "sc-2"])
      expect(next).toHaveBeenCalled()
    })

    it("should throw error when no sales channels available", async () => {
      req.publishable_key_context = {
        key: "test-key",
        sales_channel_ids: [],
      }

      await expect(
        middleware(req as MedusaStoreRequest, res, next)
      ).rejects.toThrow(
        "Publishable key needs to have a sales channel configured"
      )
      expect(next).not.toHaveBeenCalled()
    })

    it("should use only sales channels from request that are in publishable key", async () => {
      req.validatedQuery = { sales_channel_id: ["sc-1"] }

      await middleware(req as MedusaStoreRequest, res, next)

      expect(req.filterableFields!.sales_channel_id).toEqual(["sc-1"])
      expect(next).toHaveBeenCalled()
    })

    it("should handle sales_channel_id as string in request", async () => {
      req.validatedQuery = { sales_channel_id: "sc-2" }

      await middleware(req as MedusaStoreRequest, res, next)

      expect(req.filterableFields!.sales_channel_id).toEqual(["sc-2"])
      expect(next).toHaveBeenCalled()
    })
  })
})
