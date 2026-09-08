// @vitest-environment jsdom
import { toast } from "@medusajs/ui"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CreateRegionForm } from "./create-region-form"

// Radix primitives used by the form rely on ResizeObserver, which jsdom lacks.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverStub as any
}

const PROVIDER_ID = "pp_stripe_stripe"
const PROVIDER_ERROR = "Select at least one payment provider"

const createRegion = vi.fn()
const handleSuccess = vi.fn()

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/ui", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  const { forwardRef } = await import("react")

  /**
   * The currency field is a Radix select, which cannot be operated in jsdom.
   * It is replaced by a button that sets a valid currency, so that the tests
   * can isolate the validation of the payment providers field.
   */
  function Select({
    children,
    onValueChange,
  }: {
    children: React.ReactNode
    onValueChange: (value: string) => void
  }) {
    return (
      <div>
        <button type="button" onClick={() => onValueChange("usd")}>
          set-currency
        </button>
        {children}
      </div>
    )
  }

  const SelectTrigger = forwardRef<
    HTMLDivElement,
    { children?: React.ReactNode }
  >(function SelectTrigger({ children }, ref) {
    return <div ref={ref}>{children}</div>
  })

  function SelectValue() {
    return null
  }

  function SelectSlot({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>
  }

  Select.Trigger = SelectTrigger
  Select.Value = SelectValue
  Select.Content = SelectSlot
  Select.Item = SelectSlot

  return {
    ...actual,
    Select,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }
})

vi.mock("../../../../../components/modals", async () => {
  const { FormProvider } = await import("react-hook-form")

  function Passthrough({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>
  }

  function ModalForm({
    form,
    children,
  }: {
    form: any
    children: React.ReactNode
  }) {
    return <FormProvider {...form}>{children}</FormProvider>
  }

  // The countries modal is out of scope here, and its own save button would
  // collide with the one submitting the form.
  function Hidden() {
    return null
  }

  const RouteFocusModal = {
    Form: ModalForm,
    Header: Passthrough,
    Body: Passthrough,
    Footer: Passthrough,
    Close: Passthrough,
  }

  const StackedFocusModal: any = Passthrough
  StackedFocusModal.Trigger = Passthrough
  StackedFocusModal.Content = Hidden
  StackedFocusModal.Header = Passthrough
  StackedFocusModal.Body = Passthrough
  StackedFocusModal.Footer = Passthrough
  StackedFocusModal.Title = Passthrough
  StackedFocusModal.Close = Passthrough

  return {
    RouteFocusModal,
    StackedFocusModal,
    useRouteModal: () => ({ handleSuccess }),
    useStackedModal: () => ({
      setIsOpen: vi.fn(),
      getIsOpen: () => false,
    }),
  }
})

vi.mock("../../../../../components/table/data-table", () => ({
  _DataTable: function DataTable() {
    return null
  },
}))

vi.mock("../../../../../components/inputs/combobox", () => ({
  Combobox: function Combobox({
    onChange,
  }: {
    onChange: (value: string[]) => void
  }) {
    return (
      <button type="button" onClick={() => onChange([PROVIDER_ID])}>
        set-payment-provider
      </button>
    )
  },
}))

vi.mock("../../../../../hooks/api/regions", () => ({
  useCreateRegion: () => ({
    mutateAsync: createRegion,
    isPending: false,
  }),
}))

vi.mock("../../../../../hooks/use-combobox-data", () => ({
  useComboboxData: () => ({
    options: [{ label: "Stripe", value: PROVIDER_ID }],
    fetchNextPage: vi.fn(),
  }),
}))

vi.mock("../../../../../lib/client", () => ({
  sdk: {
    admin: {
      payment: {
        listPaymentProviders: vi.fn(),
      },
    },
  },
}))

const currencies = [
  { code: "usd", name: "US Dollar", symbol_native: "$", decimal_digits: 2 },
]

const renderForm = () =>
  render(
    <MemoryRouter>
      <CreateRegionForm currencies={currencies} />
    </MemoryRouter>
  )

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText("fields.name"), "Europe")
  await user.click(screen.getByRole("button", { name: "set-currency" }))
}

describe("CreateRegionForm", () => {
  beforeEach(() => {
    createRegion.mockImplementation(async (_payload, options) => {
      options?.onSuccess?.({ region: { id: "reg_1" } })
    })
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it("shows an error and does not submit when no payment provider is selected", async () => {
    const user = userEvent.setup()
    renderForm()

    await fillRequiredFields(user)
    await user.click(screen.getByRole("button", { name: "actions.save" }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(PROVIDER_ERROR)
    })

    expect(await screen.findByText(PROVIDER_ERROR)).toBeDefined()
    expect(createRegion).not.toHaveBeenCalled()
  })

  it("does not show the payment provider error when another field is invalid", async () => {
    const user = userEvent.setup()
    renderForm()

    // Name and currency are left empty, so the form is invalid for other reasons.
    await user.click(
      screen.getByRole("button", { name: "set-payment-provider" })
    )
    await user.click(screen.getByRole("button", { name: "actions.save" }))

    // The currency error proves the form was validated and rejected.
    expect(await screen.findByText("Select a currency")).toBeDefined()
    expect(createRegion).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
    expect(screen.queryByText(PROVIDER_ERROR)).toBeNull()
  })

  it("creates the region once a payment provider is selected", async () => {
    const user = userEvent.setup()
    renderForm()

    await fillRequiredFields(user)
    await user.click(
      screen.getByRole("button", { name: "set-payment-provider" })
    )
    await user.click(screen.getByRole("button", { name: "actions.save" }))

    await waitFor(() => {
      expect(createRegion).toHaveBeenCalledTimes(1)
    })

    expect(createRegion.mock.calls[0][0]).toEqual({
      name: "Europe",
      countries: [],
      currency_code: "usd",
      payment_providers: [PROVIDER_ID],
      automatic_taxes: true,
      is_tax_inclusive: false,
    })
    expect(toast.error).not.toHaveBeenCalled()
    expect(handleSuccess).toHaveBeenCalledWith("../reg_1")
  })
})
