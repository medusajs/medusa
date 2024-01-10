import { ICartModuleService } from "@medusajs/types"
import { initialize } from "../../../../src/initialize"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Cart Module Service", () => {
  let service: ICartModuleService

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_CART_DB_SCHEMA,
      },
    })
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("create", () => {
    it("should throw an error when required params are not passed", async () => {
      const error = await service
        .create([
          {
            email: "test@email.com",
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for Cart.currency_code is required, 'undefined' found"
      )
    })

    it("should create a cart successfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [cart] = await service.list({ id: [createdCart.id] })

      expect(cart).toEqual(
        expect.objectContaining({
          id: createdCart.id,
          currency_code: "eur",
        })
      )
    })

    it("should create a cart with billing + shipping address successfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
          billing_address: {
            first_name: "John",
            last_name: "Doe",
          },
          shipping_address: {
            first_name: "John",
            last_name: "Doe",
          },
        },
      ])

      const [cart] = await service.list(
        { id: [createdCart.id] },
        { relations: ["billing_address", "shipping_address"] }
      )

      expect(cart).toEqual(
        expect.objectContaining({
          id: createdCart.id,
          currency_code: "eur",
          billing_address: expect.objectContaining({
            first_name: "John",
            last_name: "Doe",
          }),
          shipping_address: expect.objectContaining({
            first_name: "John",
            last_name: "Doe",
          }),
        })
      )
    })

    it("should create a cart with billing id + shipping id successfully", async () => {
      const [createdAddress] = await service.createAddresses([
        {
          first_name: "John",
          last_name: "Doe",
        },
      ])

      const [createdCart] = await service.create([
        {
          currency_code: "eur",
          billing_address_id: createdAddress.id,
          shipping_address_id: createdAddress.id,
        },
      ])

      expect(createdCart).toEqual(
        expect.objectContaining({
          id: createdCart.id,
          currency_code: "eur",
          billing_address: expect.objectContaining({
            id: createdAddress.id,
            first_name: "John",
            last_name: "Doe",
          }),
          shipping_address: expect.objectContaining({
            id: createdAddress.id,
            first_name: "John",
            last_name: "Doe",
          }),
        })
      )
    })
  })

  describe("update", () => {
    it("should throw an error if cart does not exist", async () => {
      const error = await service
        .update([
          {
            id: "none-existing",
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain('Cart with id "none-existing" not found')
    })

    it("should update a cart successfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [updatedCart] = await service.update([
        {
          id: createdCart.id,
          email: "test@email.com",
        },
      ])

      const [cart] = await service.list({ id: [createdCart.id] })

      expect(cart).toEqual(
        expect.objectContaining({
          id: createdCart.id,
          currency_code: "eur",
          email: updatedCart.email,
        })
      )
    })
  })

  describe("delete", () => {
    it("should delete a cart successfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      await service.delete([createdCart.id])

      const carts = await service.list({ id: [createdCart.id] })

      expect(carts.length).toEqual(0)
    })
  })

  describe("createAddresses", () => {
    it("should create an address successfully", async () => {
      const [createdAddress] = await service.createAddresses([
        {
          first_name: "John",
        },
      ])

      const [address] = await service.listAddresses({
        id: [createdAddress.id!],
      })

      expect(address).toEqual(
        expect.objectContaining({
          id: createdAddress.id,
          first_name: "John",
        })
      )
    })
  })

  describe("updateAddresses", () => {
    it("should update an address successfully", async () => {
      const [createdAddress] = await service.createAddresses([
        {
          first_name: "John",
        },
      ])

      const [updatedAddress] = await service.updateAddresses([
        { id: createdAddress.id!, first_name: "Jane" },
      ])

      expect(updatedAddress).toEqual(
        expect.objectContaining({
          id: createdAddress.id,
          first_name: "Jane",
        })
      )
    })
  })

  describe("deleteAddresses", () => {
    it("should delete an address successfully", async () => {
      const [createdAddress] = await service.createAddresses([
        {
          first_name: "John",
        },
      ])

      await service.deleteAddresses([createdAddress.id!])

      const [address] = await service.listAddresses({
        id: [createdAddress.id!],
      })

      expect(address).toBe(undefined)
    })
  })

  describe.only("addLineItems", () => {
    it("should add a line item to cart succesfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const items = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
          tax_lines: [],
        },
      ])

      const cart = await service.retrieve(createdCart.id, {
        relations: ["items"],
      })

      expect(items[0].id).toBe(cart.items![0].id)
    })

    it("should add multiple line items to cart succesfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const items = await service.addLineItems({
        cart_id: createdCart.id,
        items: [
          {
            quantity: 1,
            unit_price: 100,
            title: "test",
            tax_lines: [],
          },
        ],
      })

      const cart = await service.retrieve(createdCart.id, {
        relations: ["items"],
      })

      expect(items[0].id).toBe(cart.items![0].id)
    })

    it("should add multiple line items to multiple carts succesfully", async () => {
      let [eurCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      let [usdCart] = await service.create([
        {
          currency_code: "usd",
        },
      ])

      const items = await service.addLineItems([
        {
          cart_id: eurCart.id,
          items: [
            {
              quantity: 1,
              unit_price: 100,
              title: "test",
              tax_lines: [],
            },
          ],
        },
        {
          cart_id: usdCart.id,
          items: [
            {
              quantity: 1,
              unit_price: 100,
              title: "test",
              tax_lines: [],
            },
          ],
        },
      ])

      const carts = await service.list(
        { id: [eurCart.id, usdCart.id] },
        { relations: ["items"] }
      )

      eurCart = carts.find((c) => c.currency_code === "eur")!
      usdCart = carts.find((c) => c.currency_code === "usd")!

      const eurItems = items.filter((i) => i.cart_id === eurCart.id)
      const usdItems = items.filter((i) => i.cart_id === usdCart.id)

      expect(eurCart.items![0].id).toBe(eurItems[0].id)
      expect(usdCart.items![0].id).toBe(usdItems[0].id)
    })
  })
})
