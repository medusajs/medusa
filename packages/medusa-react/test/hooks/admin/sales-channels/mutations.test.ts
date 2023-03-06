import { renderHook } from "@testing-library/react-hooks/dom"

import { fixtures } from "../../../../mocks/data"
import {
  useAdminAddProductsToSalesChannel,
  useAdminCreateSalesChannel,
  useAdminDeleteProductsFromSalesChannel,
  useAdminDeleteSalesChannel,
  useAdminUpdateSalesChannel,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminCreateSalesChannel hook", () => {
  test("returns a sales channel", async () => {
    const salesChannel = {
      name: "sales channel 1 name",
      description: "sales channel 1 description",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateSalesChannel(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(salesChannel)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.sales_channel).toEqual(
      expect.objectContaining({
        ...fixtures.get("sales_channel"),
        ...salesChannel,
      })
    )
  })
})

describe("useAdminUpdateSalesChannel hook", () => {
  test("updates a sales channel", async () => {
    const salesChannel = {
      name: "medusa sales channel",
      description: "main sales channel for medusa",
      is_disabled: true,
    }

    const salesChannelId = fixtures.get("sales_channel").id

    const { result, waitFor } = renderHook(
      () => useAdminUpdateSalesChannel(salesChannelId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(salesChannel)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.sales_channel).toEqual({
      ...fixtures.get("sales_channel"),
      ...salesChannel,
    })
  })
})

describe("useAdminDeleteSalesChannel hook", () => {
  test("deletes a sales channel", async () => {
    const id = fixtures.get("sales_channel").id

    const { result, waitFor } = renderHook(
      () => useAdminDeleteSalesChannel(id),
      { wrapper: createWrapper() }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data).toEqual(
      expect.objectContaining({
        id,
        object: "sales-channel",
        deleted: true,
      })
    )
  })
})

describe("useAdminDeleteProductsFromSalesChannel hook", () => {
  test("remove products from a sales channel", async () => {
    const id = fixtures.get("sales_channel").id
    const productId = fixtures.get("product").id

    const { result, waitFor } = renderHook(
      () => useAdminDeleteProductsFromSalesChannel(id),
      { wrapper: createWrapper() }
    )

    result.current.mutate({ product_ids: [{ id: productId }] })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data).toEqual(
      expect.objectContaining({
        sales_channel: fixtures.get("sales_channel"),
      })
    )
  })
})

describe("useAdminAddProductsToSalesChannel hook", () => {
  test("add products to a sales channel", async () => {
    const id = fixtures.get("sales_channel").id
    const productId = fixtures.get("product").id

    const { result, waitFor } = renderHook(
      () => useAdminAddProductsToSalesChannel(id),
      { wrapper: createWrapper() }
    )

    result.current.mutate({ product_ids: [{ id: productId }] })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data).toEqual(
      expect.objectContaining({
        sales_channel: fixtures.get("sales_channel"),
      })
    )
  })
})
