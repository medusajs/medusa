import { Order } from "@medusajs/medusa"
import { renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import ItemsToReturnForm from ".."
import { fixtures } from "../../../../../../test/fixtures"
import { renderWithProviders } from "../../../../../../test/utils/render-with-providers"
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

    renderWithProviders(
      <ItemsToReturnForm
        form={nestedForm(form, "return_items")}
        order={order}
      />
    )
  })

  it("should render correctly", async () => {
    const titles = order.returnable_items?.map((item) => item.title)

    // expect all titles in titles array to appear at least once in the document
    titles?.forEach((title) => {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0)
    })
  })

  it("should initially not display any items as marked for return", async () => {
    const checkboxes = screen.getAllByRole("checkbox")

    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked()
    })
  })

  it("should mark all item as to be returned when checkbox is checked", async () => {
    const checkboxes = screen.getAllByRole("checkbox")

    // Checkbox to select all items
    const checkbox = checkboxes[0]

    const user = userEvent.setup()

    await user.click(checkbox)

    expect(checkbox).toBeChecked()

    const { return_items } = form.getValues()

    // expect all items to be marked for return
    for (const item of return_items.items) {
      expect(item.return).toBeTruthy()
    }
  })

  it("should only mark the first item as to be returned", async () => {
    const checkboxes = screen.getAllByRole("checkbox")

    // Checkbox to select first item
    const checkbox = checkboxes[1]

    const user = userEvent.setup()

    await user.click(checkbox)

    expect(checkbox).toBeChecked()

    const { return_items } = form.getValues()

    // expect first item to be marked for return
    expect(return_items.items[0].return).toBeTruthy()

    // expect all other items to not be marked for return
    for (const item of return_items.items.slice(1)) {
      expect(item.return).toBeFalsy()
    }
  })

  it("should update quantity correctly", async () => {
    const checkboxes = screen.getAllByRole("checkbox")
    const checkbox = checkboxes[1]

    const user = userEvent.setup()

    await user.click(checkbox)

    expect(checkbox).toBeChecked()

    const decrement = screen.getByLabelText("Decrease quantity")

    await user.click(decrement)

    const { return_items } = form.getValues()

    expect(return_items.items[0].quantity).toEqual(1)

    const increment = screen.getByLabelText("Increase quantity")

    await user.click(increment)

    // should return to initial quantity
    expect(return_items.items[0].quantity).toEqual(2)
  })
})
