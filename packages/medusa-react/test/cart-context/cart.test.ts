import { useCart } from "../../src"
import { act, renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../mocks/data"
import { createCartWrapper } from "../utils"
import { Cart } from "../../src/types"

describe("useBag hook", () => {
  describe("sets a cart", () => {
    test("success", async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: createCartWrapper(),
      })
      const { setCart } = result.current

      act(() => {
        setCart((fixtures.get("cart") as unknown) as Cart)
      })

      const { cart, totalItems } = result.current

      expect(cart).toEqual(fixtures.get("cart"))
      expect(totalItems).toEqual(0)
    })
  })

  describe("createCart", () => {
    test("creates a cart", async () => {
      const { result, waitFor } = renderHook(() => useCart(), {
        wrapper: createCartWrapper(),
      })
      const { createCart } = result.current

      act(() => {
        createCart.mutate({})
      })

      await waitFor(() => result.current.createCart.isSuccess)

      const { cart, totalItems } = result.current

      expect(cart).toEqual(fixtures.get("cart"))
      expect(totalItems).toEqual(0)
    })
  })

  describe("startCheckout", () => {
    test("creates a payment session and updates the cart", async () => {
      const { result, waitFor } = renderHook(() => useCart(), {
        wrapper: createCartWrapper(),
        initialProps: {
          initialCartState: ({
            ...fixtures.get("cart"),
            id: "test-cart",
          } as unknown) as Cart,
        },
      })
      const { startCheckout } = result.current

      act(() => {
        startCheckout.mutate()
      })

      await waitFor(() => result.current.startCheckout.isSuccess)

      const { cart, totalItems } = result.current

      expect(cart).toEqual({
        ...fixtures.get("cart"),
        id: "test-cart",
      })
      expect(totalItems).toEqual(0)
    })
  })

  describe("updateCart", () => {
    test("updates the cart", async () => {
      const { result, waitFor } = renderHook(() => useCart(), {
        wrapper: createCartWrapper(),
        initialProps: {
          initialCartState: ({
            ...fixtures.get("cart"),
            id: "test-cart",
          } as unknown) as Cart,
        },
      })
      const { updateCart } = result.current

      act(() => {
        updateCart.mutate({
          email: "zak@test.com",
        })
      })

      await waitFor(() => result.current.updateCart.isSuccess)

      const { cart, totalItems } = result.current

      expect(cart).toEqual({
        ...fixtures.get("cart"),
        id: "test-cart",
        email: "zak@test.com",
      })
      expect(totalItems).toEqual(0)
    })
  })

  describe("addShippingMethod", () => {
    test("adds a shipping method and updates the cart", async () => {
      const { result, waitFor } = renderHook(() => useCart(), {
        wrapper: createCartWrapper(),
        initialProps: {
          initialCartState: ({
            ...fixtures.get("cart"),
            id: "test-cart",
          } as unknown) as Cart,
        },
      })
      const { addShippingMethod } = result.current

      act(() => {
        addShippingMethod.mutate({
          option_id: "test-option",
        })
      })

      await waitFor(() => result.current.addShippingMethod.isSuccess)

      const { cart, totalItems } = result.current

      expect(cart).toEqual({
        ...fixtures.get("cart"),
        id: "test-cart",
      })
      expect(totalItems).toEqual(0)
    })
  })

  describe("pay", () => {
    test("sets a payment session and updates the cart", async () => {
      const { result, waitFor } = renderHook(() => useCart(), {
        wrapper: createCartWrapper(),
        initialProps: {
          initialCartState: ({
            ...fixtures.get("cart"),
            id: "test-cart",
          } as unknown) as Cart,
        },
      })
      const { pay } = result.current

      act(() => {
        pay.mutate({
          provider_id: "test-provider",
        })
      })

      await waitFor(() => result.current.pay.isSuccess)

      const { cart, totalItems } = result.current

      expect(cart).toEqual({
        ...fixtures.get("cart"),
        id: "test-cart",
      })
      expect(totalItems).toEqual(0)
    })
  })

  describe("completeCheckout", () => {
    test("calls complete cart, does not update the cart, and returns an order", async () => {
      const { result, waitFor } = renderHook(() => useCart(), {
        wrapper: createCartWrapper(),
        initialProps: {
          initialCartState: (fixtures.get("cart") as unknown) as Cart,
        },
      })
      const { completeCheckout } = result.current

      act(() => {
        completeCheckout.mutate()
      })

      await waitFor(() => result.current.completeCheckout.isSuccess)

      const { cart, totalItems } = result.current

      expect(cart).toEqual(fixtures.get("cart"))
      expect(totalItems).toEqual(0)

      expect(result.current.completeCheckout.data.type).toEqual("order")
      expect(result.current.completeCheckout.data.data).toEqual(
        fixtures.get("order")
      )
    })
  })
})
