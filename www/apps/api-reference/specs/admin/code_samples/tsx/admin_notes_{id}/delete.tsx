import React from "react"
import { useAdminDeleteNote } from "medusa-react"

type Props = {
  noteId: string
}

const Note = ({ noteId }: Props) => {
  const deleteNote = useAdminDeleteNote(noteId)
  // ...

  const handleDelete = () => {
    deleteNote.mutate()
  }

  // ...
}

export default Note
