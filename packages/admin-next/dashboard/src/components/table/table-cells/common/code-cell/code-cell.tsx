type CellProps = {
  code: string
}

type HeaderProps = {
  text: string
}

export const CodeCell = ({ code }: CellProps) => {
  return (
    <div className="flex h-full w-full items-center gap-x-3 overflow-hidden">
      {/* // TODO: border color inversion*/}
      <span className="bg-ui-tag-neutral-bg truncate rounded-md border border-neutral-200 p-1 text-xs">
        {code}
      </span>
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
