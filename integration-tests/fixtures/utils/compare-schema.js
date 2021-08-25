const checkArray = (fixture, key) => {
  expect(Array.isArray(fixture[key])).toBeTruthy()
}

const checkType = (fixture, key, type) => {
  expect(typeof fixture[key]).toEqual(type)
}

const compareSchema = (value, sc) => {
  // First check that all the properties in the fixture are documented
  for (const key of Object.keys(value)) {
    expect(sc.properties).toHaveProperty(key)
  }

  // Second go through each of the documented properties
  for (const [key, schema] of Object.entries(sc.properties)) {
    // If the documented property is itself a schmea recurse
    if (schema.properties) {
      compareSchema(value[key], schema)
    } else {
      // If the documented property has a type check that this type corresponds
      // with the fixture
      if (schema.type) {
        expect(value).toHaveProperty(key)

        if (value[key] === null) {
          expect(schema.nullable).toBeTruthy()
        } else {
          switch (schema.type) {
            case "array":
              checkArray(value, key)
              break
            default:
              checkType(value, key, schema.type)
          }
        }
      }
    }
  }
}

module.exports = compareSchema
