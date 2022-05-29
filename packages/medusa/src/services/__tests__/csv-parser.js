import CsvParser from "../csv-parser"
import fs from "fs"
import Papa from "papaparse"
import { createContainer } from "awilix"

function createDummyDataGenerator(data) {
  return async function*() {
    for (let i = 0; i < data.length; i++) {
      yield data[i]
    }
  }
}

describe("CsvParser", () => {
  describe("parse", () => {
    const csvParser = new CsvParser(createContainer(), {
      columns: [],
    })

    let products

    beforeEach(() => {
      jest.clearAllMocks()

      jest.spyOn(fs, "createReadStream").mockImplementation(() => {
        return {
          pipe: () => {},
        }
      })

      products = [
        {
          title: "T-shirt",
          subtitle: "summer tee",
        },
        {
          title: "Sunglasses",
          subtitle: "Red sunglasses",
        },
      ]

      jest
        .spyOn(Papa, "parse")
        .mockImplementation(createDummyDataGenerator(products))
    })

    it("given a file location, can read the file contents and parse it", async () => {
      const content = await csvParser.parse("file.csv")

      expect(content).toEqual(products)
    })
  })

  describe("buildData", () => {
    const csvParser = new CsvParser(createContainer(), {
      columns: [
        {
          name: "title",
          validator: {
            validate: async (value) => {
              if (/\d/.test(value)) {
                throw new Error("title should not contain a number")
              }
            },
          },
        },
      ],
    })

    it("given a line containing a column which is not defined in the schema, then validation should fail", async () => {
      try {
        await csvParser.buildData([{ first_name: "lebron " }])
      } catch (err) {
        expect(err.message).toEqual(
          "Unable to to treat column first_name from the csv file. No target column found in the provided schema"
        )
      }
    })

    it("given a line containing a column which does not pass a validation constraint, then validation should fail", async () => {
      try {
        await csvParser.buildData([{ title: "contains a number 1" }])
      } catch (err) {
        expect(err.message).toEqual("title should not contain a number")
      }
    })

    it("given a line which passes all validation constraints, then should returned validated content", async () => {
      const content = await csvParser.buildData([{ title: "great product" }])

      expect(content).toEqual([
        {
          title: "great product",
        },
      ])
    })
  })
})
