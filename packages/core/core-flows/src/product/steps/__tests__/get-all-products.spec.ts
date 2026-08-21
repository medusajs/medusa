import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { getAllProductsStep } from "../get-all-products"

const PAGE_SIZE = 200

/**
 * Builds a container whose Query serves `linkCount` product_sales_channel rows
 * for the given channel, of which only the products in `visibleIds` survive the
 * remaining product filters.
 */
const buildContainer = (
  linkCount: number,
  isVisible: (index: number) => boolean
): { container: MedusaContainer; productPages: number[] } => {
  const productPages: number[] = []

  const container = createContainer() as unknown as MedusaContainer
  container.register(
    ContainerRegistrationKeys.QUERY,
    asFunction(() => ({
      graph: async ({ entity, pagination, filters }: any) => {
        if (entity === "product_sales_channel") {
          const skip = pagination?.skip ?? 0
          const take = pagination?.take ?? linkCount
          const rows: { product_id: string }[] = []

          for (let i = skip; i < Math.min(skip + take, linkCount); i++) {
            rows.push({ product_id: `prod_${i}` })
          }

          return { data: rows }
        }

        // The product query is filtered, so it can return fewer rows than the
        // link page handed to it.
        const ids: string[] = filters?.id ?? []
        const visible = ids.filter((id) =>
          isVisible(parseInt(id.replace("prod_", ""), 10))
        )
        productPages.push(visible.length)

        return { data: visible.map((id) => ({ id })) }
      },
    }))
  )

  return { container, productPages }
}

const runStep = async (container: MedusaContainer, input: any) => {
  const workflow = createWorkflow(
    `get-all-products-test-${Math.random().toString(36).slice(2)}`,
    () => {
      const out = getAllProductsStep(input)
      return new WorkflowResponse(out)
    }
  )

  const { result } = await workflow(container).run({ input: {} as any })
  return result
}

describe("getAllProductsStep", () => {
  it("keeps paginating when a sales channel page is thinned by other filters", async () => {
    // Two full link pages plus a partial one. One product on the first page is
    // filtered out, which used to end the loop immediately.
    const linkCount = PAGE_SIZE * 2 + 5
    const { container } = buildContainer(linkCount, (i) => i !== 3)

    const result: any = await runStep(container, {
      select: ["id"],
      filter: { sales_channel_id: "sc_1", status: "published" },
    })

    expect(result.length).toEqual(linkCount - 1)
  })

  it("does not stop when a whole link page is filtered out", async () => {
    const linkCount = PAGE_SIZE + 3
    // Nothing on the first page survives the filters.
    const { container } = buildContainer(linkCount, (i) => i >= PAGE_SIZE)

    const result: any = await runStep(container, {
      select: ["id"],
      filter: { sales_channel_id: "sc_1", status: "published" },
    })

    expect(result.length).toEqual(3)
  })

  it("still terminates on the product count when no sales channel is given", async () => {
    const { container } = buildContainer(0, () => true)

    const result: any = await runStep(container, {
      select: ["id"],
      filter: { status: "published" },
    })

    expect(result).toEqual([])
  })
})
