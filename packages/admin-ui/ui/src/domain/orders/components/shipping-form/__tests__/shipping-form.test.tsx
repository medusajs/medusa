import { Order, ShippingOption } from "@medusajs/medusa"
import { renderHook, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup"
import { useForm, UseFormReturn } from "react-hook-form"
import ShippingForm from ".."
import { fixtures } from "../../../../../../test/fixtures"
import { renderWithProviders } from "../../../../../../test/utils/render-with-providers"
import { nestedForm } from "../../../../../utils/nested-form"
import { CreateClaimFormType } from "../../../details/claim/register-claim-menu"
import { getDefaultClaimValues } from "../../../details/utils/get-default-values"

const selectFirstOption = async (user: UserEvent) => {
  const combobox = screen.getByRole("combobox")

  await waitFor(() => {
    combobox.focus()
  })

  // Open dropdown
  await user.keyboard("{arrowdown}")

  // Go to first option and select
  await user.keyboard("{arrowdown}")
  await user.keyboard("{Enter}")
}

describe("ShippingForm return shipping", () => {
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
      <div>
        <ShippingForm
          order={order}
          isClaim
          isReturn
          form={nestedForm(form, "return_shipping")}
        />
      </div>
    )
  })

  it("should render correctly when type is refund", async () => {
    expect(screen.getByText("Shipping for return items"))
    expect(screen.queryByText("Shipping for replacement items")).toBeNull()
  })

  it("should render options when dropdown is opened", async () => {
    const user = userEvent.setup()
    const combobox = screen.getByRole("combobox")

    await waitFor(() => {
      combobox.focus()
    })

    await user.keyboard("{arrowdown}")

    await waitFor(() => {
      expect(screen.getAllByText("Free Shipping")).toHaveLength(5)
    })
  })

  it("should select an option when clicked", async () => {
    const user = userEvent.setup()
    await selectFirstOption(user)

    await waitFor(() => {
      expect(screen.getAllByText("Free Shipping")).toHaveLength(1)
    })

    const { return_shipping } = form.getValues()

    expect(return_shipping.option?.label).toEqual("Free Shipping")
    expect(return_shipping.option?.value).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        taxRate: 0,
      })
    )
  })

  it("should render correctly when option is selected", async () => {
    const shippingOption = fixtures.get(
      "shipping_option"
    ) as unknown as ShippingOption

    await waitFor(() => {
      form.setValue("return_shipping.option", {
        label: shippingOption.name,
        value: {
          id: shippingOption.id,
          taxRate: 0.12,
        },
      })
    })

    await waitFor(() => {
      expect(screen.getByText(shippingOption.name)).toBeInTheDocument()
    })
  })
})

describe("ShippingForm return shipping", () => {
  let form: UseFormReturn<CreateClaimFormType, any>

  beforeEach(() => {
    const order = fixtures.get("order") as unknown as Order

    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: {
          ...getDefaultClaimValues(order),
          claim_type: {
            type: "replace",
          },
        },
      })
    )

    form = result.current

    renderWithProviders(
      <div>
        <ShippingForm
          order={order}
          isClaim
          form={nestedForm(form, "replacement_shipping")}
        />
      </div>
    )
  })

  it("should render correctly when type is replace", async () => {
    expect(screen.getByText("Shipping for replacement items"))
    expect(screen.queryByText("Shipping for return items")).toBeNull()
  })
})
