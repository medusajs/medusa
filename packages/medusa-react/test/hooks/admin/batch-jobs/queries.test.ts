import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminBatchJob, useAdminBatchJobs } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminBatchJobs hook", () => {
  test("returns a list of batch job", async () => {
    const batchJobs = fixtures.list("batch_job")
    const { result, waitFor } = renderHook(() => useAdminBatchJobs(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response?.status).toEqual(200)
    expect(result.current.batch_jobs).toEqual(batchJobs)
  })
})

describe("useAdminBatchJob hook", () => {
  test("returns a batch job", async () => {
    const batchJob = fixtures.get("batch_job")
    const { result, waitFor } = renderHook(
      () => useAdminBatchJob(batchJob.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response?.status).toEqual(200)
    expect(result.current.batch_job).toEqual(batchJob)
  })
})
