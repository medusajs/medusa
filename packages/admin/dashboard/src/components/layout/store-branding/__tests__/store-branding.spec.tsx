// @vitest-environment jsdom
import { cleanup, render, waitFor } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { useStoreMock } = vi.hoisted(() => ({ useStoreMock: vi.fn() }))

vi.mock("../../../../hooks/api/store", () => ({
  useStore: () => useStoreMock(),
}))

vi.mock("react-router-dom", () => ({
  useMatches: () => [
    {
      id: "orders",
      pathname: "/orders",
      params: {},
      data: undefined,
      handle: { breadcrumb: () => "Orders" },
    },
  ],
}))

import { StoreBranding } from "../store-branding"

const renderBranding = () =>
  render(
    <HelmetProvider>
      <StoreBranding />
    </HelmetProvider>
  )

const favicon = () =>
  document.head.querySelector<HTMLLinkElement>("link[rel=icon]")

describe("StoreBranding", () => {
  beforeEach(() => {
    useStoreMock.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it("uses the store name in the title and the logo as the favicon", async () => {
    useStoreMock.mockReturnValue({
      store: { name: "ACME", logo_url: "https://example.com/logo.png" },
    })

    renderBranding()

    await waitFor(() => expect(document.title).toBe("Orders - ACME"))
    expect(favicon()?.getAttribute("href")).toBe("https://example.com/logo.png")
  })

  it("keeps the Medusa defaults while the store is not loaded", async () => {
    useStoreMock.mockReturnValue({ store: undefined })

    renderBranding()

    await waitFor(() => expect(document.title).toBe("Orders - Medusa"))
    expect(favicon()).toBeNull()
  })

  it("does not set a favicon when the store has no logo", async () => {
    useStoreMock.mockReturnValue({ store: { name: "ACME", logo_url: null } })

    renderBranding()

    await waitFor(() => expect(document.title).toBe("Orders - ACME"))
    expect(favicon()).toBeNull()
  })
})
