import { Badge, Command } from "@medusajs/ui"

export default function CommandDemo() {
  return (
    <div className="w-full">
      <Command>
        <Badge color="green">Get</Badge>
        <code>localhost:9000/store/products</code>
        <Command.Copy
          content="localhost:9000/store/products"
          className="ml-auto"
        />
      </Command>
    </div>
  )
}
