// @vitest-environment jsdom
import React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ProductMediaSection } from "../product-detail/components/product-media-section/product-media-section"
import { VariantMediaSection } from "../../product-variants/product-variant-detail/components/variant-media-section/variant-media-section"

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  prompt: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      return options?.count === undefined ? key : `${key} (${options.count})`
    },
  }),
}))

vi.mock("../../../hooks/api/products", () => ({
  useUpdateProduct: () => ({ mutateAsync: mocks.mutateAsync }),
}))

vi.mock("../../../components/common/action-menu", () => ({
  ActionMenu: () => <button type="button" aria-label="Actions" />,
}))

vi.mock("@medusajs/ui", () => {
  const Box = ({ children }: React.PropsWithChildren) => <div>{children}</div>
  const CommandBar = Object.assign(
    ({ open, children }: React.PropsWithChildren<{ open: boolean }>) => {
      return open ? <div data-testid="commands">{children}</div> : null
    },
    {
      Bar: Box,
      Value: Box,
      Seperator: () => null,
      Command: ({ action, label }: { action: () => void; label: string }) => (
        <button type="button" onClick={action}>
          {label}
        </button>
      ),
    }
  )

  return {
    Container: Box,
    Heading: Box,
    Text: Box,
    Tooltip: Box,
    CommandBar,
    clx: (...values: unknown[]) =>
      values.filter((v) => typeof v === "string").join(" "),
    usePrompt: () => mocks.prompt,
    Checkbox: ({
      checked,
      onCheckedChange,
    }: {
      checked: boolean
      onCheckedChange: (value: boolean) => void
    }) => (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
      />
    ),
    Button: ({
      children,
      asChild,
      ...props
    }: React.PropsWithChildren<
      React.ButtonHTMLAttributes<HTMLButtonElement> & {
        asChild?: boolean
        variant?: string
        size?: string
      }
    >) => {
      const domProps = { ...props }
      delete domProps.variant
      delete domProps.size
      return asChild && React.isValidElement(children) ? (
        React.cloneElement(children as React.ReactElement, domProps)
      ) : (
        <button {...domProps}>{children}</button>
      )
    },
  }
})

type Product = React.ComponentProps<typeof ProductMediaSection>["product"]
type Variant = React.ComponentProps<typeof VariantMediaSection>["variant"]

function product(count: number, id = "prod_a"): Product {
  const images = Array.from({ length: count }, (_, index) => ({
    id: `${id}_img_${index}`,
    url: `https://example.com/${id}/${index}.png`,
  }))
  return {
    id,
    title: "Example product",
    images,
    thumbnail: images[0]?.url ?? null,
  } as Product
}

function variant(count: number, id = "variant_a"): Variant {
  const images = Array.from({ length: count }, (_, index) => ({
    id: `${id}_img_${index}`,
    url: `https://example.com/${id}/${index}.png`,
    variants: [{ id }],
  }))
  return { id, images, thumbnail: images[0]?.url ?? null } as Variant
}

const showAll = () =>
  screen.getByRole("button", { name: /products.media.showAllImages/ })
const showFewer = () =>
  screen.getByRole("button", { name: "products.media.showFewerImages" })
const images = () => screen.queryAllByRole("img") as HTMLImageElement[]

function Location() {
  const location = useLocation()
  return (
    <output data-testid="location">{JSON.stringify(location.state)}</output>
  )
}

function renderSection(section: React.ReactNode) {
  return render(
    <MemoryRouter>
      {section}
      <Location />
    </MemoryRouter>
  )
}

