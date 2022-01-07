import * as React from "react"
import { renderHook } from "@testing-library/react-hooks"
import { QueryClient, useMutation } from "react-query"
import { MedusaProvider } from "../../src"
import { queryKeysFactory, useOptionsFactory } from "../../src/hooks/utils"

const mockQc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const createWrapper = () => {
  return ({ children }) => (
    <MedusaProvider queryClientProviderProps={{ client: mockQc }} baseUrl="">
      {children}
    </MedusaProvider>
  )
}

const dummyUpdateData = { dummy: { id: "dumdum_1", name: "mock data" } }

const dummyFn = async () => {
  return Promise.resolve(dummyUpdateData)
}

const dummyQueryKeys = queryKeysFactory("dummy" as const)

const useCreateDummyData = ({ invalidate, update, ...options }: any = {}) => {
  const newOptions = useOptionsFactory(
    options,
    {
      invalidationQueryKey: dummyQueryKeys.lists(),
      updateQueryKey: dummyQueryKeys.detail("dumdum_1"),
    },
    { invalidate, update }
  )

  return useMutation(() => dummyFn(), newOptions)
}

describe("useOptionsFactory", () => {
  let updateSpy
  let invalidationSpy

  beforeEach(() => {
    updateSpy = jest.spyOn(mockQc, "setQueryData")
    invalidationSpy = jest.spyOn(mockQc, "invalidateQueries")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("given an empty options object, should add invalidation and update side effects", async () => {
    const { result, waitFor } = renderHook(() => useCreateDummyData(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(null)

    await waitFor(() => result.current.isSuccess)

    expect(updateSpy).toHaveBeenCalledWith(
      dummyQueryKeys.detail("dumdum_1"),
      dummyUpdateData
    )
    expect(invalidationSpy).toHaveBeenCalledTimes(2)
    expect(invalidationSpy).toHaveBeenCalledWith(dummyQueryKeys.lists())
    expect(invalidationSpy).toHaveBeenCalledWith(
      dummyQueryKeys.detail("dumdum_1")
    )
  })

  it("given an options object without onSuccess, onMutate, or onSettled, should add invalidation and update side effects", async () => {
    const { result, waitFor } = renderHook(
      () => useCreateDummyData({ retry: 1 }),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(null)

    await waitFor(() => result.current.isSuccess)

    expect(updateSpy).toHaveBeenCalledWith(
      dummyQueryKeys.detail("dumdum_1"),
      dummyUpdateData
    )
    expect(invalidationSpy).toHaveBeenCalledTimes(2)
    expect(invalidationSpy).toHaveBeenCalledWith(dummyQueryKeys.lists())
    expect(invalidationSpy).toHaveBeenCalledWith(
      dummyQueryKeys.detail("dumdum_1")
    )
  })

  it("given an options object containing onSuccess, should not add any side effects", async () => {
    const { result, waitFor } = renderHook(
      () =>
        useCreateDummyData({
          onSuccess: () => {},
        }),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(null)

    await waitFor(() => result.current.isSuccess)

    expect(updateSpy).not.toHaveBeenCalled()
    expect(invalidationSpy).not.toHaveBeenCalled()
  })

  it("given an options object with update disabled, should not add update side effects", async () => {
    const { result, waitFor } = renderHook(
      () =>
        useCreateDummyData({
          update: false,
        }),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(null)

    await waitFor(() => result.current.isSuccess)

    expect(updateSpy).not.toHaveBeenCalled()
    expect(invalidationSpy).toHaveBeenCalledTimes(1)
    expect(invalidationSpy).toHaveBeenCalledWith(dummyQueryKeys.lists())
  })

  it("given an options object with update and invalidation disabled, should not add update nor invalidation side effects", async () => {
    const { result, waitFor } = renderHook(
      () =>
        useCreateDummyData({
          update: false,
          invalidate: false,
        }),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(null)

    await waitFor(() => result.current.isSuccess)

    expect(updateSpy).not.toHaveBeenCalled()
    expect(invalidationSpy).not.toHaveBeenCalled()
  })
})
