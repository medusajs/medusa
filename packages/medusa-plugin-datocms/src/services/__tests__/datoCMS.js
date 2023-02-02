import DatoCMSService from '../datoCMS'

describe('DatoCMS', () => {
  let datoCMSService;
  let redisClient;
  let regionService;
  let productService;
  let productVariantService;
  let eventBusService;
  let options;
  
  beforeEach(() => {
    regionService = {
      retrieve: jest.fn((id) => {
        if (id === "exists") {
          return Promise.resolve({ id: "exists" })
        }
        return Promise.resolve(undefined)
      }),
    }
    productService = {
      retrieve: jest.fn((id) => {
        if (id === "exists") {
          return Promise.resolve({ id: "exists" })
        }
        return Promise.resolve(undefined)
      }),
    }
    redisClient = {
      get: async (id) => {
        if (id === `1_ignore_datocms`) {
          return { id }
        }
        return undefined
      },
      set: async (id) => {
        return undefined
      },
    }
    productVariantService = {
      retrieve: jest.fn((id) => {
        if (id === "exists") {
          return Promise.resolve({ id: "exists" })
        }
        return Promise.resolve(undefined)
      }),
    }
    eventBusService = {}


    options = {
      accessKey: 'test_key',
      environment: 'test_env',
    }

    datoCMSService = new DatoCMSService(
      {
        regionService,
        productService,
        redisClient,
        productVariantService,
        eventBusService,
      },
      options
    );

    datoCMSService.datoCMS_ = {
      itemTypes: {
        find: jest.fn(async (itemTypeId) => {
          const models = ['product', 'region', 'product_variant']
          if (typeof itemTypeId === 'string' && models.includes(itemTypeId)) {
            return { id: '1', type: itemTypeId }
          }
          if (typeof itemTypeId === 'object') {
            if (itemTypeId.type === 'product') {
              return { id: '1', type: 'product' }
            }
            if (itemTypeId.type === 'region') {
              return { id: '2', type: 'region' }
            }
            if (itemTypeId.type === 'product_variant') {
              return { id: '3', type: 'product_variant' }
            }
          }
          throw new Error('Model not found')
        }),
      },
      items: {
        find: jest.fn(async (entityId) => {
          if (entityId === '1') {
            return {
              id: '1',
              title: 'Product',
              subtitle: 'Product subtitle',
              description: 'Product description',
              variants: [1,2,3],
              options: '{}',
              medusa_id: '1',
              tags: '{}',
              handle: 'handle',
              type: 'type',
              collection: {
                title: 'title'
              }
            }
          }
          if (entityId === '2') {
            return {
              id: '2',
              name: 'Region',
              currency_code: 'USD',
              countries: '{}',
              payment_providers: '{}',
              fulfillment_providers: '{}',
            }
          }
          if (entityId === '3') {
            return {
              id: '3',
              title: 'Variant',
              sku: 'sku',
              medusa_id: '1',
              options: '{}',
              prices: '{}',
              material: 'material',
            }
          }
        }),
        publish: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
        update: jest.fn(),
      },
    }
  });

  describe("getModel", () => {
    it("should return the model if it exists", async () => {
      const mockModel = { id: '1', type: "region" }

      const result = await datoCMSService.getModel("region")

      expect(result).toEqual(mockModel)
    })

    it("should return false if the model does not exist", async () => {
      const result = await datoCMSService.getModel("test")

      expect(result).toBe(false)
    })
  })

  describe("getCustomField", () => {
    it("should return the custom field if it exists", async () => {
      const result = await datoCMSService.getCustomField("id", "region")

      expect(result).toEqual("id")
    })
  })

  describe("shoudIgnore", () => {
    it("should return true if the entity should be ignored", async () => {
      const result = await datoCMSService.shouldIgnore_("1", "datocms")

      expect(result).toEqual({ id: "1_ignore_datocms" })
    })

    it("should return false if the entity should not be ignored", async () => {
      const result = await datoCMSService.shouldIgnore_("1", "test")

      expect(result).toBe(undefined)
    })
  })

  describe("addIgnore", () => {
    it("should add the entity to the ignore list", async () => {
      const result = await datoCMSService.addIgnore_("1", "datocms")

      expect(result).toBe(undefined)
    })
  })
})