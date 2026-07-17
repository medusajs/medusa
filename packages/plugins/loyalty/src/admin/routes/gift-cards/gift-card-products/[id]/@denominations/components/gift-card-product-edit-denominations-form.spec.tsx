/* @vitest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mutateAsync } = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
}))

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: vi.fn(),
}))

vi.mock("@medusajs/icons", () => ({
  XCircleSolid: () => null,
}))

vi.mock("@medusajs/ui", () => ({
  Alert: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, isLoading: _, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  Input: (props: any) => <input {...props} />,
  toast: { error: vi.fn(), success: vi.fn() },
}))

vi.mock("react-hook-form", () => ({
  useFieldArray: () => ({
    append: vi.fn(),
    fields: [{ id: "field_1" }],
    remove: vi.fn(),
  }),
  useForm: () => ({
    control: {},
    formState: { errors: {} },
    handleSubmit: (callback: any) => (event: any) => {
      event.preventDefault()
      return callback({
        denominations: [{ id: "variant_1", value: "100" }],
      })
    },
  }),
}))

vi.mock("../../../../../../components/form", () => ({
  Form: {
    Control: ({ children }: any) => children,
    ErrorMessage: () => null,
    Field: ({ render }: any) =>
      render({
        field: {
          name: "denominations.0.value",
          onChange: vi.fn(),
          value: "100",
        },
      }),
    Item: ({ children }: any) => <div>{children}</div>,
  },
}))

vi.mock("../../../../../../components/keybound-form", () => ({
  KeyboundForm: ({ children, ...props }: any) => (
    <form {...props}>{children}</form>
  ),
}))

vi.mock("../../../../../../components/modals", () => {
  const Container = ({ children }: any) => children

  return {
    RouteDrawer: {
      Body: Container,
      Close: Container,
      Footer: Container,
      Form: Container,
    },
    useRouteModal: () => ({ handleSuccess: vi.fn() }),
  }
})

vi.mock("../../../../../../hooks/api/products", () => ({
  useUpdateProduct: () => ({ isPending: false, mutateAsync }),
}))

import { GiftCardProductEditDenominationsForm } from "./gift-card-product-edit-denominations-form"

describe("GiftCardProductEditDenominationsForm", () => {
  beforeEach(() => {
    mutateAsync.mockReset()
  })

  it("updates variants without removed product-level options", async () => {
    render(
      <GiftCardProductEditDenominationsForm
        product={
          {
            id: "product_1",
            variants: [{ id: "variant_1", title: "100" }],
          } as any
        }
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Save" }))

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledOnce())
    expect(mutateAsync.mock.calls[0][0]).toEqual({
      variants: [
        {
          id: "variant_1",
          manage_inventory: false,
          options: { denomination: "100" },
          title: "100",
        },
      ],
    })
  })
})
