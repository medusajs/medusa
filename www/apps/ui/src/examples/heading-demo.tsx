import { Heading } from "@medusajs/ui"

export default function HeadingDemo() {
  return (
    <div className="flex flex-col items-center">
      <Heading level="h1">This is an H1 heading</Heading>
      <Heading level="h2">This is an H2 heading</Heading>
      <Heading level="h3">This is an H3 heading</Heading>
    </div>
  )
}
