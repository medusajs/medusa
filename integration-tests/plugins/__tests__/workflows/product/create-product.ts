import path from "path"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import {
  createProducts,
  CreateProductsActions,
  Handlers,
  InputAlias,
  pipe,
} from "@medusajs/workflows"
import { IProductModuleService, WorkflowTypes } from "@medusajs/types"
import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
} from "@medusajs/medusa"

describe("CreateProduct workflow", function () {
  let medusaProcess
  let medusaContainer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    await initDb({ cwd } as any)
    const { container } = await bootstrapApp({ cwd })
    medusaContainer = container
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  it("should compensate all the invoke if something fails", async () => {
    const workflow = createProducts(medusaContainer)

    workflow.appendAction(
      "fail_step",
      CreateProductsActions.result,
      {
        invoke: pipe(
          {
            inputAlias: InputAlias.ProductsInputData,
            invoke: {
              from: InputAlias.ProductsInputData,
            },
          },
          async function failStep() {
            throw new Error(`Failed to create products`)
          }
        ),
      },
      {
        noCompensation: true,
      }
    )

    const input: WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO =
      {
        products: [
          {
            title: "Test product",
            type: { value: "physical" },
            tags: [{ value: "test" }],
            subtitle: "Test subtitle",
            variants: [
              {
                title: "Test variant",
                prices: [
                  {
                    amount: 100,
                    currency_code: "usd",
                  },
                ],
              },
            ],
            options: [
              {
                title: "Test option",
              },
            ],
          },
        ],
        config: {
          listConfig: {
            select: defaultAdminProductFields,
            relations: defaultAdminProductRelations,
          },
        },
      }

    const manager = medusaContainer.resolve("manager")
    const context = {
      manager,
    }

    const { result, errors, transaction } = await workflow.run({
      input,
      context,
      throwOnError: false,
    })

    expect(errors).toEqual([
      {
        action: "fail_step",
        handlerType: "invoke",
        error: new Error(`Failed to create products`),
      },
    ])

    expect(transaction.getState()).toEqual("reverted")

    // TODO
    // Investigate why the following does not work and jest hands
    // and end up having memory leak issues

    // tried with individual expect statements as well
    // tried string instead of enum for the keys
    // tried with only one object tested inside
    // tried with only one property
    // and so on...

    // the only thing that works was expect(invoke).toEqual(expect.objectContaining({}))

    /*const { invoke } = transaction.getContext()
    expect(invoke).toEqual(
      expect.objectContaining({
        [CreateProductsActions.prepare]: {
          products: [
            expect.objectContaining({
              title: input.products[0].title,
              type: input.products[0].type,
              tags: input.products[0].tags,
              subtitle: input.products[0].subtitle,
              variants: input.products[0].variants,
              options: input.products[0].options,
              handle: kebabCase(input.products[0].title),
            }),
          ],
          productsHandleSalesChannelsMap: expect.any(Object),
          productsHandleVariantsIndexPricesMap: expect.any(Object),
          config: input.config,
        },
        [CreateProductsActions.createProducts]: expect.objectContaining({
          id: expect.any(String),
          title: input.products[0].title,
          type: {
            id: expect.any(String),
          },
          variants: [
            expect.objectContaining({
              id: expect.any(String),
            }),
          ],
          options: [
            expect.objectContaining({
              id: expect.any(String),
            }),
          ],
          tags: [
            expect.objectContaining({
              id: expect.any(String),
            }),
          ],
        }),
        [CreateProductsActions.createPrices]: undefined,
        [CreateProductsActions.createInventoryItems]: [
          {
            variant: expect.objectContaining({
              id: expect.any(String),
            }),
            inventoryItem: expect.objectContaining({
              id: expect.any(String),
            }),
          },
        ],
        [CreateProductsActions.attachInventoryItems]: [
          expect.objectContaining({
            inventory_item_id: expect.any(String),
            variant_id: expect.any(String),
            required_quantity: 1,
            id: expect.any(String),
          }),
        ],
      })
    )*/

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    )

    const productId = result[0].id

    let [product] = await Handlers.ProductHandlers.listProducts({
      container: medusaContainer,
      context,
      data: {
        ids: [productId],
      },
    } as any)

    expect(product).toBeUndefined()

    // TODO: update to use the registration name once this is merged https://github.com/medusajs/medusa/pull/4626
    const productModule = medusaContainer.resolve(
      "productModuleService"
    ) as IProductModuleService

    ;[product] = await productModule.list(
      {
        id: productId,
      },
      {
        withDeleted: true,
      }
    )

    expect(product).toEqual(
      expect.objectContaining({
        deleted_at: expect.any(String),
      })
    )
  })
})
