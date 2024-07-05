import React from "react"
import { useAdminCreateNote } from "medusa-react"

const CreateNote = () => {
  const createNote = useAdminCreateNote()
  // ...

  const handleCreate = () => {
    createNote.mutate({
      resource_id: "order_123",
      resource_type: "order",
      value: "We delivered this order"
    }, {
      onSuccess: ({ note }) => {
        console.log(note.id)
      }
    })
  }

  // ...
}

export default CreateNote
