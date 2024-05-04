import React from "react"
import { useAdminCreatePublishableApiKey } from "medusa-react"

const CreatePublishableApiKey = () => {
  const createKey = useAdminCreatePublishableApiKey()
  // ...

  const handleCreate = (title: string) => {
    createKey.mutate({
      title,
    }, {
      onSuccess: ({ publishable_api_key }) => {
        console.log(publishable_api_key.id)
      }
    })
  }

  // ...
}

export default CreatePublishableApiKey
