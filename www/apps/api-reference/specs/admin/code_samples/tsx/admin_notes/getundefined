import React from "react"
import { useAdminNotes } from "medusa-react"

const Notes = () => {
  const { notes, isLoading } = useAdminNotes()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {notes && !notes.length && <span>No Notes</span>}
      {notes && notes.length > 0 && (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>{note.resource_type}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Notes
