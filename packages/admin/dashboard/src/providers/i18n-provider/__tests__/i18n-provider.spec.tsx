// @vitest-environment jsdom
import { render } from "@testing-library/react"
import { PropsWithChildren } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

const languageMock = vi.hoisted(() => ({ current: "en" }))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: { language: languageMock.current } }),
}))

vi.mock("@medusajs/ui", () => ({
  I18nProvider: ({ children }: PropsWithChildren) => <div>{children}</div>,
}))

import { I18nProvider } from "../i18n-provider"

describe("I18nProvider", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("lang")
    document.documentElement.removeAttribute("dir")
  })

  it("sets the lang attribute from the active language", () => {
    languageMock.current = "en"

    render(<I18nProvider />)

    expect(document.documentElement.getAttribute("lang")).toBe("en")
  })

  it("sets a region qualified lang attribute", () => {
    languageMock.current = "ptBR"

    render(<I18nProvider />)

    expect(document.documentElement.getAttribute("lang")).toBe("pt-BR")
  })

  it("falls back to the default language when the active one is unknown", () => {
    languageMock.current = "xx"

    render(<I18nProvider />)

    expect(document.documentElement.getAttribute("lang")).toBe("bs")
  })
})
