import { getSelectsAndRelationsFromObjectArray } from "../get-selects-and-relations-from-object-array"

describe("getSelectsAndRelationsFromObjectArray", function () {
  it("should return true or false for different types of data", function () {
    const expectations = [
      {
        input: [
          {
            attr_string: "string",
            attr_boolean: true,
            attr_null: null,
            attr_undefined: undefined,
            attr_object: {
              attr_string: "string",
              attr_boolean: true,
              attr_null: null,
              attr_undefined: undefined,
            },
            attr_array: [
              {
                attr_object: {
                  attr_string: "string",
                  attr_boolean: true,
                  attr_null: null,
                  attr_undefined: undefined,
                },
              },
              {
                attr_object: {
                  attr_string: "string",
                },
              },
            ],
          },
        ],
        output: {
          selects: [
            "attr_string",
            "attr_boolean",
            "attr_null",
            "attr_undefined",
            "attr_object.attr_string",
            "attr_object.attr_boolean",
            "attr_object.attr_null",
            "attr_object.attr_undefined",
            "attr_array.attr_object.attr_string",
            "attr_array.attr_object.attr_boolean",
            "attr_array.attr_object.attr_null",
            "attr_array.attr_object.attr_undefined",
          ],
          relations: ["attr_object", "attr_array", "attr_array.attr_object"],
        },
      },
    ]

    expectations.forEach((expectation) => {
      expect(getSelectsAndRelationsFromObjectArray(expectation.input)).toEqual(
        expectation.output
      )
    })
  })
})
