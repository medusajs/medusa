import { storiesOf } from "@storybook/react"
import React from "react"
import useState from "storybook-addon-state"
import TwoStepDelete from "."
import useNotification from "../../../hooks/use-notification"

storiesOf("Atoms/TwoStepDelete", module).add("Default", () => {
  const [deleting, setDeleting] = useState<boolean>("delete", false)

  const notification = useNotification()

  const fakeDelete = () => {
    setDeleting(true)
    setTimeout(() => {
      setDeleting(false)
      notification("Success", "Successfully deleted something", "success")
    }, 3000)
  }

  return (
    <div>
      <TwoStepDelete deleting={deleting} onDelete={fakeDelete} />
    </div>
  )
})

storiesOf("Atoms/TwoStepDelete", module).add("Custom text and style", () => {
  const [deleting, setDeleting] = useState<boolean>("delete", false)

  const notification = useNotification()

  const fakeDelete = () => {
    setDeleting(true)
    setTimeout(() => {
      setDeleting(false)
      notification("Success", "Successfully deleted something", "success")
    }, 3000)
  }

  return (
    <div className="w-[322px]">
      <TwoStepDelete
        deleting={deleting}
        onDelete={fakeDelete}
        className="w-full"
      >
        Cancel Order Edit
      </TwoStepDelete>
    </div>
  )
})
