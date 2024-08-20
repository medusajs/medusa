import React from "react"
import { NoteProps } from ".."
import { NoteLayout } from "../Layout"

export const SuccessNote = ({ title = "Sucess", ...props }: NoteProps) => {
  return <NoteLayout title={title} {...props} />
}
