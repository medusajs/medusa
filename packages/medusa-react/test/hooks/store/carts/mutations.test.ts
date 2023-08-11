import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAddShippingMethodToCart,
  useCompleteCart,
  useCreateCart,
  useCreatePaymentSession,
  useDeletePaymentSession,
  useRefreshPaymentSession,
  useSetPaymentSession,
  useUpdateCart,
  useUpdatePaymentSession,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useCreateCart hook", () => {
  test("creates a cart", async () => {
    const { result, waitFor } = renderHook(() => useCreateCart(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({})

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart).toEqual(fixtures.get("cart"))
  })
})

describe("useUpdateCart hook", () => {
  test("updates a cart", async () => {
    const { result, waitFor } = renderHook(() => useUpdateCart("some-cart"), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      email: "new@email.com",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart).toEqual({
      ...fixtures.get("cart"),
      id: "some-cart",
      email: "new@email.com",
    })
  })
})

describe("useCompleteCart hook", () => {
  test("completes a cart", async () => {
    const { result, waitFor } = renderHook(() => useCompleteCart("test-cart"), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.type).toEqual("order")
    expect(result.current.data.data).toEqual(fixtures.get("order"))
  })
})

describe("useCreatePaymentSession hook", () => {
  test("creates a payment session", async () => {
    const { result, waitFor } = renderHook(
      () => useCreatePaymentSession("test-cart"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart).toEqual({
      ...fixtures.get("cart"),
      id: "test-cart",
    })
  })
})

describe("useUpdatePaymentSession hook", () => {
  test("updates a payment session", async () => {
    const { result, waitFor } = renderHook(
      () => useUpdatePaymentSession("test-cart"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      data: {},
      provider_id: "stripe",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart).toEqual({
      ...fixtures.get("cart"),
      id: "test-cart",
    })
  })
})

describe("useRefreshPaymentSession hook", () => {
  test("refreshes a payment session", async () => {
    const { result, waitFor } = renderHook(
      () => useRefreshPaymentSession("test-cart"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      provider_id: "stripe",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart).toEqual({
      ...fixtures.get("cart"),
      id: "test-cart",
    })
  })
})

describe("useSetPaymentSession hook", () => {
  test("sets a payment session", async () => {
    const { result, waitFor } = renderHook(
      () => useSetPaymentSession("test-cart"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      provider_id: "stripe",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart).toEqual({
      ...fixtures.get("cart"),
      id: "test-cart",
    })
  })
})

describe("useDeletePaymentSession hook", () => {
  test("deletes a payment session", async () => {
    const { result, waitFor } = renderHook(
      () => useDeletePaymentSession("test-cart"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      provider_id: "stripe",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart).toEqual({
      ...fixtures.get("cart"),
      id: "test-cart",
    })
  })
})

describe("useAddShippingMethodToCart hook", () => {
  test("adds a shipping method to a cart", async () => {
    const { result, waitFor } = renderHook(
      () => useAddShippingMethodToCart("test-cart"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      option_id: "test-option",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart).toEqual({
      ...fixtures.get("cart"),
      id: "test-cart",
    })
  })
})
