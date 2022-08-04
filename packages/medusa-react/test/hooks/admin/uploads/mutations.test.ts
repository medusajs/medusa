import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminDeleteFile,
  useAdminCreatePresignedDownloadUrl,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminDeleteFile hook", () => {
  test("Removes file with key and returns delete result", async () => {
    const file_key = "test"

    const { result, waitFor } = renderHook(() => useAdminDeleteFile(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ file_key })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({ id: file_key, object: "file", deleted: true })
    )
  })
})

describe("useAdminCreatePresignedDownloadUrl hook", () => {
  test("", async () => {
    const file_key = "test"

    const { result, waitFor } = renderHook(
      () => useAdminCreatePresignedDownloadUrl(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ file_key })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.download_url).toEqual(fixtures.get("upload").url)
  })
})
