import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { useLocale } from "react-aria"
import { describe, expect, it } from "vitest"

import { Tabs } from "../tabs"
import { I18nProvider } from "./i18n-provider"

function LocaleProbe() {
  const { locale, direction } = useLocale()
  return <span data-testid="locale">{`${locale}:${direction}`}</span>
}

function TabsFixture({
  testId = "tabs",
  dir,
}: {
  testId?: string
  dir?: "ltr" | "rtl"
}) {
  return (
    <Tabs defaultValue="middle" data-testid={testId} dir={dir}>
      <Tabs.List aria-label="Sections">
        <Tabs.Trigger value="first">First</Tabs.Trigger>
        <Tabs.Trigger value="middle">Middle</Tabs.Trigger>
        <Tabs.Trigger value="last">Last</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="first">First panel</Tabs.Content>
      <Tabs.Content value="middle">Middle panel</Tabs.Content>
      <Tabs.Content value="last">Last panel</Tabs.Content>
    </Tabs>
  )
}

describe("I18nProvider", () => {
  it.each([
    ["en-US", "ltr", "ArrowRight"],
    ["ar-EG", "rtl", "ArrowLeft"],
    ["he-IL", "rtl", "ArrowLeft"],
    ["fa-IR", "rtl", "ArrowLeft"],
  ])(
    "uses %s direction for Radix keyboard navigation",
    async (locale, dir, key) => {
      const user = userEvent.setup()
      render(
        <I18nProvider locale={locale}>
          <LocaleProbe />
          <TabsFixture />
        </I18nProvider>
      )

      expect(screen.getByTestId("locale").textContent).toBe(`${locale}:${dir}`)
      expect(screen.getByTestId("tabs").getAttribute("dir")).toBe(dir)
      await user.click(screen.getByRole("tab", { name: "Middle" }))
      await user.keyboard(`{${key}}`)
      expect(document.activeElement).toBe(
        screen.getByRole("tab", { name: "Last" })
      )
      expect(
        screen.getByRole("tab", { name: "Last" }).getAttribute("data-state")
      ).toBe("active")
    }
  )

  it("uses the resolved React Aria direction when locale is omitted", () => {
    render(
      <I18nProvider>
        <LocaleProbe />
        <TabsFixture />
      </I18nProvider>
    )

    const resolvedDirection = screen
      .getByTestId("locale")
      .textContent?.split(":")
      .pop()
    expect(screen.getByTestId("tabs").getAttribute("dir")).toBe(
      resolvedDirection
    )
  })

  it.each([
    ["ar-EG", "rtl", "en-US", "ltr"],
    ["en-US", "ltr", "ar-EG", "rtl"],
  ])(
    "scopes nested locale providers: %s (%s), %s (%s)",
    (outerLocale, outerDir, innerLocale, innerDir) => {
      render(
        <I18nProvider locale={outerLocale}>
          <TabsFixture testId="outer" />
          <I18nProvider locale={innerLocale}>
            <TabsFixture testId="inner" />
          </I18nProvider>
        </I18nProvider>
      )

      expect(screen.getByTestId("outer").getAttribute("dir")).toBe(outerDir)
      expect(screen.getByTestId("inner").getAttribute("dir")).toBe(innerDir)
    }
  )

  it("updates direction without resetting child state when the locale changes", async () => {
    const user = userEvent.setup()
    const content = (
      <>
        <LocaleProbe />
        <TabsFixture />
      </>
    )
    const { rerender } = render(
      <I18nProvider locale="en-US">{content}</I18nProvider>
    )
    await user.click(screen.getByRole("tab", { name: "Last" }))

    for (const [locale, dir] of [
      ["ar-EG", "rtl"],
      ["en-US", "ltr"],
    ]) {
      rerender(<I18nProvider locale={locale}>{content}</I18nProvider>)
      expect(screen.getByTestId("locale").textContent).toBe(`${locale}:${dir}`)
      expect(screen.getByTestId("tabs").getAttribute("dir")).toBe(dir)
      expect(
        screen.getByRole("tab", { name: "Last" }).getAttribute("data-state")
      ).toBe("active")
    }
  })

  it.each<{
    locale: string
    dir: "ltr" | "rtl"
    key: string
  }>([
    { locale: "ar-EG", dir: "ltr", key: "ArrowRight" },
    { locale: "en-US", dir: "rtl", key: "ArrowLeft" },
  ])(
    "preserves an explicit $dir primitive override in $locale",
    async ({ locale, dir, key }) => {
      const user = userEvent.setup()
      render(
        <I18nProvider locale={locale}>
          <TabsFixture dir={dir} />
        </I18nProvider>
      )

      const tabs = screen.getByTestId("tabs")
      expect(tabs.getAttribute("dir")).toBe(dir)
      await user.click(within(tabs).getByRole("tab", { name: "Middle" }))
      await user.keyboard(`{${key}}`)
      expect(document.activeElement).toBe(
        within(tabs).getByRole("tab", { name: "Last" })
      )
    }
  )

  it("preserves children without adding a DOM wrapper", () => {
    const { container } = render(
      <I18nProvider locale="ar-EG">
        <button>Action</button>
      </I18nProvider>
    )

    expect(container.children).toHaveLength(1)
    expect(container.firstElementChild).toBe(screen.getByRole("button"))
  })
})
