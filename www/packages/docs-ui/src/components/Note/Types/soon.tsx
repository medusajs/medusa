import React from "react"
import { NoteProps } from ".."
import { NoteLayout } from "../Layout"

export const SoonNote = ({ title = "Coming soon", ...props }: NoteProps) => {
  return <NoteLayout title={title} {...props} />
}
