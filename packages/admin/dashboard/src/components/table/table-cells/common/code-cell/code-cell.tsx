import { Badge } from "@medusajs/ui"

type CellProps = {
  code: string
}

type HeaderProps = {
  text: string
}

export const CodeCell = ({ code }: CellProps) => {
  return (
    <div className="flex h-full w-full items-center gap-x-3 overflow-hidden">
      <Badge size="2xsmall" className="truncate">
        {code}
      </Badge>
    </div>
  )
}

export const CodeHeader = ({ text }: HeaderProps) => {
  return (
    <div className=" flex h-full w-full items-center ">
      <span>{text}</span>
    </div>
  )
}
