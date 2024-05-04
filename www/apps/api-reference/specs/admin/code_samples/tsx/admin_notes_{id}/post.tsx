import React from "react"
import { useAdminUpdateNote } from "medusa-react"

type Props = {
  noteId: string
}

const Note = ({ noteId }: Props) => {
  const updateNote = useAdminUpdateNote(noteId)
  // ...

  const handleUpdate = (
    value: string
  ) => {
    updateNote.mutate({
      value
    }, {
      onSuccess: ({ note }) => {
        console.log(note.value)
      }
    })
  }

  // ...
}

export default Note
