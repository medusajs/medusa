// @vitest-environment jsdom
import { TooltipProvider } from "@medusajs/ui"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { PropsWithChildren } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { MetadataForm } from "./metadata-form"

afterEach(() => {
  cleanup()
})

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

/**
 * The icon bundle pulls in its own React copy, which React DOM then refuses to
 * render. Covers the icons used by the form and by the @medusajs/ui components
 * it renders.
 */
vi.mock("@medusajs/icons", () => {
  const icon = (name: string) => {
    const Icon = () => <svg data-testid={`icon-${name}`} />
    Icon.displayName = name

    return Icon
  }

  return {
    ArrowDownMini: icon("ArrowDownMini"),
    ArrowUpMini: icon("ArrowUpMini"),
    CheckMini: icon("CheckMini"),
    ChevronRightMini: icon("ChevronRightMini"),
    EllipseMiniSolid: icon("EllipseMiniSolid"),
    EllipsisVertical: icon("EllipsisVertical"),
    ExclamationCircleSolid: icon("ExclamationCircleSolid"),
    InformationCircleSolid: icon("InformationCircleSolid"),
    Spinner: icon("Spinner"),
    Trash: icon("Trash"),
  }
})

/**
 * RouteDrawer relies on a data router (useBlocker) and Radix' Drawer, neither of
 * which is available in isolation. The only behaviour the form depends on is
 * that RouteDrawer.Form provides the react-hook-form context.
 */
vi.mock("../../modals", async () => {
  const { FormProvider } = await import("react-hook-form")

  const Passthrough = ({ children }: PropsWithChildren) => <div>{children}</div>

  return {
    RouteDrawer: Object.assign(Passthrough, {
      Header: Passthrough,
      Title: Passthrough,
      Description: Passthrough,
      Body: Passthrough,
      Footer: Passthrough,
      Close: Passthrough,
      Form: ({ form, children }: PropsWithChildren<{ form: any }>) => (
        <FormProvider {...form}>{children}</FormProvider>
      ),
    }),
    useRouteModal: () => ({ handleSuccess: vi.fn() }),
  }
})

const ADD_ROW = "metadata.edit.actions.addRow"

const categoryImage = {
  id: "file_123",
  url: "https://example.com/category.jpg",
}

const renderForm = (metadata: Record<string, any> | null) => {
  const hook = vi.fn()

  render(
    <TooltipProvider>
      <MetadataForm
        metadata={metadata}
        hook={hook}
        isPending={false}
        isMutating={false}
      />
    </TooltipProvider>
  )

  return hook
}

const getKeyInputs = () =>
  screen.getAllByPlaceholderText("Key") as HTMLInputElement[]

const getValueInputs = () =>
  screen.getAllByPlaceholderText("Value") as HTMLInputElement[]

const addRow = () =>
  fireEvent.click(screen.getByRole("button", { name: ADD_ROW }))

describe("MetadataForm", () => {
  it("exposes an add row action when every existing row is non-primitive", () => {
    renderForm({ category_image: categoryImage })

    const keyInputs = getKeyInputs()

    // The only row is disabled, so its row actions are unavailable.
    expect(keyInputs).toHaveLength(1)
    expect(keyInputs[0].disabled).toBe(true)

    expect(screen.getByRole("button", { name: ADD_ROW })).toBeTruthy()
  })

  it("appends an editable row when the add row action is used", () => {
    renderForm({ category_image: categoryImage })

    addRow()

    const keyInputs = getKeyInputs()

    expect(keyInputs).toHaveLength(2)
    expect(keyInputs[1].disabled).toBe(false)
  })

  it("submits an added row while preserving non-primitive values", async () => {
    const hook = renderForm({ category_image: categoryImage })

    addRow()

    fireEvent.change(getKeyInputs()[1], { target: { value: "color" } })
    fireEvent.change(getValueInputs()[1], { target: { value: "blue" } })

    fireEvent.click(screen.getByRole("button", { name: "actions.save" }))

    await waitFor(() => {
      expect(hook).toHaveBeenCalledTimes(1)
    })

    expect(hook.mock.calls[0][0]).toEqual({
      metadata: {
        category_image: categoryImage,
        color: "blue",
      },
    })
  })

  it("keeps the add row action available for editable metadata", () => {
    renderForm({ color: "blue" })

    expect(getKeyInputs()).toHaveLength(1)

    addRow()

    expect(getKeyInputs()).toHaveLength(2)
  })
})
