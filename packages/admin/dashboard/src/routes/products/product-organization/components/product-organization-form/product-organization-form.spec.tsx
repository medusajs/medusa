// @vitest-environment jsdom
import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { HttpTypes } from "@medusajs/types"

import { ProductOrganizationForm } from "./product-organization-form"

const fetchNextPageMocks = vi.hoisted(() => ({
  collections: vi.fn(),
  product_types: vi.fn(),
  product_tags: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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

vi.mock("../../../../../components/inputs/combobox", () => ({
  Combobox: ({
    options,
    fetchNextPage,
  }: {
    options: { label: string; value: string }[]
    fetchNextPage?: () => void
  }) => (
    <button type="button" onClick={() => fetchNextPage?.()}>
      {options[0]?.label}
    </button>
  ),
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
  useRouteModal: () => ({ handleSuccess: vi.fn() }),
}))

vi.mock("../../../../../components/utilities/keybound-form", () => ({
  KeyboundForm: ({ children }: { children: React.ReactNode }) => (
    <form>{children}</form>
  ),
}))

vi.mock("../../../../../dashboard-app", () => ({
  FormExtensionZone: () => null,
  useExtendableForm: ({ defaultValues }: { defaultValues: object }) =>
    useForm({ defaultValues }),
}))

vi.mock("../../../../../hooks/api/products", () => ({
  useUpdateProduct: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock("../../../../../hooks/api/collections", () => ({
  collectionsQueryKeys: { lists: () => ["collections"] },
}))

vi.mock("../../../../../hooks/api/product-types", () => ({
  productTypesQueryKeys: { lists: () => ["product_types"] },
}))

vi.mock("../../../../../hooks/api/tags", () => ({
  productTagsQueryKeys: { lists: () => ["product_tags"] },
}))

vi.mock("../../../../../hooks/use-combobox-data", () => ({
  useComboboxData: ({ queryKey }: { queryKey: string[] }) => {
    const key = queryKey[0] as keyof typeof fetchNextPageMocks

    return {
      options: [{ label: `${key}-option`, value: `${key}-option` }],
      searchValue: "",
      onSearchValueChange: vi.fn(),
      fetchNextPage: fetchNextPageMocks[key],
    }
  },
}))

vi.mock("../../../../../lib/client", () => ({
  sdk: {
    admin: {
      productCollection: { list: vi.fn() },
      productType: { list: vi.fn() },
      productTag: { list: vi.fn() },
    },
  },
}))

vi.mock("../../../../../providers/extension-provider", () => ({
  useExtension: () => ({
    getFormConfigs: () => [],
    getFormFields: () => [],
  }),
}))

vi.mock("../../../common/components/category-combobox", () => ({
  CategoryCombobox: () => <div />,
}))

const product = {
  id: "prod_1",
  type_id: null,
  collection_id: null,
  categories: [],
  tags: [],
} as unknown as HttpTypes.AdminProduct

describe("ProductOrganizationForm", () => {
  afterEach(() => {
    cleanup()
  })

  it.each([
    ["product_types-option", "product_types"],
    ["collections-option", "collections"],
    ["product_tags-option", "product_tags"],
  ] as const)(
    "fetches the next page when the %s combobox list reaches the end",
    (optionLabel, key) => {
      render(<ProductOrganizationForm product={product} />)

      fireEvent.click(screen.getByRole("button", { name: optionLabel }))

      expect(fetchNextPageMocks[key]).toHaveBeenCalledTimes(1)
    }
  )
})
