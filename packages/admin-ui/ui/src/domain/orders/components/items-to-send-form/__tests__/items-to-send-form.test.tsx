import { Order } from "@medusajs/medusa"
import { renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import ItemsToSendForm from ".."
import { fixtures } from "../../../../../test/mocks/data"
import { renderWithProviders } from "../../../../../test/test-utils"
import { nestedForm } from "../../../../../utils/nested-form"
import { CreateClaimFormType } from "../../../details/claim/register-claim-menu"
import { getDefaultClaimValues } from "../../../details/utils/get-default-values"

const order = fixtures.get("order") as unknown as Order

describe("ItemsToSendForm with RegisterClaimMenu", () => {
  let form: UseFormReturn<CreateClaimFormType, any>

  beforeEach(() => {
    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: getDefaultClaimValues(order),
      })
    )

    form = result.current

    form.setValue("additional_items.items", [
      {
        in_stock: 100,
        original_price: 10000,
        price: 10000,
        product_title: "Test",
        quantity: 1,
        variant_id: "test",
        variant_title: "Test",
      },
    ])

    renderWithProviders(
      <ItemsToSendForm
        form={nestedForm(form, "additional_items")}
        order={order}
      />
    )
  })

  it("should render correctly", async () => {
    expect(screen.getByText("Items to send")).toBeInTheDocument()
    expect(screen.getByText("Add products")).toBeInTheDocument()
  })

  it("should display products to send correctly", async () => {
    expect(screen.getByText("Test")).toBeInTheDocument()
    expect(screen.getByText("€100.00")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("should update quantity correctly", async () => {
    const { additional_items } = form.getValues()

    const user = userEvent.setup()
    const increment = screen.getByLabelText("Increase quantity")

    await user.click(increment)

    expect(screen.getByText("2")).toBeInTheDocument()
    expect(additional_items.items[0].quantity).toEqual(2)

    await user.click(increment)

    expect(screen.getByText("3")).toBeInTheDocument()
    expect(additional_items.items[0].quantity).toEqual(3)

    const decrement = screen.getByLabelText("Decrease quantity")

    await user.click(decrement)

    expect(screen.getByText("2")).toBeInTheDocument()
    expect(additional_items.items[0].quantity).toEqual(2)
  })
})
