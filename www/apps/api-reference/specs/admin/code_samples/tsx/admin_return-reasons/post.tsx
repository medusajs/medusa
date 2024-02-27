import React from "react"
import { useAdminCreateReturnReason } from "medusa-react"

const CreateReturnReason = () => {
  const createReturnReason = useAdminCreateReturnReason()
  // ...

  const handleCreate = (
    label: string,
    value: string
  ) => {
    createReturnReason.mutate({
      label,
      value,
    }, {
      onSuccess: ({ return_reason }) => {
        console.log(return_reason.id)
      }
    })
  }

  // ...
}

export default CreateReturnReason
