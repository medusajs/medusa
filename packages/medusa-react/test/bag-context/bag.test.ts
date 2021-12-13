import { generateBagState } from "../../src/contexts/bag"
import { ProductVariant } from "@medusajs/medusa"
import { useBag } from "../../src"
import { act, renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../mocks/data"
import { createBagWrapper } from "../utils"

const initialBagState = {
  region: fixtures.get("region"),
  totalItems: 0,
  bagTotal: 0,
  items: [],
}

describe("useBag hook", () => {
  describe("sets a region", () => {
    test("success", async () => {
      const { result } = renderHook(() => useBag(), {
        wrapper: createBagWrapper(),
      })
      const { setRegion } = result.current

      act(() => {
        setRegion(fixtures.get("region"))
      })

      const { region, bagTotal, totalItems } = result.current

      expect(region).toEqual(fixtures.get("region"))
      expect(bagTotal).toEqual(0)
      expect(totalItems).toEqual(0)
    })
  })

  describe("item operations", () => {
    test("addItem", () => {
      const { result } = renderHook(() => useBag(), {
        wrapper: createBagWrapper(),
        initialProps: {
          initialState: initialBagState,
        },
      })
      const { addItem } = result.current
      const variant = fixtures.get("product_variant")

      act(() => {
        addItem({
          variant: variant as unknown as ProductVariant,
          quantity: 1,
        })
      })

      const { items, totalItems, bagTotal } = result.current

      expect(totalItems).toBe(1)
      expect(bagTotal).toBe(1000)
      expect(items).toEqual([
        {
          variant: expect.objectContaining(variant),
          quantity: 1,
          total: 1000,
        },
      ])
    })

    test("updateItem", () => {
      const variant = fixtures.get("product_variant")
      const { result } = renderHook(() => useBag(), {
        wrapper: createBagWrapper(),
        initialProps: {
          initialState: generateBagState(initialBagState, [
            {
              variant: variant as unknown as ProductVariant,
              quantity: 1,
            },
            {
              variant: {
                ...variant,
                id: "test-variant",
              } as unknown as ProductVariant,
              quantity: 1,
            },
          ]),
        },
      })

      const { updateItem } = result.current

      act(() => {
        updateItem(variant.id, {
          quantity: 4,
        })
      })

      const { items, totalItems, bagTotal } = result.current

      expect(totalItems).toBe(5)
      expect(bagTotal).toBe(5 * 1000)
      expect(items).toEqual([
        {
          variant: expect.objectContaining(variant),
          quantity: 4,
          total: 1000,
        },
        {
          variant: {
            ...variant,
            id: "test-variant",
          },
          quantity: 1,
          total: 1000,
        },
      ])
    })

    test("removeItem", () => {
      const variant = fixtures.get("product_variant")
      const { result } = renderHook(() => useBag(), {
        wrapper: createBagWrapper(),
        initialProps: {
          initialState: generateBagState(initialBagState, [
            {
              variant: variant as unknown as ProductVariant,
              quantity: 3,
            },
            {
              variant: {
                ...variant,
                id: "test-variant",
              } as unknown as ProductVariant,
              quantity: 1,
            },
          ]),
        },
      })

      const { removeItem } = result.current

      act(() => {
        removeItem(variant.id)
      })

      const { items, totalItems, bagTotal } = result.current

      expect(totalItems).toBe(1)
      expect(bagTotal).toBe(1000)
      expect(items).toEqual([
        {
          variant: {
            ...variant,
            id: "test-variant",
          },
          quantity: 1,
          total: 1000,
        },
      ])
    })

    test("incrementItemQuantity", () => {
      const variant = fixtures.get("product_variant")
      const { result } = renderHook(() => useBag(), {
        wrapper: createBagWrapper(),
        initialProps: {
          initialState: generateBagState(initialBagState, [
            {
              variant: variant as unknown as ProductVariant,
              quantity: 2,
            },
          ]),
        },
      })

      const { incrementItemQuantity } = result.current

      act(() => {
        incrementItemQuantity(variant.id)
      })

      const { items, totalItems, bagTotal } = result.current

      expect(totalItems).toBe(3)
      expect(bagTotal).toBe(3 * 1000)
      expect(items).toEqual([
        {
          variant,
          quantity: 3,
          total: 1000,
        },
      ])
    })

    test("decrementItemQuantity", () => {
      const variant = fixtures.get("product_variant")
      const { result } = renderHook(() => useBag(), {
        wrapper: createBagWrapper(),
        initialProps: {
          initialState: generateBagState(initialBagState, [
            {
              variant: variant as unknown as ProductVariant,
              quantity: 4,
            },
          ]),
        },
      })

      const { decrementItemQuantity } = result.current

      act(() => {
        decrementItemQuantity(variant.id)
      })

      const { items, totalItems, bagTotal } = result.current

      expect(totalItems).toBe(3)
      expect(bagTotal).toBe(3 * 1000)
      expect(items).toEqual([
        {
          variant,
          quantity: 3,
          total: 1000,
        },
      ])
    })

    test("setItems", () => {
      const variant = fixtures.get("product_variant")
      const { result } = renderHook(() => useBag(), {
        wrapper: createBagWrapper(),
        initialProps: {
          initialState: generateBagState(initialBagState, [
            {
              variant: variant as unknown as ProductVariant,
              quantity: 4,
            },
          ]),
        },
      })

      const { setItems } = result.current

      act(() => {
        setItems([
          {
            variant: {
              ...variant,
              id: "test-variant",
            } as unknown as ProductVariant,
            quantity: 1,
          },
        ])
      })

      const { items, totalItems, bagTotal } = result.current

      expect(totalItems).toBe(1)
      expect(bagTotal).toBe(1000)
      expect(items).toEqual([
        {
          variant: expect.objectContaining({
            id: "test-variant",
          }),
          quantity: 1,
          total: 1000,
        },
      ])
    })

    test("getItem", () => {
      const variant = fixtures.get("product_variant")
      const { result } = renderHook(() => useBag(), {
        wrapper: createBagWrapper(),
        initialProps: {
          initialState: generateBagState(initialBagState, [
            {
              variant: variant as unknown as ProductVariant,
              quantity: 1,
            },
          ]),
        },
      })

      const { getItem } = result.current
      let item
      act(() => {
        item = getItem(variant.id)
      })

      expect(item).toEqual({
        variant,
        quantity: 1,
        total: 1000,
      })
    })

    test("clearBag", () => {
      const variant = fixtures.get("product_variant")
      const { result } = renderHook(() => useBag(), {
        wrapper: createBagWrapper(),
        initialProps: {
          initialState: generateBagState(initialBagState, [
            {
              variant: variant as unknown as ProductVariant,
              quantity: 4,
            },
          ]),
        },
      })

      const { clearBag } = result.current

      act(() => {
        clearBag()
      })

      const { items, totalItems, bagTotal } = result.current

      expect(totalItems).toBe(0)
      expect(bagTotal).toBe(0)
      expect(items).toEqual([])
    })
  })
})
