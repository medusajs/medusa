import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { addShippingMethodToCartWorkflow } from "@medusajs/workflows"

import { getContainer } from "../../../../environment-helpers/use-container"
import {
  simpleCartFactory,
  simpleRegionFactory,
  simpleShippingOptionFactory,
} from "../../../../factories"

jest.setTimeout(5000000)

describe("/store/carts", () => {
  let dbConnection
  let shutdownServer
  let medusaContainer

  let cartId = "test-cart"
  let regionId = "test-region"
  let shippingOptionId = "test-option"
  let shippingOptionIdOther = "test-option-other"

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd } as any)
    shutdownServer = await startBootstrapApp({ cwd })
    medusaContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await simpleRegionFactory(dbConnection, {
      id: regionId,
    })

    await simpleCartFactory(dbConnection, {
      id: cartId,
      region: regionId,
    })

    await simpleShippingOptionFactory(dbConnection, {
      id: shippingOptionId,
      region_id: regionId,
    })

    await simpleShippingOptionFactory(dbConnection, {
      id: "test-option-other",
      region_id: regionId,
    })
  })

  afterEach(async () => {
    await doAfterEach()
  })

  it("should add a shipping method to cart", async () => {
    const manager = medusaContainer.resolve("manager")
    const cartService = medusaContainer.resolve("cartService")

    const addShippingMethodWorkflow =
      addShippingMethodToCartWorkflow(medusaContainer)

    const input = {
      cart_id: cartId,
      option_id: shippingOptionId,
      data: {},
    }

    const { result, transaction } = await addShippingMethodWorkflow.run({
      input,
      context: {
        manager,
      },
    })

    expect(result).toBeDefined()
    expect(transaction.getState()).toEqual("done")

    const cart = await cartService.retrieve(cartId, {
      relations: ["shipping_methods"],
    })

    expect(cart.shipping_methods).toEqual([
      expect.objectContaining({
        shipping_option_id: shippingOptionId,
      }),
    ])
  })

  it.only("should compensate correctly if add shipping method fails", async () => {
    const manager = medusaContainer.resolve("manager")
    const cartService = medusaContainer.resolve("cartService")

    // add a shipping method to the cart to compare against
    await cartService.addShippingMethod(cartId, shippingOptionId, {})

    // retrieve cart before
    const cartBefore = await cartService.retrieve(cartId, {
      relations: ["shipping_methods"],
    })

    const addShippingMethodWorkflow =
      addShippingMethodToCartWorkflow(medusaContainer)

    addShippingMethodWorkflow.appendAction(
      "fail_step",
      "upsertPaymentSessions",
      {
        invoke: async function () {
          throw new Error(`Failed to add shipping method`)
        },
      },
      {
        noCompensation: true,
      }
    )

    const input = {
      cart_id: cartId,
      option_id: shippingOptionIdOther,
      data: {},
    }

    const { errors, transaction } = await addShippingMethodWorkflow.run({
      input,
      context: {
        manager,
      },
      throwOnError: false,
    })

    const cartAfter = await cartService.retrieve(cartId, {
      relations: ["shipping_methods", "payment_sessions"],
    })

    expect(cartAfter.shipping_methods[0]).toEqual(
      expect.objectContaining({
        id: cartBefore.shipping_methods[0].id,
        shipping_option_id: cartBefore.shipping_methods[0].shipping_option_id,
      })
    )

    expect(cartAfter.payment_sessions).toEqual([])
    expect(cartAfter.payment_session).toEqual(undefined)

    expect(errors).toEqual([
      {
        action: "fail_step",
        handlerType: "invoke",
        error: new Error(`Failed to add shipping method`),
      },
    ])

    expect(transaction.getState()).toEqual("reverted")
  })

  // it("should compensate correctly if there if add shipping method fails (existing payment sessions case)", async () => {
  //   const manager = medusaContainer.resolve("manager")
  //   const cartService = medusaContainer.resolve("cartService")

  //   // the cart has 0 shipping methods and a payment session
  //   const cartBefore = await cartService.retrieve("test-cart-2", {
  //     relations: ["shipping_methods", "payment_sessions"],
  //   })

  //   const addShippingMethodWorkflow = addShippingMethod(medusaContainer)

  //   addShippingMethodWorkflow.appendAction(
  //     "fail_step",
  //     AddShippingMethodWorkflowActions.upsertPaymentSessions,
  //     {
  //       invoke: pipe({}, async function failStep() {
  //         throw new Error(`Failed to add shipping method`)
  //       }),
  //     },
  //     {
  //       noCompensation: true,
  //     }
  //   )

  //   const input = {
  //     cart_id: "test-cart-2",
  //     option_id: "test-option-new",
  //     data: {},
  //   }

  //   const { errors, transaction } = await addShippingMethodWorkflow.run({
  //     input,
  //     context: {
  //       manager,
  //     },
  //     throwOnError: false,
  //   })

  //   const cartAfter = await cartService.retrieve("test-cart-2", {
  //     relations: ["shipping_methods", "payment_sessions"],
  //   })

  //   expect(cartAfter.shipping_methods).toEqual([]) // added shipping method is reverted

  //   expect(cartAfter.payment_sessions).toEqual([
  //     expect.objectContaining({
  //       id: cartBefore.payment_sessions[0].id,
  //       cart_id: cartBefore.payment_sessions[0].cart_id,
  //       provider_id: cartBefore.payment_sessions[0].provider_id,
  //       is_initiated: cartBefore.payment_sessions[0].is_initiated,
  //       is_selected: cartBefore.payment_sessions[0].is_selected,
  //     }),
  //   ])

  //   expect(cartAfter.payment_session).toEqual(
  //     expect.objectContaining({
  //       id: cartBefore.payment_sessions[0].id,
  //       cart_id: cartBefore.payment_sessions[0].cart_id,
  //       provider_id: cartBefore.payment_sessions[0].provider_id,
  //     })
  //   )

  //   expect(errors).toEqual([
  //     {
  //       action: "fail_step",
  //       handlerType: "invoke",
  //       error: new Error(`Failed to add shipping method`),
  //     },
  //   ])

  //   expect(transaction.getState()).toEqual("reverted")
  // })
})
