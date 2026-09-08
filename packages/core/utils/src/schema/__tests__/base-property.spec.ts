import { BaseSchemaProperty } from "../base-property"

describe("BaseSchemaProperty", () => {
  class StringProperty extends BaseSchemaProperty<string> {
    protected dataType = { name: "text" }
  }

  test("parse returns shared metadata", () => {
    const property = new StringProperty()

    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: { name: "text" },
      nullable: false,
      computed: false,
    })
  })
})
