// @vitest-environment jsdom
import React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, afterEach } from "vitest"
import { z } from "zod"
import { TieredPriceForm } from "./tiered-price-form"
import { CurrencyInfo } from "../../../lib/data/currencies"

afterEach(() => {
  cleanup()
})

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/icons", () => ({
  TriangleDownMini: () => <svg data-testid="triangle-down-mini" />,
  XMarkMini: () => <svg data-testid="x-mark-mini" />,
}))

let closeSpy: any
vi.mock("../../../components/modals", () => {
  const MockComponent = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
  return {
    StackedFocusModal: {
      Content: MockComponent,
      Header: MockComponent,
      Body: MockComponent,
      Footer: MockComponent,
      Title: MockComponent,
      Description: MockComponent,
      Close: ({ children }: { children: React.ReactNode }) => (
        <div onClick={() => closeSpy?.()}>{children}</div>
      ),
    },
  }
})

describe("TieredPriceForm", () => {
  const mockCurrency: CurrencyInfo = {
    code: "usd",
    name: "US Dollar",
    symbol_native: "$",
    decimal_digits: 2,
  }

  const schema = z.object({
    prices: z.array(
      z.object({
        amount: z.string().min(1, "Amount is required"),
        min: z.string().min(1, "Min is required"),
        max: z.string().optional(),
      })
    ),
  })

  const defaultProps = {
    schema,
    initialValues: [{ amount: "10", min: "1", max: "10" }],
    onSubmit: vi.fn(),
    onClose: vi.fn(),
    currency: mockCurrency,
    header: "Tiered Price Header",
    description: "Tiered Price Description",
    addPriceLabel: "Add Price",
    fieldConfig: {
      min: "min",
      max: "max",
      minLabel: "Min",
      maxLabel: "Max",
    },
    renderConditionItem: vi.fn(({ index }) => (
      <div data-testid={`condition-item-${index}`}>Condition Item {index}</div>
    )),
    renderConditionTrigger: vi.fn(({ index }) => (
      <div data-testid={`condition-trigger-${index}`}>
        Condition Trigger {index}
      </div>
    )),
  }

  it("should render with initial values", () => {
    render(<TieredPriceForm {...defaultProps} />)

    expect(screen.getByText("Tiered Price Header")).toBeTruthy()
    expect(screen.getByText("Tiered Price Description")).toBeTruthy()
    expect(screen.getByText("Add Price")).toBeTruthy()
    expect(screen.getByTestId("condition-trigger-0")).toBeTruthy()
    expect(screen.getByTestId("condition-item-0")).toBeTruthy()
  })

  it("should add a new price tier when add button is clicked", () => {
    render(<TieredPriceForm {...defaultProps} />)

    const addButton = screen.getByText("Add Price")
    fireEvent.click(addButton)

    expect(screen.getByTestId("condition-trigger-1")).toBeTruthy()
    expect(screen.getByTestId("condition-item-1")).toBeTruthy()
  })

  it("should remove a price tier when remove button is clicked", () => {
    render(<TieredPriceForm {...defaultProps} />)

    const removeButton = screen.getByTestId("x-mark-mini").closest("button")
    if (!removeButton) {
      throw new Error("Remove button not found")
    }

    fireEvent.click(removeButton)

    expect(screen.queryByTestId("condition-trigger-0")).toBeNull()
  })

  it("should call onSubmit with valid data", async () => {
    const onSubmit = vi.fn()
    render(<TieredPriceForm {...defaultProps} onSubmit={onSubmit} />)

    const saveButton = screen.getByText("actions.save")
    fireEvent.click(saveButton)

    // Since handleSubmit is async and uses react-hook-form, we might need to wait
    // But in this case, initialValues are already valid according to the schema
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        prices: [{ amount: "10", min: "1", max: "10" }],
      })
    })
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it("should handle validation errors on submit", async () => {
    const onSubmit = vi.fn()
    // Initial values that are invalid (amount is empty)
    const initialValues = [{ amount: "", min: "1", max: "10" }]

    render(
      <TieredPriceForm
        {...defaultProps}
        onSubmit={onSubmit}
        initialValues={initialValues}
      />
    )

    const saveButton = screen.getByText("actions.save")
    fireEvent.click(saveButton)

    await vi.waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it("should trigger submit on Ctrl+Enter / Cmd+Enter", async () => {
    const onSubmit = vi.fn()
    render(<TieredPriceForm {...defaultProps} onSubmit={onSubmit} />)

    const form = document.querySelector("form")
    if (!form) {
      throw new Error("Form not found")
    }

    fireEvent.keyDown(form, {
      key: "Enter",
      ctrlKey: true,
    })

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })

  it("should call onClose when cancel is clicked", () => {
    closeSpy = vi.fn()
    render(<TieredPriceForm {...defaultProps} />)

    const cancelButton = screen.getByText("actions.cancel")
    fireEvent.click(cancelButton)

    expect(closeSpy).toHaveBeenCalled()
  })
})
