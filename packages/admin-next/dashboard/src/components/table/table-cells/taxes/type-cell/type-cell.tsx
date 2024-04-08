import { Badge } from "@medusajs/ui"

type CellProps = {
  is_default: boolean
}

type HeaderProps = {
  text: string
}

export const TypeCell = ({ is_default }: CellProps) => {
  return (
    <div className="flex h-full w-full items-center gap-x-3 overflow-hidden">
      <span className="truncate">
        {is_default ? (
          <Badge size="2xsmall" color="green">
            Default
          </Badge>
        ) : (
          <Badge size="2xsmall" color="purple">
            Override
          </Badge>
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
