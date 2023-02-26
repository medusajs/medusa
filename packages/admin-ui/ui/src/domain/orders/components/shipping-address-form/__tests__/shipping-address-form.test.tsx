import { Order } from "@medusajs/medusa"
import { renderHook, screen, waitFor } from "@testing-library/react"
import { useForm, UseFormReturn } from "react-hook-form"
import ShippingAddressForm from ".."
import { fixtures } from "../../../../../test/mocks/data"
import { renderWithProviders } from "../../../../../test/test-utils"
import { nestedForm } from "../../../../../utils/nested-form"
import { CreateClaimFormType } from "../../../details/claim/register-claim-menu"
import { getDefaultClaimValues } from "../../../details/utils/get-default-values"

describe("ShippingAddressForm with RegisterClaimMenu", () => {
  let form: UseFormReturn<CreateClaimFormType, any>

  beforeEach(() => {
    const order = fixtures.get("order") as unknown as Order

    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: getDefaultClaimValues(order),
      })
    )

    form = result.current

    renderWithProviders(
      <ShippingAddressForm
        form={nestedForm(form, "shipping_address")}
        order={order}
      />
    )
  })

  it("should render the initial address correctly", async () => {
    expect(screen.getByText("Shipping address")).toBeInTheDocument()
    expect(screen.getByText("Faker Street 1, 3 Floor")).toBeInTheDocument()
    expect(screen.getByText("Medusa JS, 2100 Copenhagen")).toBeInTheDocument()
    expect(screen.getByText("Denmark")).toBeInTheDocument()
  })

  it("should render the address correctly when the address is changed", async () => {
    await waitFor(() => {
      form.setValue("shipping_address.address_1", "123 Second St")
      form.setValue("shipping_address.address_2", "Apt 2")
    })

    const {
      shipping_address: { address_1, address_2 },
    } = form.getValues()

    expect(address_1).toEqual("123 Second St")
    expect(address_2).toEqual("Apt 2")
  })
})
