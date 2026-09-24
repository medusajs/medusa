// @vitest-environment jsdom
import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { useForm, UseFormReturn } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { ProductCreateSchemaType } from "../../../../types"
import { ProductCreateInventoryKitSection } from "./product-create-inventory-kit-section"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/icons", () => ({
  XMarkMini: () => <svg />,
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
  Heading: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  IconButton: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
  Input: (props: React.ComponentProps<"input">) => <input {...props} />,
  Label: ({ children }: { children: React.ReactNode }) => (
    <label>{children}</label>
  ),
}))

vi.mock("../../../../../../../components/common/form", () => ({
  Form: {
    Label: ({ children }: { children: React.ReactNode }) => (
      <label>{children}</label>
    ),
    Hint: ({ children }: { children: React.ReactNode }) => (
      <span>{children}</span>
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

vi.mock("../../../../../../../components/inputs/combobox", () => ({
  Combobox: () => <div />,
}))

vi.mock("../../../../../../../hooks/use-combobox-data", () => ({
  useComboboxData: () => ({
    options: [],
    searchValue: "",
    onSearchValueChange: vi.fn(),
    fetchNextPage: vi.fn(),
  }),
}))

vi.mock("../../../../../../../lib/client", () => ({
  sdk: {
    admin: {
      inventoryItem: {
        list: vi.fn(),
      },
    },
  },
}))

describe("ProductCreateInventoryKitSection", () => {
  it("adds inventory to the original variant when earlier variants are filtered out", () => {
    let form: UseFormReturn<ProductCreateSchemaType>

    function TestComponent() {
      form = useForm<ProductCreateSchemaType>({
        defaultValues: {
          variants: [
            {
              title: "Regular variant",
              inventory_kit: false,
              inventory: [],
            },
            {
              title: "Inventory kit variant",
              inventory_kit: true,
              inventory: [],
            },
          ],
        },
      })

      return <ProductCreateInventoryKitSection form={form} />
    }

    render(<TestComponent />)

    fireEvent.click(screen.getByRole("button", { name: "actions.add" }))

    expect(form!.getValues("variants.0.inventory")).toEqual([])
    expect(form!.getValues("variants.1.inventory")).toEqual([
      {
        inventory_item_id: "",
        required_quantity: "",
      },
    ])
  })
})
