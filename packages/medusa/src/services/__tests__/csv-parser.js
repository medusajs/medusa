import { createContainer } from "awilix"
import { Readable } from "stream"
import CsvParser from "../csv-parser"

describe("CsvParser", () => {
  describe("parse", () => {
    const csvParser = new CsvParser(createContainer(), {
      columns: [],
    })

    let csvContent =
      'title,subtitle\n"T-shirt","summer tee"\n"Sunglasses","Red sunglasses"'

    let expectedProducts = [
      {
        title: "T-shirt",
        subtitle: "summer tee",
      },
      {
        title: "Sunglasses",
        subtitle: "Red sunglasses",
      },
    ]

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("given a readable stream, can parse the stream content", async () => {
      const stream = Readable.from(csvContent)
      const content = await csvParser.parse(stream)

      expect(content).toEqual(expectedProducts)
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
          {
            name: "size",
          },
          {
            name: "height",
          },
        ],
      })

      it("given a line containing a column which is not defined in the schema, then validation should fail", async () => {
        try {
          await csvParser.buildData([
            {
              title: "sunglasses",
              size: "M",
              height: "100",
              first_name: "lebron",
            },
          ])
        } catch (err) {
          expect(err.message).toEqual(
            "Unable to treat column first_name from the csv file. No target column found in the provided schema"
          )
        }
      })

      it("given a line containing a column which does not pass a validation constraint, then validation should fail", async () => {
        try {
          await csvParser.buildData([
            { title: "contains a number 1", size: "M", height: "100" },
          ])
        } catch (err) {
          expect(err.message).toEqual("title should not contain a number")
        }
      })

      it("given a line which passes all validation constraints, then should returned validated content", async () => {
        const content = await csvParser.buildData([
          { title: "great product", size: "M", height: "100" },
        ])

        expect(content).toEqual([
          {
            title: "great product",
            size: "M",
            height: "100",
          },
        ])
      })

      it("given a line which does not provide a value for a required column, then should throw an error", async () => {
        try {
          await csvParser.buildData([{ size: "S", height: "100" }])
        } catch (err) {
          expect(err.message).toEqual(
            `Missing column(s) "title" from the given csv file`
          )
        }
      })

      it("given a line which does not provide a value for multiple required columns, then should throw an error", async () => {
        try {
          await csvParser.buildData([{ size: "S" }])
        } catch (err) {
          expect(err.message).toEqual(
            `Missing column(s) "title", "height" from the given csv file`
          )
        }
      })

      it("given a line which does not provide a value for a required column, then should throw an error", async () => {
        try {
          await csvParser.buildData([
            { title: "t-shirt", height: "100", size: "" },
          ])
        } catch (err) {
          expect(err.message).toEqual(
            `No value found for target column "size" in line 1 of the given csv file`
          )
        }
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

    describe("transformer", () => {
      const csvParser = new CsvParser(createContainer(), {
        columns: [
          {
            name: "title",
          },
          {
            name: "price usd",
            transformer: (value) => Math.round(Number(value) * 100),
          },
        ],
      })

      it("given a transformer function for a column, when building data, should transform that column's value according to the transformation function", async () => {
        const content = await csvParser.buildData([
          { title: "medusa t-shirt", "price usd": "19.99" },
        ])

        expect(content).toEqual([
          {
            title: "medusa t-shirt",
            "price usd": 1999,
          },
        ])
      })
    })

    describe("match", () => {
      describe("regex", () => {
        const csvParser = new CsvParser(createContainer(), {
          columns: [
            {
              name: "title",
            },
            {
              name: "variants",
              match: /.*Variant Price.*/i,
              transformer: (value) => Math.round(Number(value) * 100),
            },
          ],
        })

        it("given a column with the match property as regex, when building data, should resolve that column for all entries in the line that match the regex", async () => {
          const content = await csvParser.buildData([
            {
              title: "medusa t-shirt",
              "variant price usd": "19.99",
              "variant price cad": "26.79",
              "variant price dkk": "1389",
            },
            {
              title: "medusa sunglasses",
              "variant price usd": "9.99",
              "variant price cad": "16.79",
              "variant price dkk": "389",
            },
          ])

          expect(content).toEqual([
            {
              title: "medusa t-shirt",
              "variant price usd": 1999,
              "variant price cad": 2679,
              "variant price dkk": 138900,
            },
            {
              title: "medusa sunglasses",
              "variant price usd": 999,
              "variant price cad": 1679,
              "variant price dkk": 38900,
            },
          ])
        })
      })
    })
  })
})
