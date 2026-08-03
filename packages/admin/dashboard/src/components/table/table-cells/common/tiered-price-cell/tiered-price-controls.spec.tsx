// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, afterEach } from "vitest"
import { TieredPriceControls } from "./tiered-price-controls"

afterEach(() => {
  cleanup()
})

vi.mock("@medusajs/icons", () => ({
  ArrowsPointingOut: () => <svg data-testid="arrows-pointing-out" />,
  CircleSliders: () => <svg data-testid="circle-sliders" />,
}))

describe("TieredPriceCell", () => {
  const defaultProps = {
    isTiered: false,
    isAnchor: false,
    onOpenModal: vi.fn(),
    symbolWidth: 20,
  }

  it("should not render CircleSliders when isTiered is false", () => {
    render(<TieredPriceControls {...defaultProps} />)
    expect(screen.queryByTestId("circle-sliders")).toBeNull()
    expect(screen.getByRole("button")).toBeTruthy()
  })

  it("should render CircleSliders when isTiered is true and isAnchor is false", () => {
    render(<TieredPriceControls {...defaultProps} isTiered={true} />)
    expect(screen.getByTestId("circle-sliders")).toBeTruthy()
    expect(screen.getByRole("button")).toBeTruthy()
  })

  it("should not render CircleSliders when isTiered is true but isAnchor is true", () => {
    render(
      <TieredPriceControls {...defaultProps} isTiered={true} isAnchor={true} />
    )
    expect(screen.queryByTestId("circle-sliders")).toBeNull()
    expect(screen.getByRole("button")).toBeTruthy()
  })

  it("should call onOpenModal when the expansion button is clicked", () => {
    const onOpenModal = vi.fn()
    render(<TieredPriceControls {...defaultProps} onOpenModal={onOpenModal} />)
    const button = screen.getByRole("button")
    fireEvent.click(button)
    expect(onOpenModal).toHaveBeenCalledTimes(1)
  })

  it("should trigger onOpenModal when Cmd+B is pressed and isAnchor is true", () => {
    const onOpenModal = vi.fn()
    render(
      <TieredPriceControls
        {...defaultProps}
        onOpenModal={onOpenModal}
        isAnchor={true}
      />
    )
    fireEvent.keyDown(document, {
      key: "b",
      metaKey: true,
    })
    expect(onOpenModal).toHaveBeenCalledTimes(1)
  })

  it("should trigger onOpenModal when Ctrl+B is pressed and isAnchor is true", () => {
    const onOpenModal = vi.fn()
    render(
      <TieredPriceControls
        {...defaultProps}
        onOpenModal={onOpenModal}
        isAnchor={true}
      />
    )
    fireEvent.keyDown(document, {
      key: "b",
      ctrlKey: true,
    })
    expect(onOpenModal).toHaveBeenCalledTimes(1)
  })

  it("should not trigger onOpenModal when Cmd+B is pressed and isAnchor is false", () => {
    const onOpenModal = vi.fn()
    render(
      <TieredPriceControls
        {...defaultProps}
        onOpenModal={onOpenModal}
        isAnchor={false}
      />
    )
    fireEvent.keyDown(document, {
      key: "b",
      metaKey: true,
    })
    expect(onOpenModal).not.toHaveBeenCalled()
  })
})
