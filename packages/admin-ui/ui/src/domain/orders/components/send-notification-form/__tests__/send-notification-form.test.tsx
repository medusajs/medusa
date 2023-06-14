import { renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import SendNotificationForm from ".."
import { renderWithProviders } from "../../../../../../test/utils/render-with-providers"
import { nestedForm } from "../../../../../utils/nested-form"
import { CreateClaimFormType } from "../../../details/claim/register-claim-menu"

describe("SendNotificationForm", () => {
  let form: UseFormReturn<CreateClaimFormType, any>

  beforeEach(() => {
    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: {
          notification: {
            send_notification: true,
          },
        },
      })
    )

    form = result.current

    renderWithProviders(
      <SendNotificationForm
        type="claim"
        form={nestedForm(form, "notification")}
      />
    )
  })

  it("should render initial value correctly", async () => {
    const checkbox = screen.getByRole("checkbox")

    expect(checkbox).toBeChecked()
  })

  it("should update the value when the checkbox is clicked", async () => {
    const checkbox = screen.getByRole("checkbox")
    const user = userEvent.setup()

    await user.click(checkbox)

    const {
      notification: { send_notification },
    } = form.getValues()

    expect(send_notification).toEqual(false)
    expect(checkbox).not.toBeChecked()
  })
})
