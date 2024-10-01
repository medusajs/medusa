import { omitDeep } from "../omit-deep"

describe("omitDeep", () => {
  it("should omit properties in a nested object", () => {
    const input = {
      id: 1,
      __typename: "123",
      createdAt: "1020209",
      address: {
        id: 1,
        __typename: "123",
      },
      variants: [
        20,
        {
          id: 22,
          title: "hello world",
          __typename: "123",
          createdAt: "1020209",
          variantOption: {
            id: 1,
            __typename: "123",
          },
        },
        {
          id: 32,
          test: null,
          __typename: "123",
          createdAt: "1020209",
        },
      ],
    }
    
    const output = {
      id: 1,
      address: {
        id: 1,
      },
      variants: [
        20,
        {
          id: 22,
          title: "hello world",
          variantOption: {
            id: 1,
          },
        },
        {
          id: 32,
          test: null,
        },
      ],
    }
    
    expect(
      omitDeep(input, ["createdAt", "updatedAt", "__typename"])
    ).toEqual(output)
  })
})