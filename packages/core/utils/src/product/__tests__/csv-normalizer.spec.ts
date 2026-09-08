import { join } from "node:path"
import { readFile } from "node:fs/promises"
import { CSVNormalizer } from "../csv-normalizer"

async function loadFixtureFile(fileName: string) {
  return JSON.parse(
    await readFile(join(__dirname, "__fixtures__", fileName), "utf-8")
  )
}

describe("CSV processor", () => {
  it("should error when both Product Id and Handle are missing", async () => {
    expect(() => CSVNormalizer.preProcess({}, 1)).toThrow(
      "Row 1: Missing product id and handle. One of these columns are required to process the row"
    )
  })

  it("should process a CSV row", async () => {
    const csvData: any[] = await loadFixtureFile("single-row-create.json")
    const processor = new CSVNormalizer(
      csvData.map((row, index) => CSVNormalizer.preProcess(row, index + 1))
    )

    const products = processor.proccess()
    expect(products).toMatchInlineSnapshot(`
      {
        "toCreate": {
          "sweatshirt": {
            "description": "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
            "discountable": true,
            "handle": "sweatshirt",
            "images": [
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
              },
            ],
            "options": [
              {
                "title": "Size",
                "values": [
                  "S",
                ],
              },
            ],
            "sales_channels": [
              {
                "id": "sc_01JSXX3XX2CBE5ZV10K88NR8Q4",
              },
            ],
            "status": "published",
            "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            "title": "Medusa Sweatshirt",
            "variants": [
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXFG4R7PVX55YQCZQPB",
                "manage_inventory": true,
                "options": {
                  "Size": "S",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-S",
                "title": "S",
                "variant_rank": 0,
              },
            ],
            "weight": 400,
          },
        },
        "toUpdate": {},
      }
    `)
  })

  it("should process multiple CSV rows for the same product", async () => {
    const csvData: any[] = await loadFixtureFile(
      "same-product-multiple-rows.json"
    )
    const processor = new CSVNormalizer(
      csvData.map((row, index) => CSVNormalizer.preProcess(row, index + 1))
    )

    const products = processor.proccess()
    expect(products).toMatchInlineSnapshot(`
      {
        "toCreate": {
          "sweatshirt": {
            "description": "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
            "discountable": true,
            "handle": "sweatshirt",
            "images": [
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
              },
            ],
            "options": [
              {
                "title": "Size",
                "values": [
                  "M",
                  "L",
                  "XL",
                ],
              },
            ],
            "sales_channels": [
              {
                "id": "sc_01JSXX3XX2CBE5ZV10K88NR8Q4",
              },
            ],
            "status": "published",
            "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            "title": "Medusa Sweatshirt",
            "variants": [
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXG4Z955G5VJ9Z956GY",
                "manage_inventory": true,
                "options": {
                  "Size": "M",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-M",
                "title": "M",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGVMXD6CTKWB3KEAG3",
                "manage_inventory": true,
                "options": {
                  "Size": "L",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-L",
                "title": "L",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGF5JMS0ATYH5VDEGT",
                "manage_inventory": true,
                "options": {
                  "Size": "XL",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-XL",
                "title": "XL",
                "variant_rank": 0,
              },
            ],
            "weight": 400,
          },
        },
        "toUpdate": {},
      }
    `)
  })

  it("should process multiple CSV rows where each variant uses different options", async () => {
    const csvData: any[] = await loadFixtureFile(
      "same-product-multiple-variant-options.json"
    )
    const processor = new CSVNormalizer(
      csvData.map((row, index) => CSVNormalizer.preProcess(row, index + 1))
    )

    const products = processor.proccess()
    expect(products).toMatchInlineSnapshot(`
      {
        "toCreate": {
          "sweatshirt": {
            "description": "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
            "discountable": true,
            "handle": "sweatshirt",
            "images": [
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
              },
            ],
            "options": [
              {
                "title": "Size",
                "values": [
                  "M",
                  "L",
                  "XL",
                ],
              },
              {
                "title": "Color",
                "values": [
                  "Black",
                  "White",
                ],
              },
            ],
            "sales_channels": [
              {
                "id": "sc_01JSXX3XX2CBE5ZV10K88NR8Q4",
              },
            ],
            "status": "published",
            "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            "title": "Medusa Sweatshirt",
            "variants": [
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXG4Z955G5VJ9Z956GY",
                "manage_inventory": true,
                "options": {
                  "Size": "M",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-M",
                "title": "M",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGVMXD6CTKWB3KEAG3",
                "manage_inventory": true,
                "options": {
                  "Color": "Black",
                  "Size": "L",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-BLACK",
                "title": "BLACK",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGF5JMS0ATYH5VDEGT",
                "manage_inventory": true,
                "options": {
                  "Color": "White",
                  "Size": "XL",
                },
                "origin_country": "EU",
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-XL",
                "title": "XL",
                "variant_rank": 0,
              },
            ],
            "weight": 400,
          },
        },
        "toUpdate": {},
      }
    `)
  })

  it("should process multiple CSV rows with multiple products and variants", async () => {
    const csvData: any[] = await loadFixtureFile(
      "multiple-products-multiple-variants.json"
    )
    const processor = new CSVNormalizer(
      csvData.map((row, index) => CSVNormalizer.preProcess(row, index + 1))
    )

    const products = processor.proccess()
    expect(products).toMatchInlineSnapshot(`
      {
        "toCreate": {
          "shorts": {
            "description": "Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.",
            "discountable": true,
            "handle": "shorts",
            "images": [
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
              },
            ],
            "options": [
              {
                "title": "Size",
                "values": [
                  "S",
                  "M",
                  "L",
                  "XL",
                ],
              },
            ],
            "sales_channels": [
              {
                "id": "sc_01JSXX3XX2CBE5ZV10K88NR8Q4",
              },
            ],
            "status": "published",
            "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
            "title": "Medusa Shorts",
            "variants": [
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGD1Q1AEYEPX45DHZP",
                "manage_inventory": true,
                "options": {
                  "Size": "S",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHORTS-S",
                "title": "S",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXG0BZ6AWZPHYJWS18J",
                "manage_inventory": true,
                "options": {
                  "Size": "M",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHORTS-M",
                "title": "M",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGKYAJ34RK1VQNVSTX",
                "manage_inventory": true,
                "options": {
                  "Size": "L",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHORTS-L",
                "title": "L",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGNJYQQT30RCBA1XBD",
                "manage_inventory": true,
                "options": {
                  "Size": "XL",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHORTS-XL",
                "title": "XL",
                "variant_rank": 0,
              },
            ],
            "weight": 400,
          },
          "sweatpants": {
            "description": "Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.",
            "discountable": true,
            "handle": "sweatpants",
            "images": [
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
              },
            ],
            "options": [
              {
                "title": "Size",
                "values": [
                  "S",
                  "M",
                  "L",
                  "XL",
                ],
              },
            ],
            "sales_channels": [
              {
                "id": "sc_01JSXX3XX2CBE5ZV10K88NR8Q4",
              },
            ],
            "status": "published",
            "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
            "title": "Medusa Sweatpants",
            "variants": [
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGYYNY3F72R0KY506M",
                "manage_inventory": true,
                "options": {
                  "Size": "S",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATPANTS-S",
                "title": "S",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGTEQ7CA8F1WPM99HK",
                "manage_inventory": true,
                "options": {
                  "Size": "M",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATPANTS-M",
                "title": "M",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGACM79ES7FK2GZV9A",
                "manage_inventory": true,
                "options": {
                  "Size": "L",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATPANTS-L",
                "title": "L",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGC9S0APDPN26MMYV5",
                "manage_inventory": true,
                "options": {
                  "Size": "XL",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATPANTS-XL",
                "title": "XL",
                "variant_rank": 0,
              },
            ],
            "weight": 400,
          },
          "t-shirt": {
            "description": "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.",
            "discountable": true,
            "handle": "t-shirt",
            "images": [
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
              },
            ],
            "options": [
              {
                "title": "Size",
                "values": [
                  "S",
                  "M",
                  "L",
                  "XL",
                ],
              },
              {
                "title": "Color",
                "values": [
                  "Black",
                  "White",
                ],
              },
            ],
            "sales_channels": [
              {
                "id": "sc_01JSXX3XX2CBE5ZV10K88NR8Q4",
              },
            ],
            "status": "published",
            "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            "title": "Medusa T-Shirt",
            "variants": [
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXFRB2MPHAQG05YXG8V",
                "manage_inventory": true,
                "options": {
                  "Color": "Black",
                  "Size": "S",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHIRT-S-BLACK",
                "title": "S / Black",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXFQ44Q0QTE591BWT51",
                "manage_inventory": true,
                "options": {
                  "Color": "White",
                  "Size": "S",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHIRT-S-WHITE",
                "title": "S / White",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXF16D95TZT4F511AYS",
                "manage_inventory": true,
                "options": {
                  "Color": "Black",
                  "Size": "M",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHIRT-M-BLACK",
                "title": "M / Black",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXFPDHC22WPXJAJ1D14",
                "manage_inventory": true,
                "options": {
                  "Color": "White",
                  "Size": "M",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHIRT-M-WHITE",
                "title": "M / White",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXFWV657RM1ZBX8DSBB",
                "manage_inventory": true,
                "options": {
                  "Color": "Black",
                  "Size": "L",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHIRT-L-BLACK",
                "title": "L / Black",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXF2JWK1RYG8V2Q2PWT",
                "manage_inventory": true,
                "options": {
                  "Color": "White",
                  "Size": "L",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHIRT-L-WHITE",
                "title": "L / White",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXFA50F2R2F8HBVTQBP",
                "manage_inventory": true,
                "options": {
                  "Color": "Black",
                  "Size": "XL",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHIRT-XL-BLACK",
                "title": "XL / Black",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXFY0W5DE9HD4C7YD53",
                "manage_inventory": true,
                "options": {
                  "Color": "White",
                  "Size": "XL",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SHIRT-XL-WHITE",
                "title": "XL / White",
                "variant_rank": 0,
              },
            ],
            "weight": 400,
          },
        },
        "toUpdate": {
          "prod_01JSXX3ZVW4M4RS0NH4MSWCQWA": {
            "description": "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
            "discountable": true,
            "handle": "sweatshirt",
            "id": "prod_01JSXX3ZVW4M4RS0NH4MSWCQWA",
            "images": [
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
              },
            ],
            "options": [
              {
                "title": "Size",
                "values": [
                  "S",
                  "M",
                  "L",
                  "XL",
                ],
              },
            ],
            "sales_channels": [
              {
                "id": "sc_01JSXX3XX2CBE5ZV10K88NR8Q4",
              },
            ],
            "status": "published",
            "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            "title": "Medusa Sweatshirt",
            "variants": [
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXFG4R7PVX55YQCZQPB",
                "manage_inventory": true,
                "options": {
                  "Size": "S",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-S",
                "title": "S",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXG4Z955G5VJ9Z956GY",
                "manage_inventory": true,
                "options": {
                  "Size": "M",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-M",
                "title": "M",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGVMXD6CTKWB3KEAG3",
                "manage_inventory": true,
                "options": {
                  "Size": "L",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-L",
                "title": "L",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JSXX3ZXGF5JMS0ATYH5VDEGT",
                "manage_inventory": true,
                "options": {
                  "Size": "XL",
                },
                "prices": [
                  {
                    "amount": 10,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 15,
                    "currency_code": "usd",
                  },
                ],
                "sku": "SWEATSHIRT-XL",
                "title": "XL",
                "variant_rank": 0,
              },
            ],
            "weight": 400,
          },
          "prod_01JT598HEWAE555V0A6BD602MG": {
            "description": "Every programmer's best friend.",
            "discountable": true,
            "handle": "coffee-mug-v3",
            "id": "prod_01JT598HEWAE555V0A6BD602MG",
            "images": [
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png",
              },
            ],
            "options": [
              {
                "title": "Size",
                "values": [
                  "One Size",
                ],
              },
            ],
            "sales_channels": [],
            "status": "published",
            "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png",
            "title": "Medusa Coffee Mug",
            "variants": [
              {
                "allow_backorder": false,
                "id": "variant_01JT598HFWBE6ZYXWWVS1E5HFM",
                "manage_inventory": true,
                "options": {
                  "Size": "One Size",
                },
                "prices": [
                  {
                    "amount": 1000,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 1200,
                    "currency_code": "usd",
                  },
                ],
                "title": "One Size",
                "variant_rank": 0,
              },
            ],
            "weight": 400,
          },
          "prod_01JT598HEX26EHDG7SRK37Q3FG": {
            "description": "Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.",
            "discountable": true,
            "handle": "sweatpants-v2",
            "id": "prod_01JT598HEX26EHDG7SRK37Q3FG",
            "images": [
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
              },
              {
                "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
              },
            ],
            "options": [
              {
                "title": "Size",
                "values": [
                  "S",
                  "M",
                  "L",
                  "XL",
                ],
              },
            ],
            "sales_channels": [],
            "status": "published",
            "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
            "title": "Medusa Sweatpants",
            "variants": [
              {
                "allow_backorder": false,
                "id": "variant_01JT598HFWM8NWRS6QPPQZG0C6",
                "manage_inventory": true,
                "options": {
                  "Size": "S",
                },
                "prices": [
                  {
                    "amount": 2950,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 3350,
                    "currency_code": "usd",
                  },
                ],
                "title": "S",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JT598HFW9HED0YJ2A40DHWMK",
                "manage_inventory": true,
                "options": {
                  "Size": "M",
                },
                "prices": [
                  {
                    "amount": 2950,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 3350,
                    "currency_code": "usd",
                  },
                ],
                "title": "M",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JT598HFX2PASE49T503JJ9SB",
                "manage_inventory": true,
                "options": {
                  "Size": "L",
                },
                "prices": [
                  {
                    "amount": 2950,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 3350,
                    "currency_code": "usd",
                  },
                ],
                "title": "L",
                "variant_rank": 0,
              },
              {
                "allow_backorder": false,
                "id": "variant_01JT598HFX1KMJ9MYFJBHT422N",
                "manage_inventory": true,
                "options": {
                  "Size": "XL",
                },
                "prices": [
                  {
                    "amount": 2950,
                    "currency_code": "eur",
                  },
                  {
                    "amount": 3350,
                    "currency_code": "usd",
                  },
                ],
                "title": "XL",
                "variant_rank": 0,
              },
            ],
            "weight": 400,
          },
        },
      }
    `)
  })

  describe("Variant Metadata column", () => {
    it("should process variant metadata as JSON correctly", () => {
      const csvRow = {
        "Product Handle": "test-product",
        "Variant Title": "Test Variant",
        "Variant Metadata": '{ "key": "value", "number": 123 }',
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      const processor = new CSVNormalizer([normalized])
      const result = processor.proccess()

      expect(result.toCreate["test-product"].variants[0].metadata).toEqual({
        key: "value",
        number: 123,
      })
    })

    it("should throw an error for invalid JSON in variant metadata", () => {
      const csvRow = {
        "Product Handle": "test-product",
        "Variant Title": "Test Variant",
        "Variant Metadata": "invalid json",
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      const processor = new CSVNormalizer([normalized])

      expect(() => processor.proccess()).toThrow(
        'Row 1: Invalid value provided for "variant metadata". Expected a valid JSON string, received "invalid json"'
      )
    })
  })

  describe("System-generated columns", () => {
    it("should ignore product timestamp columns during import", () => {
      const csvRow: Record<string, string | boolean | number> = {
        "Product Handle": "test-product",
        "Product Title": "Test Product",
        "Product Created At": "",
        "Product Updated At": "",
        "Product Deleted At": "",
        "Product Is Giftcard": "true",
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      expect(normalized["product created at"]).toBe("")
      expect(normalized["product updated at"]).toBe("")
      expect(normalized["product deleted at"]).toBe("")
      expect(normalized["product is giftcard"]).toBe("true")

      const processor = new CSVNormalizer([normalized])
      const result = processor.proccess()

      // Should be in toCreate since we only have handle
      expect(result.toCreate["test-product"]).toBeDefined()
      expect(result.toCreate["test-product"].is_giftcard).toBe(true)

      // Timestamp fields should not be in the output since they're ignored
      expect(result.toCreate["test-product"]["created_at"]).toBeUndefined()
      expect(result.toCreate["test-product"]["updated_at"]).toBeUndefined()
      expect(result.toCreate["test-product"]["deleted_at"]).toBeUndefined()

      // Verify that the timestamp fields are present in normalized data but ignored during processing
      expect(normalized["product created at"]).toBe("")
      expect(normalized["product updated at"]).toBe("")
      expect(normalized["product deleted at"]).toBe("")
    })

    it("should ignore variant timestamp columns during import", () => {
      const csvRow: Record<string, string | boolean | number> = {
        "Product Handle": "test-product",
        "Product Title": "Test Product",
        "Variant Title": "Test Variant",
        "Variant SKU": "TEST-SKU",
        "Variant Created At": "",
        "Variant Updated At": "",
        "Variant Deleted At": "",
        "Variant Product Id": "prod_123",
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      expect(normalized["variant created at"]).toBe("")
      expect(normalized["variant updated at"]).toBe("")
      expect(normalized["variant deleted at"]).toBe("")
      expect(normalized["variant product id"]).toBe("prod_123")

      const processor = new CSVNormalizer([normalized])
      const result = processor.proccess()

      // Should be in toCreate since we only have handle
      expect(result.toCreate["test-product"]).toBeDefined()
      expect(result.toCreate["test-product"].variants).toHaveLength(1)

      const variant = result.toCreate["test-product"].variants[0]
      expect(variant.title).toBe("Test Variant")
      expect(variant.sku).toBe("TEST-SKU")

      // Timestamp fields should not be in the variant output since they're ignored
      expect(variant["created_at"]).toBeUndefined()
      expect(variant["updated_at"]).toBeUndefined()
      expect(variant["deleted_at"]).toBeUndefined()
      expect(variant["product_id"]).toBeUndefined()

      // Verify that the timestamp fields are present in normalized data but ignored during processing
      expect(normalized["variant created at"]).toBe("")
      expect(normalized["variant updated at"]).toBe("")
      expect(normalized["variant deleted at"]).toBe("")
      expect(normalized["variant product id"]).toBe("prod_123")
    })

    it("should process product is giftcard as boolean correctly", () => {
      const csvRow = {
        "Product Handle": "giftcard-product",
        "Product Title": "Gift Card",
        "Product Is Giftcard": "true",
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      const processor = new CSVNormalizer([normalized])
      const result = processor.proccess()

      expect(result.toCreate["giftcard-product"].is_giftcard).toBe(true)
    })

    it("should process product is giftcard as false correctly", () => {
      const csvRow = {
        "Product Handle": "regular-product",
        "Product Title": "Regular Product",
        "Product Is Giftcard": "false",
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      const processor = new CSVNormalizer([normalized])
      const result = processor.proccess()

      expect(result.toCreate["regular-product"].is_giftcard).toBe(false)
    })

    it("should handle product is giftcard with various truthy/falsy values", () => {
      const testCases = [
        { value: "true", expected: true },
        { value: "false", expected: false },
        { value: "TRUE", expected: true },
        { value: "FALSE", expected: false },
      ]

      testCases.forEach(({ value, expected }) => {
        const csvRow = {
          "Product Handle": `test-product-${value}`,
          "Product Title": "Test Product",
          "Product Is Giftcard": value,
        }

        const normalized = CSVNormalizer.preProcess(csvRow, 1)
        const processor = new CSVNormalizer([normalized])
        const result = processor.proccess()

        expect(result.toCreate[`test-product-${value}`].is_giftcard).toBe(
          expected
        )
      })
    })
  })

  describe("Column validation", () => {
    it("should accept all system-generated columns without error", () => {
      const csvRow: Record<string, string | boolean | number> = {
        "Product Handle": "test-product",
        "Product Title": "Test Product",
        "Product Created At": "",
        "Product Updated At": "",
        "Product Deleted At": "",
        "Product Is Giftcard": "true",
        "Variant Title": "Test Variant",
        "Variant Created At": "",
        "Variant Updated At": "",
        "Variant Deleted At": "",
        "Variant Product Id": "prod_123",
      }

      expect(() => CSVNormalizer.preProcess(csvRow, 1)).not.toThrow()
    })

    it("should still reject truly unknown columns", () => {
      const csvRow = {
        "Product Handle": "test-product",
        "Product Title": "Test Product",
        "Unknown Column": "some value",
      }

      expect(() => CSVNormalizer.preProcess(csvRow, 1)).toThrow(
        'Invalid column name(s) "Unknown Column"'
      )
    })

    it("should handle mixed case column names correctly", () => {
      const csvRow = {
        "PRODUCT HANDLE": "test-product",
        "Product Title": "Test Product",
        "PRODUCT IS GIFTCARD": "true",
        "Variant Created At": "2024-01-01T00:00:00Z",
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      expect(normalized["product handle"]).toBe("test-product")
      expect(normalized["product is giftcard"]).toBe("true")
      expect(normalized["variant created at"]).toBe("2024-01-01T00:00:00Z")
    })
  })

  describe("Edge cases", () => {
    it("should handle empty timestamp values", () => {
      const csvRow: Record<string, string | boolean | number> = {
        "Product Handle": "test-product",
        "Product Title": "Test Product",
        "Product Created At": "",
        "Product Updated At": "",
        "Product Deleted At": "",
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      expect(normalized["product created at"]).toBe("")
      expect(normalized["product updated at"]).toBe("")
      expect(normalized["product deleted at"]).toBe("")

      const processor = new CSVNormalizer([normalized])
      const result = processor.proccess()
      expect(result.toCreate["test-product"]).toBeDefined()
    })

    it("should handle products with only ID (no handle) correctly", () => {
      const csvRow = {
        "Product Id": "prod_123",
        "Product Title": "Test Product",
        "Product Is Giftcard": "true",
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      const processor = new CSVNormalizer([normalized])
      const result = processor.proccess()

      // Should be in toUpdate since we have an ID
      expect(result.toUpdate["prod_123"]).toBeDefined()
      expect(result.toUpdate["prod_123"].is_giftcard).toBe(true)
    })

    it("should handle products with both ID and handle correctly", () => {
      const csvRow = {
        "Product Id": "prod_123",
        "Product Handle": "test-product",
        "Product Title": "Test Product",
        "Product Is Giftcard": "true",
      }

      const normalized = CSVNormalizer.preProcess(csvRow, 1)
      const processor = new CSVNormalizer([normalized])
      const result = processor.proccess()

      // Should be in toUpdate since we have an ID
      expect(result.toUpdate["prod_123"]).toBeDefined()
      expect(result.toUpdate["prod_123"].is_giftcard).toBe(true)
      expect(result.toCreate["test-product"]).toBeUndefined()
    })
  })

  describe("Variant Option Id / Is Exclusive columns", () => {
    const baseRow = (overrides: Record<string, any> = {}) => ({
      "Product Handle": "p1",
      "Product Title": "P1",
      "Product Status": "draft",
      "Variant Title": "v1",
      "Variant Option 1 Name": "Color",
      "Variant Option 1 Value": "Red",
      ...overrides,
    })

    const runRow = (row: Record<string, any>) => {
      const normalized = CSVNormalizer.preProcess(row, 1)
      return new CSVNormalizer([normalized]).proccess()
    }

    it("carries the option id when the row has a Variant Option N Id column", () => {
      const result = runRow(
        baseRow({ "Variant Option 1 Id": "opt_existing" })
      )

      expect(result.toCreate["p1"].options).toEqual([
        { title: "Color", values: ["Red"], id: "opt_existing" },
      ])
    })

    it("carries is_exclusive when the row has a Variant Option N Is Exclusive column", () => {
      const result = runRow(
        baseRow({ "Variant Option 1 Is Exclusive": "false" })
      )

      expect(result.toCreate["p1"].options).toEqual([
        { title: "Color", values: ["Red"], is_exclusive: false },
      ])
    })

    it("carries is_exclusive when the value is already a boolean (e.g. parsed by json-2-csv)", () => {
      const resultFalse = runRow(
        baseRow({ "Variant Option 1 Is Exclusive": false })
      )
      expect(resultFalse.toCreate["p1"].options).toEqual([
        { title: "Color", values: ["Red"], is_exclusive: false },
      ])

      const resultTrue = runRow(
        baseRow({ "Variant Option 1 Is Exclusive": true })
      )
      expect(resultTrue.toCreate["p1"].options).toEqual([
        { title: "Color", values: ["Red"], is_exclusive: true },
      ])
    })

    it("ignores Is Exclusive values it cannot parse as boolean", () => {
      const result = runRow(
        baseRow({ "Variant Option 1 Is Exclusive": "garbage" })
      )

      expect(result.toCreate["p1"].options).toEqual([
        { title: "Color", values: ["Red"] },
      ])
    })

    it("does not emit id or is_exclusive when the row has neither column", () => {
      const result = runRow(baseRow())

      expect(result.toCreate["p1"].options).toEqual([
        { title: "Color", values: ["Red"] },
      ])
    })

    it("merges across multiple rows of the same product (first non-empty wins)", () => {
      const row1 = baseRow({
        "Variant Title": "v1",
        "Variant Option 1 Id": "opt_global_color",
      })
      const row2 = baseRow({
        "Variant Title": "v2",
        // Different value, no id supplied — should not clobber opt_global_color
        "Variant Option 1 Value": "Blue",
      })

      const normalized = [row1, row2].map((r, i) =>
        CSVNormalizer.preProcess(r, i + 1)
      )
      const result = new CSVNormalizer(normalized).proccess()

      expect(result.toCreate["p1"].options).toHaveLength(1)
      expect(result.toCreate["p1"].options[0]).toEqual(
        expect.objectContaining({
          title: "Color",
          values: expect.arrayContaining(["Red", "Blue"]),
          id: "opt_global_color",
        })
      )
    })
  })
})
