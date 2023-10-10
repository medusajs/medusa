import path from "path"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { setPort } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import {
  AddShippingMethodWorkflowActions,
  addShippingMethod,
  pipe,
} from "@medusajs/workflows"

import { ShippingOption, ShippingProfile } from "@medusajs/medusa"
import { ShippingProfileType } from "@medusajs/utils"
import cartSeeder from "../../../../helpers/cart-seeder"

jest.setTimeout(5000000)

describe("/store/carts", () => {
  let medusaProcess
  let dbConnection
  let express
  let medusaContainer

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd } as any)
    const { app, port, container } = await bootstrapApp({ cwd })
    medusaContainer = container

    setPort(port)
    express = app.listen(port, () => {
      process.send?.(port)
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  beforeEach(async () => {
    await cartSeeder(dbConnection)
    const manager = dbConnection.manager

    const defaultProfile = await manager.findOne(ShippingProfile, {
      where: { type: ShippingProfileType.DEFAULT },
    })

    await manager.insert(ShippingOption, {
      id: "test-option-new",
      name: "test-option-new",
      provider_id: "test-ful",
      region_id: "test-region",
      profile_id: defaultProfile.id,
      price_type: "flat_rate",
      amount: 2000,
      data: {},
    })
  })

  afterEach(async () => {
    await doAfterEach()
  })

  it("should add a shipping method to cart", async () => {
    const manager = medusaContainer.resolve("manager")

    const addShippingMethodWorkflow = addShippingMethod(medusaContainer)

    const input = {
      cart_id: "test-cart",
      option_id: "test-option",
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
  })

  it("should compensate correctly if add shipping method fails", async () => {
    const manager = medusaContainer.resolve("manager")
    const cartService = medusaContainer.resolve("cartService")

    // retrieve cart to test against
    const cartBefore = await cartService.retrieve("test-cart", {
      relations: ["shipping_methods"],
    })

    const addShippingMethodWorkflow = addShippingMethod(medusaContainer)

    addShippingMethodWorkflow.appendAction(
      "fail_step",
      AddShippingMethodWorkflowActions.upsertPaymentSessions,
      {
        invoke: pipe({}, async function failStep() {
          throw new Error(`Failed to add shipping method`)
        }),
      },
      {
        noCompensation: true,
      }
    )

    const input = {
      cart_id: "test-cart",
      option_id: "test-option-new",
      data: {},
    }

    const { errors, transaction } = await addShippingMethodWorkflow.run({
      input,
      context: {
        manager,
      },
      throwOnError: false,
    })

    const cartAfter = await cartService.retrieve("test-cart", {
      relations: ["shipping_methods", "payment_sessions"],
    })

    expect(cartAfter.shipping_methods[0]).toEqual(
      expect.objectContaining({
        id: cartBefore.shipping_methods[0].id,
        shipping_option_id: cartBefore.shipping_methods[0].shipping_option_id,
      })
    )

    expect(errors).toEqual([
      {
        action: "fail_step",
        handlerType: "invoke",
        error: new Error(`Failed to add shipping method`),
      },
    ])

    expect(transaction.getState()).toEqual("reverted")
  })

  it("should compensate correctly if there if add shipping method fails (existing payment sessions case)", async () => {
    const manager = medusaContainer.resolve("manager")
    const cartService = medusaContainer.resolve("cartService")

    // the cart has 0 shipping methods and a payment session
    const cartBefore = await cartService.retrieve("test-cart-2", {
      relations: ["shipping_methods", "payment_sessions"],
    })

    const addShippingMethodWorkflow = addShippingMethod(medusaContainer)

    addShippingMethodWorkflow.appendAction(
      "fail_step",
      AddShippingMethodWorkflowActions.upsertPaymentSessions,
      {
        invoke: pipe({}, async function failStep() {
          throw new Error(`Failed to add shipping method`)
        }),
      },
      {
        noCompensation: true,
      }
    )

    const input = {
      cart_id: "test-cart-2",
      option_id: "test-option-new",
      data: {},
    }

    const { errors, transaction } = await addShippingMethodWorkflow.run({
      input,
      context: {
        manager,
      },
      throwOnError: false,
    })

    const cartAfter = await cartService.retrieve("test-cart-2", {
      relations: ["shipping_methods", "payment_sessions"],
    })

    expect(cartAfter.shipping_methods).toEqual([]) // added shipping method is reverted

    expect(cartAfter.payment_sessions).toEqual([
      expect.objectContaining({
        id: "test-session",
        cart_id: "test-cart-2",
        provider_id: "test-pay",
      }),
    ])

    expect(cartAfter.payment_session).toEqual(
      expect.objectContaining({
        id: "test-session",
        cart_id: "test-cart-2",
        provider_id: "test-pay",
      })
    )

    expect(errors).toEqual([
      {
        action: "fail_step",
        handlerType: "invoke",
        error: new Error(`Failed to add shipping method`),
      },
    ])

    expect(transaction.getState()).toEqual("reverted")
  })
})
