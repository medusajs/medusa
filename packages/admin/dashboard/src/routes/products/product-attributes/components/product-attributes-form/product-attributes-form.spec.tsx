// @vitest-environment jsdom
import React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { useForm } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { HttpTypes } from "@medusajs/types"

import { ProductAttributesForm } from "./product-attributes-form"

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  handleSuccess: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({
    children,
    isLoading: _isLoading,
    ...props
  }: React.ComponentProps<"button"> & { isLoading?: boolean }) => (
    <button {...props}>{children}</button>
  ),
  Input: (props: React.ComponentProps<"input">) => <input {...props} />,
  toast: {
    success: vi.fn(),
    error: mocks.toastError,
  },
}))

vi.mock("../../../../../components/common/form", () => ({
  Form: {
    Label: ({ children }: { children: React.ReactNode }) => (
      <label>{children}</label>
    ),
    Field: ({
      render,
    }: {
      render: (props: { field: object }) => React.ReactNode
    }) => <>{render({ field: {} })}</>,
    Item: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Control: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    ErrorMessage: () => null,
  },
}))

vi.mock("../../../../../components/inputs/country-select", () => ({
  CountrySelect: () => null,
}))

vi.mock("../../../../../components/modals", () => ({
  RouteDrawer: {
    Form: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Body: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Footer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Close: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  },
  useRouteModal: () => ({ handleSuccess: mocks.handleSuccess }),
}))

vi.mock("../../../../../components/utilities/keybound-form", () => ({
  KeyboundForm: ({
    children,
    onSubmit,
  }: {
    children: React.ReactNode
    onSubmit: React.FormEventHandler<HTMLFormElement>
  }) => <form onSubmit={onSubmit}>{children}</form>,
}))

vi.mock("../../../../../dashboard-app", () => ({
  FormExtensionZone: () => null,
  useExtendableForm: ({ defaultValues }: { defaultValues: object }) =>
    useForm({ defaultValues }),
}))

vi.mock("../../../../../providers/extension-provider", () => ({
  useExtension: () => ({
    getFormConfigs: () => [],
    getFormFields: () => [],
  }),
}))

vi.mock("../../../../../hooks/api/products", () => ({
  useUpdateProduct: () => ({
    mutateAsync: mocks.mutateAsync,
    isPending: false,
  }),
}))

const product = {
  id: "prod_1",
  weight: 100,
  length: null,
  width: null,
  height: null,
  mid_code: "",
  hs_code: "",
  origin_country: "",
} as unknown as HttpTypes.AdminProduct

describe("ProductAttributesForm", () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it("shows the error in a toast when updating the product attributes fails", async () => {
    mocks.mutateAsync.mockImplementation(
      async (_values: unknown, options?: { onError?: (e: Error) => void }) => {
        options?.onError?.(new Error("Failed to fetch"))
      }
    )

    render(<ProductAttributesForm product={product} />)

    fireEvent.click(screen.getByRole("button", { name: "actions.save" }))

    await waitFor(() => {
      expect(mocks.mutateAsync).toHaveBeenCalledTimes(1)
      expect(mocks.toastError).toHaveBeenCalledWith("Failed to fetch")
    })
    expect(mocks.handleSuccess).not.toHaveBeenCalled()
  })
})
