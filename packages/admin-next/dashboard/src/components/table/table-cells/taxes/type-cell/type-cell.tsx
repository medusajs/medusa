import { Badge } from "@medusajs/ui"

type CellProps = {
  is_combinable: boolean
}

type HeaderProps = {
  text: string
}

export const TypeCell = ({ is_combinable }: CellProps) => {
  return (
    <div className="flex h-full w-full items-center gap-x-3 overflow-hidden">
      <span className="truncate">
        {is_combinable ? (
          <Badge size="2xsmall" color="green">
            Combinable
          </Badge>
        ) : (
          ""
        )}
      </span>
    </div>
  )
}

export const TypeHeader = ({ text }: HeaderProps) => {
  return (
    <div className=" flex h-full w-full items-center">
      <span>{text}</span>
    </div>
  )
}
