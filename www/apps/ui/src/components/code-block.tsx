"use client"

import { CodeBlock as Primitive } from "@medusajs/ui"

const CodeBlock = ({
  className = "",
  code,
}: {
  className?: string
  code: string
}) => {
  return (
    <Primitive
      snippets={[{ language: "tsx", label: "TSX", code }]}
      className={className}
    >
      <Primitive.Body hideLineNumbers className="max-h-[400px] overflow-auto" />
    </Primitive>
  )
}

export { CodeBlock }
