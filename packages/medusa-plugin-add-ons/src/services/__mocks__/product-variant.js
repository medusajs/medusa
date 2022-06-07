import { IdMap } from "medusa-test-utils"

const variant1 = {
  _id: IdMap.getId("test-variant-1"),
  title: "variant1",
  options: [],
}

const variant2 = {
  _id: IdMap.getId("test-variant-2"),
  title: "variant2",
  options: [
    {
      option_id: IdMap.getId("color_id"),
      value: "black",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "160",
    },
  ],
}

const variant3 = {
  _id: IdMap.getId("test-variant-3"),
  title: "variant3",
  options: [
    {
      option_id: IdMap.getId("color_id"),
      value: "blue",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "150",
    },
  ],
}

const variant4 = {
  _id: IdMap.getId("test-variant-4"),
  title: "variant4",
  options: [
    {
      option_id: IdMap.getId("color_id"),
      value: "blue",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "50",
    },
  ],
}

export const variants = {
  one: variant1,
  two: variant2,
  three: variant3,
  four: variant4,
}

export const ProductVariantServiceMock = {
  retrieve: jest.fn().mockImplementation((variantId) => {
    if (variantId === IdMap.getId("test-variant-1")) {
      return Promise.resolve(variant1)
    }
    if (variantId === IdMap.getId("test-variant-2")) {
      return Promise.resolve(variant2)
    }
    if (variantId === IdMap.getId("test-variant-3")) {
      return Promise.resolve(variant3)
    }
    if (variantId === IdMap.getId("test-variant-4")) {
      return Promise.resolve(variant4)
    }
    return Promise.resolve(undefined)
  }),
  getRegionPrice: jest.fn().mockImplementation((variantId, context) => {
    if (variantId === IdMap.getId("test-variant-1")) {
      if (context.regionId === IdMap.getId("world")) {
        return Promise.resolve(10)
      } else {
        return Promise.resolve(20)
      }
    }

    return Promise.reject(new Error("Not found"))
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductVariantServiceMock
})

export default mock
