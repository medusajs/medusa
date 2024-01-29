import React from "react"
import { useAdminNote } from "medusa-react"

type Props = {
  noteId: string
}

const Note = ({ noteId }: Props) => {
  const { note, isLoading } = useAdminNote(noteId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {note && <span>{note.resource_type}</span>}
    </div>
  )
}

export default Note
