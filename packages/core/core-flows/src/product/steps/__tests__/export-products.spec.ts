import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { exportProductsStep } from "../export-products"

const buildContainer = (
  queryGraphOverride: (args: any) => any = () => ({ data: [] })
): { container: MedusaContainer; writes: string[] } => {
  const writes: string[] = []
  const container = createContainer() as unknown as MedusaContainer
  
  container.register(
    ContainerRegistrationKeys.QUERY,
    asFunction(() => ({
      graph: async (args: any) => queryGraphOverride(args),
    }))
  )

  container.register(
    Modules.FILE,
    asFunction(() => ({
      getUploadStream: async () => {
        const writeStream = {
          write: (data: string) => {
            writes.push(data)
            return true
          },
          end: () => {},
          once: (event: string, cb: () => void) => cb(),
        }
        return { writeStream, promise: Promise.resolve(), fileKey: "test-file-key" }
      },
      deleteFiles: async () => {},
    }))
  )

  container.register(
    Modules.REGION,
    asFunction(() => ({
      listRegions: async () => {
        return []
      },
    }))
  )

  return { container, writes }
}

const runStep = async (
  container: MedusaContainer,
  input: any
): Promise<any> => {
  const workflow = createWorkflow(
    `export-products-test-${Math.random().toString(36).slice(2)}`,
    () => {
      const out = exportProductsStep(input)
      return new WorkflowResponse(out)
    }
  )
  return workflow(container).run({ input: {} })
}

describe("exportProductsStep", () => {
  it("generates a unified CSV header across multiple pagination batches", async () => {
    const queryGraphOverride = (args: any) => {
      const { entity, pagination } = args
      if (entity === "product") {
        if (pagination?.skip === 0) {
          return {
            data: [
              {
                id: "prod_1",
                title: "Product 1",
                handle: "prod-1",
              },
            ],
          }
        } else if (pagination?.skip === 1) { 
          return {
            data: [
              {
                id: "prod_2",
                title: "Product 2",
                handle: "prod-2",
                description: "This is product 2",
              },
            ],
          }
        }
      }
      return { data: [] }
    }

    const { container, writes } = buildContainer(queryGraphOverride)

    await runStep(container, {
      select: ["title", "description"],
      batch_size: 1,
    })

    const csvOutput = writes.join("")
    
    const lines = csvOutput.split("\n")
    const header = lines[0]
    
    expect(header).toContain("Product Id")
    expect(header).toContain("Product Title")
    expect(header).toContain("Product Handle")
    expect(header).toContain("Product Description")
    const row1 = lines[1]
    const row2 = lines[2]
    
    expect(row1).toBeDefined()
    expect(row2).toBeDefined()
  })

  it("aligns columns correctly when array lengths differ across batches", async () => {
    const queryGraphOverride = (args: any) => {
      if (args.pagination?.skip === 0) {
        return { data: [{ id: "prod_1", images: [{ url: "a.jpg" }] }] }
      }
      if (args.pagination?.skip === 1) {
        return {
          data: [
            {
              id: "prod_2",
              images: [{ url: "a.jpg" }, { url: "b.jpg" }],
            },
          ],
        }
      }
      return { data: [] }
    }
    const { container, writes } = buildContainer(queryGraphOverride)
    await runStep(container, { select: ["images"], batch_size: 1 })

    const csvOutput = writes.join("")
    const lines = csvOutput.split("\n").filter(Boolean)
    const headerColumns = lines[0].split(",")
    
    // Check that we got the expanded array headers
    expect(headerColumns).toContain("Product Image 1")
    expect(headerColumns).toContain("Product Image 2")
    
    // Check that all rows have the same number of columns as the header
    for (const row of lines.slice(1)) {
      expect(row.split(",").length).toEqual(headerColumns.length)
    }
  })
})
