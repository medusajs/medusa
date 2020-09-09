import { IdMap } from "medusa-test-utils"
import { AddOnModelMock, addOns } from "../../models/__mocks__/add-on"
import AddOnService from "../add-on"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { ProductServiceMock } from "../__mocks__/product"

describe("AddOnService", () => {
  describe("create", () => {
    const addOnService = new AddOnService({
      addOnModel: AddOnModelMock,
      productService: ProductServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls model layer create", async () => {
      await addOnService.create({
        name: "Chili",
        prices: [
          {
            currency_code: "DKK",
            amount: 20,
          },
        ],
        valid_for: [IdMap.getId("test-product")],
      })

      expect(AddOnModelMock.create).toBeCalledTimes(1)
      expect(AddOnModelMock.create).toBeCalledWith({
        name: "Chili",
        prices: [
          {
            currency_code: "DKK",
            amount: 20,
          },
        ],
        valid_for: [IdMap.getId("test-product")],
      })
    })
  })

  describe("retrieve", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const addOnService = new AddOnService({
        addOnModel: AddOnModelMock,
      })
      result = await addOnService.retrieve(IdMap.getId("test-add-on"))
    })

    it("calls model layer retrieve", async () => {
      expect(AddOnModelMock.findOne).toBeCalledTimes(1)
      expect(AddOnModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("test-add-on"),
      })
    })

    it("returns the add-on", () => {
      expect(result).toEqual(addOns.testAddOn)
    })
  })

  describe("update", () => {
    const addOnService = new AddOnService({
      addOnModel: AddOnModelMock,
      productService: ProductServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls model layer create", async () => {
      await addOnService.update(IdMap.getId("test-add-on"), {
        name: "Chili Spice",
        valid_for: [IdMap.getId("test-product"), IdMap.getId("test-product-2")],
      })

      expect(AddOnModelMock.updateOne).toBeCalledTimes(1)
      expect(AddOnModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("test-add-on") },
        {
          $set: {
            name: "Chili Spice",
            valid_for: [
              IdMap.getId("test-product"),
              IdMap.getId("test-product-2"),
            ],
          },
        },
        { runValidators: true }
      )
    })
  })

  describe("retrieveByProduct", () => {
    describe("successful retrieval", () => {
      let result
      beforeAll(async () => {
        jest.clearAllMocks()
        const addOnService = new AddOnService({
          addOnModel: AddOnModelMock,
          productService: ProductServiceMock,
        })
        result = await addOnService.retrieveByProduct(
          IdMap.getId("test-product")
        )
      })

      it("calls ProductService retrieve", async () => {
        expect(ProductServiceMock.retrieve).toBeCalledTimes(1)
        expect(ProductServiceMock.retrieve).toBeCalledWith(
          IdMap.getId("test-product")
        )
      })

      it("calls model layer", () => {
        expect(AddOnModelMock.find).toBeCalledTimes(1)
        expect(AddOnModelMock.find).toBeCalledWith({
          valid_for: IdMap.getId("test-product"),
        })
      })

      it("returns the add-ons", () => {
        expect(result).toEqual([addOns.testAddOn, addOns.testAddOn2])
      })
    })
  })
})
