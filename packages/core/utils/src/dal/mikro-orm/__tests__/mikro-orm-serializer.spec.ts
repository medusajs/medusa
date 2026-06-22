import express from "express"
import autocannon, { Result } from "autocannon"
import { MikroORM, EntitySerializer } from "@medusajs/deps/mikro-orm/core"
import { defineConfig } from "@medusajs/deps/mikro-orm/postgresql"
import {
  Entity1WithUnDecoratedProp,
  Entity2WithUnDecoratedProp,
  Product,
  ProductOption,
  ProductOptionValue,
  ProductVariant,
} from "../__fixtures__/utils"
import { mikroOrmSerializer as mikroOrmSerializerOld } from "../mikro-orm-serializer-old"
import { mikroOrmSerializer } from "../mikro-orm-serializer"

jest.setTimeout(60000)

describe("mikroOrmSerializer", () => {
  beforeEach(async () => {
    await MikroORM.init(
      defineConfig({
        entities: [
          Entity1WithUnDecoratedProp,
          Entity2WithUnDecoratedProp,
          Product,
          ProductOption,
          ProductOptionValue,
          ProductVariant,
        ],
        user: "postgres",
        password: "",
        dbName: "test",
        connect: false,
      })
    )
  })

  it("should serialize an entity", async () => {
    const entity1 = new Entity1WithUnDecoratedProp({
      id: "1",
      deleted_at: null,
    })
    entity1.unknownProp = "calculated"

    const entity2 = new Entity2WithUnDecoratedProp({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = mikroOrmSerializer(entity1, {
      preventCircularRef: false,
    })

    expect(serialized).toEqual({
      id: "1",
      deleted_at: null,
      unknownProp: "calculated",
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1: {
            id: "1",
            deleted_at: null,
            unknownProp: "calculated",
          },
          entity1_id: "1",
        },
      ],
    })
  })

  it("should serialize an array of entities", async () => {
    const entity1 = new Entity1WithUnDecoratedProp({
      id: "1",
      deleted_at: null,
    })
    entity1.unknownProp = "calculated"

    const entity2 = new Entity2WithUnDecoratedProp({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = mikroOrmSerializer([entity1, entity1], {
      preventCircularRef: false,
    })

    const expectation = {
      id: "1",
      deleted_at: null,
      unknownProp: "calculated",
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1: {
            id: "1",
            deleted_at: null,
            unknownProp: "calculated",
          },
          entity1_id: "1",
        },
      ],
    }

    expect(serialized).toEqual([expectation, expectation])
  })

  it("should serialize an entity preventing circular relation reference", async () => {
    const entity1 = new Entity1WithUnDecoratedProp({
      id: "1",
      deleted_at: null,
    })
    entity1.unknownProp = "calculated"

    const entity2 = new Entity2WithUnDecoratedProp({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = mikroOrmSerializer(entity1)

    expect(serialized).toEqual({
      id: "1",
      deleted_at: null,
      unknownProp: "calculated",
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1_id: "1",
        },
      ],
    })
  })

  it(`should properly serialize nested relations and sibling to not return parents into children`, async () => {
    const productOptionValue = new ProductOptionValue()
    productOptionValue.id = "1"
    productOptionValue.name = "Product option value 1"
    productOptionValue.option_id = "1"

    const productOptions = new ProductOption()
    productOptions.id = "1"
    productOptions.name = "Product option 1"
    productOptions.values.add(productOptionValue)

    const productVariant = new ProductVariant()
    productVariant.id = "1"
    productVariant.name = "Product variant 1"
    productVariant.options.add(productOptionValue)

    const product = new Product()
    product.id = "1"
    product.name = "Product 1"
    product.options.add(productOptions)
    product.variants.add(productVariant)

    const serialized = mikroOrmSerializer(product)

    expect(serialized).toEqual({
      id: "1",
      options: [
        {
          id: "1",
          values: [
            {
              id: "1",
              variants: [
                {
                  id: "1",
                  name: "Product variant 1",
                },
              ],
              name: "Product option value 1",
              option_id: "1",
            },
          ],
          name: "Product option 1",
        },
      ],
      variants: [
        {
          id: "1",
          options: [
            {
              id: "1",
              name: "Product option value 1",
              option_id: "1",
              option: {
                id: "1",
                name: "Product option 1",
              },
            },
          ],
          name: "Product variant 1",
        },
      ],
      name: "Product 1",
    })
  })

  it("should serialize an array of entities assigned to an undeclared property", async () => {
    // An array of entities assigned at runtime to a property that does not
    // exist in the entity's metadata. Such arrays match neither the Collection
    // nor the entity branches, so without dedicated handling they fall through
    // to the scalar fallback and leak live ORM entities into the output, whose
    // toJSON re-serializes the entire loaded graph downstream (e.g. in
    // res.json or a cache write). See the test below for the sibling case
    // where the property IS declared but its Collection value is replaced with a plain array.
    const image1 = new Entity1WithUnDecoratedProp({
      id: "img_1",
      deleted_at: null,
    })
    const image2 = new Entity1WithUnDecoratedProp({
      id: "img_2",
      deleted_at: null,
    })

    const variant = new ProductVariant()
    variant.id = "1"
    variant.name = "Product variant 1"
    ;(variant as any).images = [image1, image2]

    const serialized = mikroOrmSerializer<any>(variant)

    expect(serialized.images).toHaveLength(2)

    for (const serializedImage of serialized.images) {
      // Must be a plain object, not a live ORM entity
      expect(serializedImage.constructor).toBe(Object)
      expect(serializedImage.__meta).toBeUndefined()
      expect(serializedImage.__helper).toBeUndefined()
    }

    expect(serialized.images).toEqual([
      { id: "img_1", deleted_at: null, entity2: [] },
      { id: "img_2", deleted_at: null, entity2: [] },
    ])
  })

  it("should serialize a declared relation whose Collection was overwritten with a plain array of entities", async () => {
    // Mirrors the runtime shape produced by the product module's
    // buildVariantImagesFromProduct: ProductVariant.images is a declared m:n
    // relation, but the service computes the value (general + variant-specific
    // images) and assigns it as a plain array, replacing the Collection. The
    // metadata then says "m:n" while the value is an Array, which matches
    // neither the Collection nor the entity branches.
    const optionValue = new ProductOptionValue()
    optionValue.id = "val_1"
    optionValue.name = "small"
    optionValue.option_id = "opt_1"

    const variant = new ProductVariant()
    variant.id = "1"
    variant.name = "Product variant 1"
    // overwrite the declared m:n Collection with a plain array
    ;(variant as any).options = [optionValue]

    const serialized = mikroOrmSerializer<any>(variant)

    expect(serialized.options).toHaveLength(1)
    const serializedValue = serialized.options[0]

    // Must be a plain object, not a live ORM entity
    expect(serializedValue.constructor).toBe(Object)
    expect(serializedValue.__meta).toBeUndefined()
    expect(serializedValue.__helper).toBeUndefined()
    expect(serializedValue).toEqual(
      expect.objectContaining({
        id: "val_1",
        name: "small",
        option_id: "opt_1",
      })
    )
  })

  it.skip("should benchmark serializers with autocannon load testing", async () => {
    const logs: string[] = []
    logs.push("🚀 Load Testing Serializers with Autocannon")
    logs.push("=".repeat(80))

    // Generate test dataset
    function generateLoadTestProducts(count: number): Product[] {
      const products: Product[] = []

      for (let i = 0; i < count; i++) {
        const product = new Product()
        product.id = `product-${i}`
        product.name = `Product ${i}`

        // Generate 3 options per product
        for (let optionIndex = 0; optionIndex < 3; optionIndex++) {
          const option = new ProductOption()
          option.id = `option-${product.id}-${optionIndex}`
          option.name = `Option ${optionIndex} for Product ${product.id}`
          option.product = product

          // Generate 3 values per option
          for (let valueIndex = 0; valueIndex < 3; valueIndex++) {
            const value = new ProductOptionValue()
            value.id = `option-value-${option.id}-${valueIndex}`
            value.name = `Option Value ${valueIndex} for Option ${option.id}`
            value.option_id = option.id
            value.option = option
            option.values.add(value)
          }

          product.options.add(option)
        }

        // Generate 2 variants per product
        for (let variantIndex = 0; variantIndex < 2; variantIndex++) {
          const variant = new ProductVariant()
          variant.id = `variant-${product.id}-${variantIndex}`
          variant.name = `Variant ${variantIndex} for Product ${product.id}`
          variant.product_id = product.id
          variant.product = product

          // Assign option values to variants
          const optionArray = product.options.getItems()
          for (let j = 0; j < 2 && j < optionArray.length; j++) {
            const option = optionArray[j]
            const optionValues = option.values.getItems()
            if (optionValues.length > 0) {
              const value = optionValues[0]
              variant.options.add(value)
              value.variants.add(variant)
            }
          }

          product.variants.add(variant)
        }

        products.push(product)
      }

      return products
    }

    // Test different dataset sizes
    const testSizes = [10, 100, 1000]
    const allResults: Array<{
      size: number
      results: Array<{
        name: string
        requestsPerSecond: number
        latency: number
        latencyP90: number
        throughput: number
        errors: number
      }>
    }> = []

    for (const size of testSizes) {
      logs.push(`\n${"=".repeat(100)}`)
      logs.push(`🎯 TESTING ${size.toLocaleString()} PRODUCTS`)
      logs.push(`${"=".repeat(100)}`)

      // Create test dataset for this size
      const testProducts = generateLoadTestProducts(size)

      // Create Express server with serializer endpoints
      const app = express()
      app.use(express.json())

      app.get("/mikro-orm", (_req, res) => {
        const result = testProducts.map((product) =>
          EntitySerializer.serialize(product, {
            populate: ["*"],
            forceObject: true,
            skipNull: undefined,
            ignoreSerializers: undefined,
            exclude: undefined,
          })
        )
        res.json(result)
      })

      app.get("/original", (_req, res) => {
        const result = mikroOrmSerializerOld(testProducts)
        res.json(result)
      })

      app.get("/optimized", (_req, res) => {
        const result = mikroOrmSerializer(testProducts)
        res.json(result)
      })

      // Start server
      const server = app.listen(0) // Use port 0 for automatic port assignment
      const port = (server.address() as any)?.port

      if (!port) {
        throw new Error("Failed to start server")
      }

      logs.push(`🖥️  Server started on port ${port}`)
      logs.push(`📊 Testing with ${testProducts.length} products per request`)

      try {
        // Autocannon test configurations
        const testConfigs = [
          { name: "MikroOrm", path: "/mikro-orm" },
          { name: "Original", path: "/original" },
          { name: "Optimized", path: "/optimized" },
        ]

        const sizeResults: Array<{
          name: string
          requestsPerSecond: number
          latency: number
          latencyP90: number
          throughput: number
          errors: number
        }> = []

        for (const config of testConfigs) {
          logs.push(`\n🔥 Load testing: ${config.name}`)
          logs.push("-".repeat(50))

          const result = await new Promise<Result>((resolve, reject) => {
            autocannon(
              {
                url: `http://localhost:${port}${config.path}`,
                connections: 10,
                duration: 20, // 10 seconds
                pipelining: 1,
              },
              (err, result) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(result!)
                }
              }
            )
          })

          const requestsPerSecond = result.requests.average
          const latency = result.latency.average
          const latencyP90 = result.latency.p90
          const throughput = result.throughput.average
          const errors = result.errors

          logs.push(`   Requests/sec: ${requestsPerSecond.toFixed(2)}`)
          logs.push(`   Avg Latency: ${latency.toFixed(2)}ms`)
          logs.push(`   P90 Latency: ${latencyP90.toFixed(2)}ms`)
          logs.push(
            `   Throughput: ${(throughput / 1024 / 1024).toFixed(2)} MB/s`
          )
          logs.push(`   Errors: ${errors}`)

          sizeResults.push({
            name: config.name,
            requestsPerSecond,
            latency,
            latencyP90,
            throughput,
            errors,
          })
        }

        // Generate comparison table for this size
        logs.push(
          `\n📈 Load Testing Performance Comparison for ${size} products:`
        )
        logs.push("-".repeat(140))
        logs.push(
          `${"Serializer".padEnd(15)} ${"Requests/sec".padEnd(
            15
          )} ${"Avg Latency (ms)".padEnd(18)} ${"P90 Latency (ms)".padEnd(
            18
          )} ${"Throughput (MB/s)".padEnd(18)} ${"Errors".padEnd(
            10
          )} ${"RPS Improvement"}`
        )
        logs.push("-".repeat(140))

        const baselineRps = sizeResults[0].requestsPerSecond // MikroOrm as baseline

        sizeResults.forEach((result) => {
          const rpsImprovement = result.requestsPerSecond / baselineRps
          const improvementText =
            rpsImprovement === 1 ? "baseline" : `${rpsImprovement.toFixed(1)}x`

          logs.push(
            `${result.name.padEnd(15)} ${result.requestsPerSecond
              .toFixed(2)
              .padEnd(15)} ${result.latency
              .toFixed(2)
              .padEnd(18)} ${result.latencyP90.toFixed(2).padEnd(18)} ${(
              result.throughput /
              1024 /
              1024
            )
              .toFixed(2)
              .padEnd(18)} ${result.errors
              .toString()
              .padEnd(10)} ${improvementText}`
          )
        })

        logs.push(`\n🎯 Key Insights for ${size} products:`)
        const optimizedResult = sizeResults.find((r) => r.name === "Optimized")
        const originalResult = sizeResults.find((r) => r.name === "Original")
        const mikroOrmResult = sizeResults.find((r) => r.name === "MikroOrm")

        if (optimizedResult && originalResult && mikroOrmResult) {
          const rpsImprovementVsOriginal =
            optimizedResult.requestsPerSecond / originalResult.requestsPerSecond
          const rpsImprovementVsMikroOrm =
            optimizedResult.requestsPerSecond / mikroOrmResult.requestsPerSecond
          const latencyImprovementVsOriginal =
            ((originalResult.latency - optimizedResult.latency) /
              originalResult.latency) *
            100

          logs.push(
            `   • Optimized serializer handles ${rpsImprovementVsOriginal.toFixed(
              1
            )}x more requests/sec than Original`
          )
          logs.push(
            `   • Optimized serializer handles ${rpsImprovementVsMikroOrm.toFixed(
              1
            )}x more requests/sec than MikroOrm`
          )
          logs.push(
            `   • ${latencyImprovementVsOriginal.toFixed(
              1
            )}% lower latency compared to Original serializer`
          )
        }

        allResults.push({ size, results: sizeResults })
      } finally {
        // Clean up server
        server.close()
        logs.push(`\n🔴 Server stopped for ${size} products test`)
      }
    }

    // Generate comprehensive comparison across all sizes
    logs.push(`\n\n${"=".repeat(150)}`)
    logs.push("📊 COMPREHENSIVE AUTOCANNON LOAD TESTING ANALYSIS")
    logs.push(`${"=".repeat(150)}`)

    logs.push("\n🚀 Autocannon Load Testing Scaling Analysis:")
    logs.push("-".repeat(140))
    logs.push(
      `${"Size".padEnd(12)} ${"RPS (M/O/Op)".padEnd(
        20
      )} ${"Avg Latency (M/O/Op)".padEnd(22)} ${"P90 Latency (M/O/Op)".padEnd(
        22
      )} ${"Throughput MB/s (M/O/Op)".padEnd(
        25
      )} ${"Speedup vs M (O/Op)".padEnd(18)} ${"Speedup vs O (Op)"}`
    )
    logs.push("-".repeat(140))

    allResults.forEach(({ size, results }) => {
      const mikroOrm = results.find((r) => r.name === "MikroOrm")
      const original = results.find((r) => r.name === "Original")
      const optimized = results.find((r) => r.name === "Optimized")
      if (original && optimized && mikroOrm) {
        const speedupOptimizedVsMikroOrm =
          optimized.requestsPerSecond / mikroOrm.requestsPerSecond
        const speedupOptimizedVsOriginal =
          optimized.requestsPerSecond / original.requestsPerSecond
        const speedupOriginalVsMikroOrm =
          original.requestsPerSecond / mikroOrm.requestsPerSecond

        const rpsValues = `${mikroOrm.requestsPerSecond.toFixed(
          1
        )}/${original.requestsPerSecond.toFixed(
          1
        )}/${optimized.requestsPerSecond.toFixed(1)}`
        const avgLatencyValues = `${mikroOrm.latency.toFixed(
          1
        )}/${original.latency.toFixed(1)}/${optimized.latency.toFixed(1)}`
        const p90LatencyValues = `${mikroOrm.latencyP90.toFixed(
          1
        )}/${original.latencyP90.toFixed(1)}/${optimized.latencyP90.toFixed(1)}`
        const throughputValues = `${(mikroOrm.throughput / 1024 / 1024).toFixed(
          1
        )}/${(original.throughput / 1024 / 1024).toFixed(1)}/${(
          optimized.throughput /
          1024 /
          1024
        ).toFixed(1)}`
        const speedupVsMikroOrm = `${speedupOriginalVsMikroOrm.toFixed(
          1
        )}x/${speedupOptimizedVsMikroOrm.toFixed(1)}x`
        const speedupVsOriginal = `${speedupOptimizedVsOriginal.toFixed(1)}x`

        logs.push(
          `${size.toLocaleString().padEnd(12)} ${rpsValues.padEnd(
            20
          )} ${avgLatencyValues.padEnd(22)} ${p90LatencyValues.padEnd(
            22
          )} ${throughputValues.padEnd(25)} ${speedupVsMikroOrm.padEnd(
            18
          )} ${speedupVsOriginal}`
        )
      }
    })

    logs.push(`\n🎯 Overall Load Testing Performance Summary:`)
    allResults.forEach(({ size, results }) => {
      const optimized = results.find((r) => r.name === "Optimized")
      const original = results.find((r) => r.name === "Original")
      const mikroOrm = results.find((r) => r.name === "MikroOrm")

      if (optimized && original && mikroOrm) {
        const rpsGainVsOriginal =
          ((optimized.requestsPerSecond - original.requestsPerSecond) /
            original.requestsPerSecond) *
          100
        const rpsGainVsMikroOrm =
          ((optimized.requestsPerSecond - mikroOrm.requestsPerSecond) /
            mikroOrm.requestsPerSecond) *
          100

        logs.push(`\n   📈 ${size} products:`)
        logs.push(
          `      • +${rpsGainVsOriginal.toFixed(
            1
          )}% more requests/sec vs Original (${original.requestsPerSecond.toFixed(
            1
          )} → ${optimized.requestsPerSecond.toFixed(1)})`
        )
        logs.push(
          `      • +${rpsGainVsMikroOrm.toFixed(
            1
          )}% more requests/sec vs MikroOrm (${mikroOrm.requestsPerSecond.toFixed(
            1
          )} → ${optimized.requestsPerSecond.toFixed(1)})`
        )
      }
    })

    console.log(logs.join("\n"))
  }, 1200000)
})