describe("detail media previews", () => {
  beforeEach(() => {
    mocks.prompt.mockReset().mockResolvedValue(true)
    mocks.mutateAsync.mockReset().mockImplementation(async (_data, options) => {
      options?.onSuccess?.()
    })
  })
  afterEach(cleanup)

  it.each([0, 1, 12])(
    "shows all %s product images without a disclosure",
    (count) => {
      renderSection(<ProductMediaSection product={product(count)} />)
      expect(images()).toHaveLength(count)
      expect(
        screen.queryByRole("button", { name: /products.media.showAllImages/ })
      ).toBeNull()
    }
  )

  it.each([0, 1, 12])(
    "shows all %s variant images without a disclosure",
    (count) => {
      renderSection(<VariantMediaSection variant={variant(count)} />)
      expect(images()).toHaveLength(count)
      expect(
        screen.queryByRole("button", { name: /products.media.showAllImages/ })
      ).toBeNull()
    }
  )

  it.each([13, 52])(
    "expands and collapses a %s-image product gallery",
    (count) => {
      const data = product(count)
      renderSection(<ProductMediaSection product={data} />)
      expect(images()).toHaveLength(12)
      const toggle = showAll()
      expect(toggle.textContent).toContain(String(count))
      expect(toggle.getAttribute("aria-expanded")).toBe("false")
      expect(
        document
          .getElementById(toggle.getAttribute("aria-controls")!)
          ?.contains(images()[0])
      ).toBe(true)
      toggle.focus()
      fireEvent.click(toggle)
      expect(images().map((image) => image.src)).toEqual(
        data.images!.map((image) => image.url)
      )
      expect(showFewer()).toBe(toggle)
      expect(document.activeElement).toBe(toggle)
      expect(toggle.getAttribute("aria-expanded")).toBe("true")
      fireEvent.click(toggle)
      expect(images()).toHaveLength(12)
      expect(mocks.mutateAsync).not.toHaveBeenCalled()
    }
  )

  it("filters variant-scoped images before limiting and counting them", () => {
    const data = variant(13)
    const foreign = variant(20, "other").images!
    data.images = [...foreign, ...data.images!]
    renderSection(<VariantMediaSection variant={data} />)
    expect(images()).toHaveLength(12)
    expect(images().every((image) => image.src.includes("variant_a"))).toBe(
      true
    )
    expect(showAll().textContent).toContain("13")
    fireEvent.click(showAll())
    expect(images()).toHaveLength(13)
    fireEvent.click(showFewer())
    expect(images()).toHaveLength(12)
  })

  it("counts and preserves a product thumbnail outside its image list", () => {
    const data = product(12)
    data.thumbnail = "https://example.com/separate-thumbnail.png"
    renderSection(<ProductMediaSection product={data} />)
    expect(images()).toHaveLength(12)
    expect(images()[0].src).toBe(data.thumbnail)
    expect(showAll().textContent).toContain("13")
    fireEvent.click(showAll())
    expect(images()).toHaveLength(13)
  })

  it("opens expanded product media at its original gallery index", () => {
    renderSection(<ProductMediaSection product={product(52)} />)
    fireEvent.click(showAll())
    fireEvent.click(images()[51].closest("a")!)
    expect(JSON.parse(screen.getByTestId("location").textContent!)).toEqual({
      curr: 51,
    })
  })

  it("retains hidden product selection and deletes only the selected images", async () => {
    const data = product(52)
    renderSection(<ProductMediaSection product={data} />)
    fireEvent.click(screen.getAllByRole("checkbox")[0])
    fireEvent.click(showAll())
    fireEvent.click(screen.getAllByRole("checkbox")[20])
    fireEvent.click(showFewer())
    expect(screen.getByTestId("commands").textContent).toContain(
      "general.countSelected (2)"
    )
    fireEvent.click(showAll())
    expect(
      screen.getAllByRole("checkbox")[20].getAttribute("aria-checked")
    ).toBe("true")
    fireEvent.click(showFewer())
    fireEvent.click(screen.getByRole("button", { name: "actions.delete" }))
    await waitFor(() => expect(mocks.mutateAsync).toHaveBeenCalledTimes(1))
    const payload = mocks.mutateAsync.mock.calls[0][0]
    expect(payload.images).toHaveLength(50)
    expect(
      payload.images.map((image: { id: string }) => image.id)
    ).not.toContain(data.images![0].id)
    expect(
      payload.images.map((image: { id: string }) => image.id)
    ).not.toContain(data.images![20].id)
    expect(payload.images).toContainEqual({
      id: data.images![51].id,
      url: data.images![51].url,
    })
    expect(screen.queryByTestId("commands")).toBeNull()
  })

  it("resets expansion and selection on product A to B to A, while preserving same-ID updates", () => {
    const a = product(52)
    const view = renderSection(<ProductMediaSection product={a} />)
    fireEvent.click(showAll())
    fireEvent.click(screen.getAllByRole("checkbox")[20])
    view.rerender(
      <MemoryRouter>
        <ProductMediaSection product={{ ...a, title: "Updated title" }} />
      </MemoryRouter>
    )
    expect(images()).toHaveLength(52)
    expect(screen.getByTestId("commands")).not.toBeNull()
    view.rerender(
      <MemoryRouter>
        <ProductMediaSection product={product(52, "prod_b")} />
      </MemoryRouter>
    )
    expect(images()).toHaveLength(12)
    expect(screen.queryByTestId("commands")).toBeNull()
    view.rerender(
      <MemoryRouter>
        <ProductMediaSection product={a} />
      </MemoryRouter>
    )
    expect(images()).toHaveLength(12)
    expect(screen.queryByTestId("commands")).toBeNull()
  })

  it("resets expansion on variant A to B to A, while preserving same-ID updates", () => {
    const a = variant(52)
    const view = renderSection(<VariantMediaSection variant={a} />)
    fireEvent.click(showAll())
    view.rerender(
      <MemoryRouter>
        <VariantMediaSection variant={{ ...a }} />
      </MemoryRouter>
    )
    expect(images()).toHaveLength(52)
    view.rerender(
      <MemoryRouter>
        <VariantMediaSection variant={variant(52, "variant_b")} />
      </MemoryRouter>
    )
    expect(images()).toHaveLength(12)
    view.rerender(
      <MemoryRouter>
        <VariantMediaSection variant={a} />
      </MemoryRouter>
    )
    expect(images()).toHaveLength(12)
  })

  it("uses independent disclosure IDs for multiple sections", () => {
    renderSection(
      <>
        <ProductMediaSection product={product(13)} />
        <VariantMediaSection variant={variant(13)} />
      </>
    )
    const toggles = screen.getAllByRole("button", {
      name: /products.media.showAllImages/,
    })
    expect(toggles).toHaveLength(2)
    expect(toggles[0].getAttribute("aria-controls")).not.toBe(
      toggles[1].getAttribute("aria-controls")
    )
    fireEvent.click(toggles[0])
    expect(images()).toHaveLength(25)
    expect(toggles[1].getAttribute("aria-expanded")).toBe("false")
  })

  it("never submits a surrounding form when changing the preview", () => {
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault())
    renderSection(
      <form onSubmit={submit}>
        <ProductMediaSection product={product(13)} />
      </form>
    )
    fireEvent.click(showAll())
    fireEvent.click(showFewer())
    expect(submit).not.toHaveBeenCalled()
    expect(mocks.mutateAsync).not.toHaveBeenCalled()
  })
})
