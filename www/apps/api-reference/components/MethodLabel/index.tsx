import { Badge, capitalize } from "docs-ui"

export type MethodLabelProps = {
  method: string
  className?: string
}

const MethodLabel = ({ method, className }: MethodLabelProps) => {
  return (
    <Badge
      variant={method === "get" ? "green" : method === "post" ? "blue" : "red"}
      className={className}
    >
      {method === "delete" ? "Del" : capitalize(method)}
    </Badge>
  )
}

export default MethodLabel
