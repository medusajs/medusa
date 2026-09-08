// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { languages } from "../../../i18n/languages"

const languageMock = vi.hoisted(() => ({ current: "en" }))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: { language: languageMock.current } }),
}))

import { I18nProvider } from "../i18n-provider"

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute("lang")
  document.documentElement.removeAttribute("dir")
})

describe("I18nProvider", () => {
  it("sets the lang attribute from the active language", () => {
    languageMock.current = "en"

    render(<I18nProvider />)

    expect(document.documentElement.getAttribute("lang")).toBe("en")
  })

  it("sets a region-qualified lang attribute", () => {
    languageMock.current = "ptBR"

    render(<I18nProvider />)

    expect(document.documentElement.getAttribute("lang")).toBe("pt-BR")
  })

  it("falls back to the first configured language when the active one is unknown", () => {
    languageMock.current = "xx"

    render(<I18nProvider />)

    expect(document.documentElement.getAttribute("lang")).toBe(
      languages[0].code
    )
  })
})
