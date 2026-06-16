// @vitest-environment jsdom
import {
  render,
  screen,
  cleanup,
  renderHook,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React, { useState } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.hoisted(() => {
  const g = global as any
  g.__BACKEND_URL__ = "http://localhost:9000"
  g.__AUTH_TYPE__ = "session"
  g.__JWT_TOKEN_STORAGE_KEY__ = ""
})

import { Combobox } from "../combobox"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useComboboxData } from "../../../../hooks/use-combobox-data"
import { productTagsQueryKeys } from "../../../../hooks/api/tags"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/icons", () => ({
  CheckMini: () => <div data-testid="check-mini" />,
  EllipseMiniSolid: () => <div data-testid="ellipse-mini-solid" />,
  PlusMini: () => <div data-testid="plus-mini" />,
  TrianglesMini: () => <div data-testid="triangles-mini" />,
  XMarkMini: () => <div data-testid="x-mark-mini" />,
}))

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

afterEach(() => {
  cleanup()
})

describe("Combobox", () => {
  it("should allow typing in search input in controlled mode", async () => {
    const user = userEvent.setup()

    const ControlledCombobox = () => {
      const [searchValue, setSearchValue] = useState("")
      return (
        <Combobox
          placeholder="Search..."
          options={[
            { value: "1", label: "Apple" },
            { value: "2", label: "Banana" },
          ]}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
        />
      )
    }

    render(<ControlledCombobox />)

    const input = screen.getByPlaceholderText("Search...")
    await user.click(input)
    await user.type(input, "App")

    expect((input as HTMLInputElement).value).toBe("App")
  })

  it("should allow typing and local option filtering in uncontrolled mode", async () => {
    const user = userEvent.setup()

    render(
      <Combobox
        placeholder="Search..."
        options={[
          { value: "1", label: "Apple" },
          { value: "2", label: "Banana" },
        ]}
      />
    )

    const input = screen.getByPlaceholderText("Search...")
    await user.click(input)
    await user.type(input, "App")

    expect((input as HTMLInputElement).value).toBe("App")

    // Apple should be visible, Banana should not be visible
    expect(screen.queryByText("Apple")).not.toBeNull()
    expect(screen.queryByText("Banana")).toBeNull()
  })

  it("should clear search value upon value selection", async () => {
    const user = userEvent.setup()

    const SelectionWrapper = () => {
      const [value, setValue] = useState<string | undefined>("")
      const [searchValue, setSearchValue] = useState("")
      return (
        <Combobox
          placeholder="Search..."
          options={[
            { value: "1", label: "Apple" },
            { value: "2", label: "Banana" },
          ]}
          value={value}
          onChange={setValue}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
        />
      )
    }

    render(<SelectionWrapper />)

    const input = screen.getByPlaceholderText("Search...")
    await user.click(input)
    await user.type(input, "App")
    expect((input as HTMLInputElement).value).toBe("App")

    const option = screen.getByRole("option", { name: "Apple" })
    await user.click(option)

    // Selection should clear search input
    expect((input as HTMLInputElement).value).toBe("")
  })

  it("should invalidate combobox queries when lists query key is invalidated", async () => {
    const queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClientInstance}>
        {children}
      </QueryClientProvider>
    )

    const queryFnMock = vi.fn().mockResolvedValue({
      product_tags: [{ id: "tag-1", value: "Tag 1" }],
      offset: 0,
      limit: 10,
      count: 1,
    })

    const { result } = renderHook(
      () =>
        useComboboxData({
          queryKey: productTagsQueryKeys.lists(),
          queryFn: queryFnMock,
          getOptions: (data: any) =>
            data.product_tags.map((tag: any) => ({
              label: tag.value,
              value: tag.id,
            })),
        }),
      { wrapper }
    )

    // Wait for the query to load options
    await waitFor(() => {
      expect(result.current.options).toHaveLength(1)
    })
    expect(result.current.options[0].label).toBe("Tag 1")
    expect(queryFnMock).toHaveBeenCalledTimes(1)

    // Now, simulate a mutation by invalidating lists query key
    queryClientInstance.invalidateQueries({
      queryKey: productTagsQueryKeys.lists(),
    })

    // It should trigger a refetch because the infinite query key starts with productTagsQueryKeys.lists()
    await waitFor(() => {
      expect(queryFnMock).toHaveBeenCalledTimes(2)
    })
  })
})
