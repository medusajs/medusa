import React from "react"
import { useAdminCreateCustomerGroup } from "medusa-react"

const CreateCustomerGroup = () => {
  const createCustomerGroup = useAdminCreateCustomerGroup()
  // ...

  const handleCreate = (name: string) => {
    createCustomerGroup.mutate({
      name,
    })
  }

  // ...
}

export default CreateCustomerGroup
