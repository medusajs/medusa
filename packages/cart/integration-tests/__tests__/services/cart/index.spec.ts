import { SqlEntityManager } from "@mikro-orm/postgresql"
import { CartRepository } from "../../../../src/repositories"
import { CartService } from "../../../../src/services"
import { createCarts } from "../../../__fixtures__/cart"
import { MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Cart Service", () => {
  let service: CartService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()
    testManager = await MikroOrmWrapper.forkManager()

    const cartRepository = new CartRepository({
      manager: repositoryManager
    })

    service = new CartService({
      cartRepository: cartRepository,
    })

    await createCarts(testManager)
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
})
