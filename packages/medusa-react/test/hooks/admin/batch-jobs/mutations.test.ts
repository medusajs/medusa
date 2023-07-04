import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCancelBatchJob,
  useAdminConfirmBatchJob,
  useAdminCreateBatchJob,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminCreateBatchJob hook", () => {
  test("creates a batch job and returns it", async () => {
    const batch = {
      type: "product_export",
      dry_run: false,
      context: {},
    }

    const { result, waitFor } = renderHook(() => useAdminCreateBatchJob(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(batch)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data?.response.status).toEqual(200)
    expect(result.current.data?.batch_job).toEqual(
      expect.objectContaining({
        ...fixtures.get("batch_job"),
        ...batch,
      })
    )
  })
})

describe("useAdminCancelBatchJob hook", () => {
  test("cancels a batch job and returns it", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminCancelBatchJob(fixtures.get("batch_job").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data?.response.status).toEqual(200)
    expect(result.current.data?.batch_job).toEqual(
      expect.objectContaining({
        ...fixtures.get("batch_job"),
      })
    )
  })
})

describe("useAdminConfirmBatchJob hook", () => {
  test("confirms a batch job and returns it", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminConfirmBatchJob(fixtures.get("batch_job").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data?.response.status).toEqual(200)
    expect(result.current.data?.batch_job).toEqual(
      expect.objectContaining({
        ...fixtures.get("batch_job"),
      })
    )
  })
})
