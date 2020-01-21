import IdMap from "../../helpers/id-map"

const variant1 = {
  _id: "1",
  title: "variant1",
  options: [
    {
      option_id: IdMap.getId("color_id"),
      value: "blue",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "160",
    },
  ],
}

const variant2 = {
  _id: "2",
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
  _id: "3",
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
  _id: "4",
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

const invalidVariant = {
  _id: "invalid_option",
  title: "variant3",
  options: [
    {
      option_id: "invalid_id",
      value: "blue",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "150",
    },
  ],
}

const emptyVariant = {
  _id: "empty_option",
  title: "variant3",
  options: [],
}

export const variants = {
  one: variant1,
  two: variant2,
  three: variant3,
  four: variant4,
  invalid_variant: invalidVariant,
  empty_variant: emptyVariant,
}

export const ProductVariantServiceMock = {
  retrieve: jest.fn().mockImplementation(variantId => {
    if (variantId === "1") {
      return Promise.resolve(variant1)
    }
    if (variantId === "2") {
      return Promise.resolve(variant2)
    }
    if (variantId === "3") {
      return Promise.resolve(variant3)
    }
    if (variantId === "4") {
      return Promise.resolve(variant4)
    }
    if (variantId === "invalid_option") {
      return Promise.resolve(invalidVariant)
    }
    if (variantId === "empty_option") {
      return Promise.resolve(emptyVariant)
    }
    return Promise.resolve(undefined)
  }),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
  addOptionValue: jest.fn().mockImplementation((variantId, optionId, value) => {
    return Promise.resolve({})
  }),
  deleteOptionValue: jest.fn().mockImplementation((variantId, optionId) => {
    return Promise.resolve({})
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductVariantServiceMock
})

export default mock
