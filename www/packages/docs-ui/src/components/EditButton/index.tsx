import React from "react"
import { Button } from "../.."

type EditButtonProps = {
  filePath: string
}

export const EditButton = ({ filePath }: EditButtonProps) => {
  return (
    <Button variant="secondary" className="mb-docs_1">
      <a href={`https://github.com/medusajs/medusa/edit/develop${filePath}`}>
        Edit this page
      </a>
    </Button>
  )
}
