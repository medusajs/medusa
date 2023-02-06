import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import ShippingProfileService from "../shipping-profile"

describe("ShippingProfileService", () => {
  describe("retrieve", () => {
    describe("successfully get profile", () => {
      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", async () => {
        const profRepo = MockRepository({
          findOne: () => Promise.resolve({}),
        })
        const profileService = new ShippingProfileService({
          manager: MockManager,
          shippingProfileRepository: profRepo,
        })

        await profileService.retrieve(IdMap.getId("validId"))

        expect(profRepo.findOne).toHaveBeenCalledTimes(1)
        expect(profRepo.findOne).toHaveBeenCalledWith({
          where: { id: IdMap.getId("validId") },
        })
      })
    })
  })

  describe("update", () => {
    const profRepo = MockRepository({
      findOne: (q) => {
        return Promise.resolve({ id: q.where.id })
      },
    })

    const productService = {
      updateShippingProfile: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const shippingOptionService = {
      updateShippingProfile: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
      productService,
      shippingOptionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = IdMap.getId("validId")

      await profileService.update(id, { name: "new title" })

      expect(profRepo.save).toBeCalledTimes(1)
      expect(profRepo.save).toBeCalledWith({ id, name: "new title" })
    })

    it("calls updateOne products", async () => {
      const id = IdMap.getId("validId")

      await profileService.update(id, {
        products: [IdMap.getId("product1")],
      })

      expect(productService.updateShippingProfile).toBeCalledTimes(1)
      expect(productService.updateShippingProfile).toBeCalledWith(
        [IdMap.getId("product1")],
        id
      )
    })

    it("calls updateOne with shipping options", async () => {
      const id = IdMap.getId("profile1")

      await profileService.update(id, {
        shipping_options: [IdMap.getId("validId")],
      })

      expect(shippingOptionService.updateShippingProfile).toBeCalledTimes(1)
      expect(shippingOptionService.updateShippingProfile).toBeCalledWith(
        [IdMap.getId("validId")],
        id
      )
    })
  })

  describe("delete", () => {
    const profRepo = MockRepository({
      findOne: (q) => {
        return Promise.resolve({ id: q.where.id })
      },
    })
    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("deletes the profile successfully", async () => {
      await profileService.delete(IdMap.getId("validId"))

      expect(profRepo.softRemove).toBeCalledTimes(1)
      expect(profRepo.softRemove).toBeCalledWith({
        id: IdMap.getId("validId"),
      })
    })
  })

  describe("addProduct", () => {
    const profRepo = MockRepository({ findOne: () => Promise.resolve({}) })

    const productService = {
      updateShippingProfile: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
      productService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("add product to profile successfully", async () => {
      await profileService.addProduct(IdMap.getId("validId"), [
        IdMap.getId("product2"),
      ])

      expect(productService.updateShippingProfile).toBeCalledTimes(1)
      expect(productService.updateShippingProfile).toBeCalledWith(
        [IdMap.getId("product2")],
        IdMap.getId("validId")
      )
    })
  })

  describe("fetchCartOptions", () => {
    const profRepo = MockRepository({
      find: (q) => {
        switch (q.where.id) {
          default:
            return Promise.resolve([
              {
                shipping_options: [],
              },
            ])
        }
      },
    })

    const shippingOptionService = {
      list: jest.fn().mockImplementation(({ id }) => {
        if (id && id.includes("test-option")) {
          return Promise.resolve([
            {
              id: "test-option",
              amount: 1000,
              name: "Test option",
            },
          ])
        }
        return Promise.resolve([
          {
            id: "ship_1",
          },
          {
            id: "ship_2",
          },
        ])
      }),
      validateCartOption: jest.fn().mockImplementation(async (s) => s),
      withTransaction: function () {
        return this
      },
    }

    const customShippingOptionService = {
      withTransaction: function () {
        return this
      },
      list: jest.fn().mockImplementation(({ cart_id }, config) => {
        if (cart_id === "cso-cart") {
          return Promise.resolve([
            {
              id: "cso_1",
              cart_id: "cso-cart",
              shipping_option_id: "test-option",
              price: 0,
            },
          ])
        }
        return Promise.resolve([])
      }),
    }

    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
      shippingOptionService,
      customShippingOptionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("given a cart with custom shipping options, should return correct custom shipping options ", async () => {
      const cart = {
        id: "cso-cart",
        items: [
          {
            variant: {
              product: {
                _id: IdMap.getId("product_1"),
                profile_id: IdMap.getId("profile"),
              },
            },
          },
          {
            variant: {
              product: {
                _id: IdMap.getId("product_2"),
                profile_id: IdMap.getId("profile"),
              },
            },
          },
        ],
        type: "swap",
      }

      await expect(profileService.fetchCartOptions(cart)).resolves.toEqual([
        expect.objectContaining({
          id: "test-option",
          amount: 0,
          name: "Test option",
        }),
      ])
    })

    it("given a cart with no custom shipping options, should return normal shipping options", async () => {
      const cart = {
        items: [
          {
            variant: {
              product: {
                _id: IdMap.getId("product_1"),
                profile_id: IdMap.getId("profile"),
              },
            },
          },
          {
            variant: {
              product: {
                _id: IdMap.getId("product_2"),
                profile_id: IdMap.getId("profile"),
              },
            },
          },
        ],
      }

      await expect(profileService.fetchCartOptions(cart)).resolves.toEqual([
        { id: "ship_1" },
        { id: "ship_2" },
      ])

      expect(shippingOptionService.validateCartOption).toBeCalledTimes(2)
      expect(shippingOptionService.validateCartOption).toBeCalledWith(
        { id: "ship_1" },
        cart
      )
      expect(shippingOptionService.validateCartOption).toBeCalledWith(
        { id: "ship_2" },
        cart
      )
    })
  })

  describe("addShippingOption", () => {
    const profRepo = MockRepository({ findOne: () => Promise.resolve({}) })

    const shippingOptionService = {
      updateShippingProfile: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
      shippingOptionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("add shipping option to profile successfully", async () => {
      await profileService.addShippingOption(IdMap.getId("validId"), [
        IdMap.getId("freeShipping"),
      ])

      expect(shippingOptionService.updateShippingProfile).toBeCalledTimes(1)
      expect(shippingOptionService.updateShippingProfile).toBeCalledWith(
        [IdMap.getId("freeShipping")],
        IdMap.getId("validId")
      )
    })
  })

  describe("create", () => {
    const profRepo = MockRepository()
    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates a new shipping profile", async () => {
      await profileService.create({
        name: "New Profile",
      })

      expect(profRepo.create).toHaveBeenCalledTimes(1)
      expect(profRepo.create).toHaveBeenCalledWith({
        name: "New Profile",
      })
    })

    it("throws if trying to create with products", async () => {
      await expect(
        profileService.create({
          name: "New Profile",
          products: ["144"],
        })
      ).rejects.toThrow(
        "Please add products and shipping_options after creating Shipping Profiles"
      )
    })
  })
})
