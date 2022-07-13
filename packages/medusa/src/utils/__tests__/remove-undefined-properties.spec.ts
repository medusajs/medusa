import { removeUndefinedProperties } from "../remove-undefined-properties";

describe("removeUndefinedProperties", ()  => {
  it("should remove all undefined properties from an input object", () => {
    const inputObj = {
      test: undefined,
      test1: "test1",
      test2: null,
      test3: {
        test3_1: undefined,
        test3_2: "test3_2",
        test3_3: null,
      },
      test4: [
        undefined,
        null,
        "null",
        [1, 2, undefined],
        {
          test4_1: undefined,
          test4_2: "test4_2",
          test4_3: null,
        }
      ]
    }

    const cleanObject = removeUndefinedProperties(inputObj)

    expect(cleanObject).toEqual({
      test1: "test1",
      test2: null,
      test3: {
        test3_2: "test3_2",
        test3_3: null,
      },
      test4: [
        null,
        null,
        [1, 2],
        {
          test4_2: "test4_2",
          test4_3: null
        }
      ]
    })
  })
})
