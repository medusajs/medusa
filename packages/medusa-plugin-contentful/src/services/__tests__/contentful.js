import ContentfulService from "../contentful"

describe("ContentfulService", () => {
  describe("delete in medusa", () => {
    const regionService = {
      retrieve: jest.fn((id) => {
        if (id === "exists") {
          return Promise.resolve({ id: "exists" })
        }
        return Promise.resolve(undefined)
      }),
    }
    const productService = {
      retrieve: jest.fn((id) => {
        if (id === "exists") {
          return Promise.resolve({ id: "exists" })
        }
        return Promise.resolve(undefined)
      }),
    }
    const cacheService = {
      get: async (id) => {
        // const key = `${id}_ignore_${side}`
        if (id === `ignored_ignore_contentful`) {
          return { id }
        }
        return undefined
      },
      set: async (id) => {
        return undefined
      },
    }
    const productVariantService = {
      retrieve: jest.fn((id) => {
        if (id === "exists") {
          return Promise.resolve({ id: "exists" })
        }
        return Promise.resolve(undefined)
      }),
    }
    const eventBusService = {}

    const service = new ContentfulService(
      {
        regionService,
        productService,
        cacheService,
        productVariantService,
        eventBusService,
      },
      {
        space_id: "test_id",
        environment: "master",
        access_token: "test_token",
      }
    )

    const entry = {
      unpublish: jest.fn(async () => {
        return {
          id: "id",
        }
      }),
      archive: jest.fn(async () => {
        return {
          id: "id",
        }
      }),
    }

    service.contentful_ = {
      getSpace: async (space_id) => {
        return {
          getEnvironment: async (env) => {
            return {
              getEntry: async (id) => {
                if (id === "onlyMedusa") {
                  throw new Error("doesn't exist")
                }
                return entry
              },
            }
          },
        }
      },
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("archiveProductInContentful", () => {
      it("Calls entry.unpublish and entry.archive", async () => {
        await service.archiveProductInContentful({ id: "test" })

        expect(entry.unpublish).toHaveBeenCalledTimes(1)
        expect(entry.archive).toHaveBeenCalledTimes(1)
      })

      it("Doesn't call entry.unpublish and entry.archive if the product still exists in medusa", async () => {
        await service.archiveProductInContentful({ id: "exists" })

        expect(entry.unpublish).toHaveBeenCalledTimes(0)
        expect(entry.archive).toHaveBeenCalledTimes(0)
      })

      it("Doesn't call productService if request should be ignored", async () => {
        await service.archiveProductInContentful({ id: "ignored" })

        expect(productService.retrieve).toHaveBeenCalledTimes(0)
        expect(entry.unpublish).toHaveBeenCalledTimes(0)
        expect(entry.archive).toHaveBeenCalledTimes(0)
      })
    })

    describe("archiveProductVariantInContentful", () => {
      it("Calls entry.unpublish and entry.archive", async () => {
        await service.archiveProductVariantInContentful({ id: "test" })

        expect(entry.unpublish).toHaveBeenCalledTimes(1)
        expect(entry.archive).toHaveBeenCalledTimes(1)
      })

      it("Doesn't call entry.unpublish and entry.archive if the variant still exists in medusa", async () => {
        await service.archiveProductVariantInContentful({ id: "exists" })

        expect(entry.unpublish).toHaveBeenCalledTimes(0)
        expect(entry.archive).toHaveBeenCalledTimes(0)
      })

      it("Doesn't call productVariantService if request should be ignored", async () => {
        await service.archiveProductVariantInContentful({ id: "ignored" })

        expect(productVariantService.retrieve).toHaveBeenCalledTimes(0)
        expect(entry.unpublish).toHaveBeenCalledTimes(0)
        expect(entry.archive).toHaveBeenCalledTimes(0)
      })
    })

    describe("archiveRegionInContentful", () => {
      it("Calls entry.unpublish and entry.archive", async () => {
        await service.archiveRegionInContentful({ id: "test" })

        expect(entry.unpublish).toHaveBeenCalledTimes(1)
        expect(entry.archive).toHaveBeenCalledTimes(1)
      })

      it("Doesn't call entry.unpublish and entry.archive if the region still exists in medusa", async () => {
        await service.archiveRegionInContentful({ id: "exists" })

        expect(entry.unpublish).toHaveBeenCalledTimes(0)
        expect(entry.archive).toHaveBeenCalledTimes(0)
      })

      it("Doesn't call RegionService if request should be ignored", async () => {
        await service.archiveRegionInContentful({ id: "ignored" })

        expect(regionService.retrieve).toHaveBeenCalledTimes(0)
        expect(entry.unpublish).toHaveBeenCalledTimes(0)
        expect(entry.archive).toHaveBeenCalledTimes(0)
      })
    })

    describe("archiveEntryWidthId", () => {
      it("Calls archive if entry exists", async () => {
        await service.archiveEntryWidthId("exists")

        expect(entry.unpublish).toHaveBeenCalledTimes(1)
        expect(entry.archive).toHaveBeenCalledTimes(1)
      })
      it("Doesnt call archive if entry doesn't exists", async () => {
        await service.archiveEntryWidthId("onlyMedusa")

        expect(entry.unpublish).toHaveBeenCalledTimes(0)
        expect(entry.archive).toHaveBeenCalledTimes(0)
      })
    })
  })
})
