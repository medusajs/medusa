import {
  useAdminRegion,
  useAdminRegions,
  useAdminRegionFulfillmentOptions,
} from "../../../../src"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminRegions hook", () => {
  test("returns a list of regions", async () => {
    const regions = fixtures.list("region")
    const { result, waitFor } = renderHook(() => useAdminRegions(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.regions).toEqual(regions)
  })
})

describe("useAdminRegion hook", () => {
  test("returns a region", async () => {
    const region = fixtures.get("region")
    const { result, waitFor } = renderHook(() => useAdminRegion(region.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.region).toEqual(region)
  })
})

describe("useAdminRegionFulfillmentOptions hook", () => {
  test("returns a region's fulfillment options", async () => {
    const region = fixtures.get("region")
    const options = fixtures.get("fulfillment_option")
    const { result, waitFor } = renderHook(
      () => useAdminRegionFulfillmentOptions(region.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.fulfillment_options).toEqual(options)
  })
})
