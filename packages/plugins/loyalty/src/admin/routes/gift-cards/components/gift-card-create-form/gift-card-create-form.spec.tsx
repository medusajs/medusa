import React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { HttpTypes } from "@medusajs/framework/types"
import { GiftCardCreateForm } from "./gift-card-create-form"

const state = vi.hoisted(() => ({
  locale: "fr-FR",
  createGiftCard: vi.fn().mockResolvedValue({}),
}))

vi.mock("../../../../hooks/api/gift-cards", () => ({
  useCreateGiftCard: () => ({
    mutateAsync: state.createGiftCard,
    isPending: false,
  }),
}))

vi.mock("@medusajs/ui", async () => {
  const { default: CurrencyInput } = await import("react-currency-input-field")
  const Container = ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  )
  return {
    Button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
    // Keep the real locale parsing and editing behavior; omit decorative UI.
    CurrencyInput: ({ code, symbol, ...props }: any) => (
      <CurrencyInput
        {...props}
        aria-label="Value"
        intlConfig={{ locale: state.locale }}
      />
    ),
    DatePicker: React.forwardRef(() => null),
    Divider: () => null,
    Heading: Container,
    Text: Container,
    Textarea: React.forwardRef<
      HTMLTextAreaElement,
      React.TextareaHTMLAttributes<HTMLTextAreaElement>
    >((props, ref) => <textarea {...props} ref={ref} />),
    toast: { success: vi.fn(), error: vi.fn() },
  }
})

vi.mock("../../../../components/combobox", () => ({
  Combobox: () => null,
}))

vi.mock("../../../../components/form", async () => {
  const { Controller, useFormContext } = await import("react-hook-form")
  const Container = ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  )
  return {
    Form: {
      Field: Controller,
      Item: Container,
      Label: Container,
      Control: Container,
      ErrorMessage: () => {
        const {
          formState: { errors },
        } = useFormContext()
        return errors.value ? (
          <span role="alert">{String(errors.value.message)}</span>
        ) : null
      },
    },
  }
})

vi.mock("../../../../components/modals", async () => {
  const { FormProvider } = await import("react-hook-form")
  const Container = ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  )
  return {
    useRouteModal: () => ({ handleSuccess: vi.fn() }),
    RouteFocusModal: {
      Form: ({ form, children }: any) => (
        <FormProvider {...form}>{children}</FormProvider>
      ),
      Header: Container,
      Body: Container,
      Footer: Container,
      Close: Container,
    },
  }
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function renderForm(locale: string) {
  state.locale = locale
  render(
    <GiftCardCreateForm
      store={
        {
          supported_currencies: [{ currency_code: "eur" }],
        } as HttpTypes.AdminStore
      }
    />
  )
  return screen.getByLabelText("Value")
}

describe("GiftCardCreateForm", () => {
  it.each([
    ["fr-FR", "14,13", 14.13],
    ["pl-PL", "14,13", 14.13],
    ["de-DE", "1.234,56", 1234.56],
    ["en-US", "14.13", 14.13],
    ["fr-FR", "14,00", 14],
  ])(
    "submits %s input %s as a numeric amount",
    async (locale, value, expected) => {
      const input = renderForm(locale)
      fireEvent.change(input, { target: { value } })
      fireEvent.blur(input)
      fireEvent.click(screen.getByText("Create"))
      await waitFor(() =>
        expect(state.createGiftCard).toHaveBeenCalledWith(
          expect.objectContaining({ value: expected, currency_code: "eur" }),
          expect.any(Object)
        )
      )
    }
  )

  it.each(["", "0"])("rejects a cleared or zero amount (%s)", async (value) => {
    const input = renderForm("fr-FR")
    fireEvent.change(input, { target: { value: "14,13" } })
    fireEvent.change(input, { target: { value } })
    fireEvent.click(screen.getByText("Create"))
    await waitFor(() =>
      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0)
    )
    expect(state.createGiftCard).not.toHaveBeenCalled()
  })

  it("preserves the decimal separator while typing a fractional amount", async () => {
    const input = renderForm("fr-FR") as HTMLInputElement
    for (const value of ["1", "14", "14,", "14,1", "14,13"]) {
      fireEvent.change(input, { target: { value } })
      expect(input.value).toBe(value)
    }
    fireEvent.blur(input)
    fireEvent.click(screen.getByText("Create"))
    await waitFor(() =>
      expect(state.createGiftCard).toHaveBeenCalledWith(
        expect.objectContaining({ value: 14.13 }),
        expect.any(Object)
      )
    )
  })
})
