import { convertItemResponseToUpdateRequest } from "../convert-item-response-to-update-request"

describe("convertItemResponseToUpdateRequest", function () {
  it("should return true or false for different types of data", function () {
    const expectations = [
      {
        item: {
          id: "test-id",
          test_attr: "test-name",
          relation_object_with_params: {
            id: "test-relation-object-id",
            test_attr: "test-object-name",
          },
          relation_object_without_params: {
            id: "test-relation-object-without-params-id",
          },
          relation_array: [
            {
              id: "test-relation-array-id",
              test_attr: "test-array-name",
            },
          ],
        },
        selects: [
          "id",
          "test_attr",
          "relation_object_with_params.id",
          "relation_object_with_params.test_attr",
          "relation_object_without_params.id",
          "relation_array.id",
          "relation_array.test_attr",
        ],
        relations: [
          "relation_object_with_params",
          "relation_object_without_params",
          "relation_array",
        ],
        output: {
          id: "test-id",
          test_attr: "test-name",
          relation_object_with_params: { test_attr: "test-object-name" },
          relation_array: [{ id: "test-relation-array-id" }],
          relation_object_without_params_id:
            "test-relation-object-without-params-id",
        },
      },
    ]

    expectations.forEach((expectation) => {
      const response = convertItemResponseToUpdateRequest(
        expectation.item,
        expectation.selects,
        expectation.relations
      )

      expect(response).toEqual(expectation.output)
    })
  })
})
