// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"
import { DataTableSearch } from "./data-table-search"

vi.mock("@medusajs/ui", () => ({
  Input: ({ size: _, ...props }: any) => <input {...props} />,
}))
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const Navigation = () => {
  const navigate = useNavigate()
  return (
    <>
      <output data-testid="location">{useLocation().search}</output>
      <button onClick={() => navigate("/?products_q=saved")}>Saved view</button>
      <button onClick={() => navigate("/")}>Clear view</button>
    </>
  )
}

const setup = () =>
  render(
    <MemoryRouter
      initialEntries={["/?products_q=old&products_offset=40&other_offset=20"]}
    >
      <DataTableSearch prefix="products" />
      <Navigation />
    </MemoryRouter>
  )

describe("table search input", () => {
  it("shows the active view's query, including when the query is cleared", () => {
    setup()
    const input = screen.getByRole("searchbox") as HTMLInputElement
    expect(input.value).toBe("old")
    fireEvent.click(screen.getByText("Saved view"))
    expect(input.value).toBe("saved")
    fireEvent.click(screen.getByText("Clear view"))
    expect(input.value).toBe("")
  })

  it("debounces typing and resets only the searched table's page", () => {
    vi.useFakeTimers()
    setup()
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "red, blue" },
    })
    act(() => vi.advanceTimersByTime(300))
    const params = new URLSearchParams(
      screen.getByTestId("location").textContent!
    )
    expect(params.get("products_q")).toBe("red, blue")
    expect(params.has("products_offset")).toBe(false)
    expect(params.get("other_offset")).toBe("20")
  })

  it("cancels pending input when navigating to a saved view", () => {
    vi.useFakeTimers()
    setup()
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "pending" },
    })
    fireEvent.click(screen.getByText("Saved view"))
    act(() => vi.advanceTimersByTime(300))
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe(
      "saved"
    )
    expect(screen.getByTestId("location").textContent).toBe("?products_q=saved")
  })
})
