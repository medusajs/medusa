import { createContainer } from "awilix"
import { Readable } from "stream"
import CsvParser from "../csv-parser"

describe("CsvParser", () => {
  describe("parse", () => {
    const csvParser = new CsvParser(createContainer(), {
      columns: [],
    })

    let csvContent =
        'title,subtitle\n"T-shirt","summer tee"\n"Sunglasses","Red sunglasses"',
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

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("given a file location, can read the file contents and parse it", async () => {
      const stream = Readable.from(csvContent)
      const content = await csvParser.parse(stream)

      expect(content).toEqual(products)
    })
  })

  describe("buildData", () => {
    describe("schema validation", () => {
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

    describe("mapTo", () => {
      const csvParser = new CsvParser(createContainer(), {
        columns: [
          {
            name: "title",
            mapTo: "product_title",
          },
        ],
      })

      it("given a mapTo field for a column, when building data including that column, should rename the column name to what mapTo refers to", async () => {
        const content = await csvParser.buildData([{ title: "a product" }])

        expect(content).toEqual([
          {
            product_title: "a product",
          },
        ])
      })
    })
  })
})
