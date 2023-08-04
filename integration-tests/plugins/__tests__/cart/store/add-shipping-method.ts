import path from "path"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { setPort, useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"


import { Cart, CustomShippingOption } from "@medusajs/medusa"
import { AxiosInstance } from "axios"
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

    const _cart = await manager.create(Cart, {
      id: "test-cart-with-cso",
      customer_id: "some-customer",
      email: "some-customer@email.com",
      shipping_address: {
        id: "test-shipping-address",
        first_name: "lebron",
        country_code: "us",
      },
      region_id: "test-region",
      currency_code: "usd",
      type: "swap",
    })

    await manager.save(_cart)

    await manager.insert(CustomShippingOption, {
      id: "another-cso-test",
      cart_id: "test-cart-with-cso",
      shipping_option_id: "test-option",
      price: 5,
    })
  })

  afterEach(async () => {
    await doAfterEach()
  })

  it("adds a normal shipping method to cart", async () => {
    const api = useApi()! as AxiosInstance

    const cartWithShippingMethod = await api.post(
      "/store/carts/test-cart/shipping-methods",
      {
        option_id: "test-option",
      },
      { withCredentials: true }
    )

    expect(cartWithShippingMethod.data.cart.shipping_methods).toContainEqual(
      expect.objectContaining({ shipping_option_id: "test-option" })
    )
    expect(cartWithShippingMethod.status).toEqual(200)
  })

//   it("given a cart with custom options and a shipping option already belonging to said cart, then it should add a shipping method based on the given custom shipping option", async () => {
//     const shippingOptionId = "test-option"

//     const api = useApi()! as AxiosInstance

//     const cartWithCustomShippingMethod = await api
//       .post(
//         "/store/carts/test-cart-with-cso/shipping-methods",
//         {
//           option_id: shippingOptionId,
//         },
//         { withCredentials: true }
//       )
//       .catch((err) => err.response)

//     expect(
//       cartWithCustomShippingMethod.data.cart.shipping_methods
//     ).toContainEqual(
//       expect.objectContaining({
//         shipping_option_id: shippingOptionId,
//         price: 5,
//       })
//     )
//     expect(cartWithCustomShippingMethod.status).toEqual(200)
//   })

//   it("given a cart with custom options and an option id not corresponding to any custom shipping option, then it should throw an invalid error", async () => {
//     const api = useApi()! as AxiosInstance

//     try {
//       await api.post(
//         "/store/carts/test-cart-with-cso/shipping-methods",
//         {
//           option_id: "orphan-so",
//         },
//         { withCredentials: true }
//       )
//     } catch (err) {
//       expect(err.response.status).toEqual(400)
//       expect(err.response.data.message).toEqual("Wrong shipping option")
//     }
//   })

//   it("adds no more than 1 shipping method per shipping profile", async () => {
//     const api = useApi()! as AxiosInstance
    
//     const addShippingMethod = async (option_id) => {
//       return await api.post(
//         "/store/carts/test-cart/shipping-methods",
//         {
//           option_id,
//         },
//         { withCredentials: true }
//       )
//     }

//     await addShippingMethod("test-option")
//     const cartWithAnotherShippingMethod = await addShippingMethod(
//       "test-option-2"
//     )

//     expect(
//       cartWithAnotherShippingMethod.data.cart.shipping_methods.length
//     ).toEqual(1)
//     expect(
//       cartWithAnotherShippingMethod.data.cart.shipping_methods
//     ).toContainEqual(
//       expect.objectContaining({
//         shipping_option_id: "test-option-2",
//         price: 500,
//       })
//     )
//     expect(cartWithAnotherShippingMethod.status).toEqual(200)
//   })
})