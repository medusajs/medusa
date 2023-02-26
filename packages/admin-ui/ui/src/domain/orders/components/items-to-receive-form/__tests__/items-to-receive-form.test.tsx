import { Order, Return } from "@medusajs/medusa"
import { renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import { fixtures } from "../../../../../test/mocks/data"
import { renderWithProviders } from "../../../../../test/test-utils"
import { nestedForm } from "../../../../../utils/nested-form"
import { ReceiveReturnFormType } from "../../../details/receive-return"
import { getDefaultReceiveReturnValues } from "../../../details/utils/get-default-values"
import { ItemsToReceiveForm } from "../items-to-receive-form"

describe("ItemsToReceiveForm with ReceiveReturnMenu", () => {
  let form: UseFormReturn<ReceiveReturnFormType, any>

  beforeEach(() => {
    const order = fixtures.get("order") as unknown as Order
    const return_ = fixtures.get("return") as unknown as Return

    const { result } = renderHook(() =>
      useForm<ReceiveReturnFormType>({
        defaultValues: getDefaultReceiveReturnValues(order, return_),
      })
    )

    form = result.current

    renderWithProviders(
      <ItemsToReceiveForm
        form={nestedForm(form, "receive_items")}
        order={order}
      />
    )
  })

  it("should render correctly", async () => {
    expect(screen.getByText("Items to receive")).toBeInTheDocument()
    expect(screen.getByText("Medusa Shorts")).toBeInTheDocument()
    expect(screen.getByText("S")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("should mark an item as to be received when checkbox is checked", async () => {
    const checkboxes = screen.getAllByRole("checkbox")
    const user = userEvent.setup()

    // We expect two checkboxes, one for the header and one for the item
    expect(checkboxes).toHaveLength(2)

    // Item checkbox
    const checkbox = checkboxes[1]
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)

    const { receive_items } = form.getValues()
    expect(checkbox).toBeChecked()
    expect(receive_items.items[0].receive).toEqual(true)
  })
})
