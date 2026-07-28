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
    
    expect(header).toContain("id")
    expect(header).toContain("title")
    expect(header).toContain("handle")
    expect(header).toContain("description")
    const row1 = lines[1]
    const row2 = lines[2]
    
    expect(row1).toBeDefined()
    expect(row2).toBeDefined()
  })
})
