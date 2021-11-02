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
    const redisClient = {
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
    const productCollectionService = {}

    const service = new ContentfulService(
      {
        regionService,
        productService,
        redisClient,
        productVariantService,
        productCollectionService,
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

  describe("Collections", () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

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
        if (id === "collectionTesting") {
          return Promise.resolve({
            id: "collectionTesting",
            title: "title",
            handle: "handle",
            collection: { id: "test_id", title: "test title" },
            collection_id: "test_id",
            images: [],
          })
        }
        return Promise.resolve(undefined)
      }),
    }
    const redisClient = {
      get: async (id) => {
        if (id === `ignored_ignore_contentful`) {
          return { id }
        }
        return undefined
      },
      set: async (id) => {
        return undefined
      },
    }

    const productVariantService = {}

    const productCollectionService = {
      retrieve: jest.fn((id) => {
        if (id === "test") {
          return Promise.resolve({
            id: "test",
            title: "title",
            handle: "handle",
          })
        }
        if (id === "testNotInContentful") {
          return Promise.resolve({
            id: "testNotInContentful",
            title: "title",
            handle: "handle",
          })
        }
        throw new Error("couldn't find collection")
        // return Promise.resolve(undefined)
      }),
    }
    const eventBusService = {}

    const service = new ContentfulService(
      {
        regionService,
        productService,
        redisClient,
        productVariantService,
        productCollectionService,
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
      publish: jest.fn(async () => {
        return {
          id: "id",
        }
      }),
      update: jest.fn(async () => {
        return entry
      }),
    }

    const environment = {
      getContentType: jest.fn((type) => type),
      createEntryWithId: jest.fn(async (type, id, fields) => {
        if (id === "onlyMedusa") {
          throw new Error("doesn't exist")
        }
        return entry
      }),
      getEntry: jest.fn(async (id) => {
        if (id === "testNotInContentful") {
          throw new Error("entity creation test")
        }
        entry.id = id
        entry.sys = { id }
        return entry
      }),
    }

    service.contentful_ = {
      getSpace: async (space_id) => {
        return {
          getEnvironment: async (env) => {
            return environment
          },
        }
      },
    }

    service.archiveEntryWidthId = jest.fn()
    service.getVariantEntries_ = jest.fn()
    service.getVariantLinks_ = jest.fn()
    service.transformMedusaIds = jest.fn()

    describe("product", () => {
      it("adds collection to created product on creation", async () => {
        const product = {
          id: "collectionTesting",
          title: "title",
          handle: "handle",
          collection: { id: "test_id" },
          collection_id: "test_id",
        }
        await service.createProductInContentful(product)

        expect(environment.createEntryWithId).toHaveBeenCalledTimes(1)
        expect(environment.createEntryWithId).toHaveBeenCalledWith(
          "product",
          "collectionTesting",
          {
            fields: expect.objectContaining({
              medusaId: { "en-US": "collectionTesting" },
              collection_entry: {
                "en-US": {
                  sys: {
                    type: "Link",
                    linkType: "Entry",
                    id: "test_id",
                  },
                },
              },
            }),
          }
        )
      })

      it("adds collection to product on update", async () => {
        const product = {
          id: "collectionTesting",
          fields: ["collection"],
        }

        await service.updateProductInContentful(product)

        expect(entry.update).toHaveBeenCalledTimes(1)
        expect(entry.publish).toHaveBeenCalledTimes(1)
        expect(entry.fields).toEqual(
          expect.objectContaining({
            collection_entry: {
              "en-US": {
                sys: {
                  type: "Link",
                  linkType: "Entry",
                  id: "test_id",
                },
              },
            },
          })
        )
      })
    })

    describe("collections", () => {
      it("createProductCollectionInContentful calls createEntryWithId with collection", async () => {
        const collection = { id: "test", title: "title", handle: "handle" }
        await service.createProductCollectionInContentful(collection)

        expect(environment.createEntryWithId).toHaveBeenCalledTimes(1)
        expect(environment.createEntryWithId).toHaveBeenCalledWith(
          "collection",
          "test",
          {
            fields: {
              medusaId: { "en-US": "test" },
              title: { "en-US": "title" },
              handle: { "en-US": "handle" },
            },
          }
        )
      })

      it("updateProductCollectionInContentful calls update on contentful entity", async () => {
        const collection = {
          id: "test",
          fields: ["title", "handle"],
        }
        await service.updateProductCollectionInContentful(collection)

        expect(entry.update).toHaveBeenCalledTimes(1)
        expect(entry.publish).toHaveBeenCalledTimes(1)
      })

      it("updateProductCollectionInContentful creates collection if it doesn't exist in contentful", async () => {
        const collection = {
          id: "testNotInContentful",
          fields: ["title", "handle"],
        }
        await service.updateProductCollectionInContentful(collection)

        expect(environment.createEntryWithId).toHaveBeenCalledTimes(1)
        expect(environment.createEntryWithId).toHaveBeenCalledWith(
          "collection",
          "testNotInContentful",
          {
            fields: {
              medusaId: { "en-US": "testNotInContentful" },
              title: { "en-US": "title" },
              handle: { "en-US": "handle" },
            },
          }
        )
      })

      it("archiveProductCollectionInContentful calls archiveEntryWithId with collection id", async () => {
        const collection = { id: "nonExistingId" }

        await service.archiveProductCollectionInContentful(collection)

        expect(service.archiveEntryWidthId).toHaveBeenCalledTimes(1)
        expect(service.archiveEntryWidthId).toHaveBeenCalledWith(
          "nonExistingId"
        )
      })

      it("archiveProductCollectionInContentful doesn't call archiveEntryWithId with collection id if collection exists", async () => {
        const collection = { id: "test" }

        await service.archiveProductCollectionInContentful(collection)

        expect(service.archiveEntryWidthId).toHaveBeenCalledTimes(0)
      })
    })
  })
})
