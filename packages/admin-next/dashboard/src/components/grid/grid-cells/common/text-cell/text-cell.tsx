type TextCellProps = {
  key: string
  meta: {}
}

export const TextCell = ({ key, meta }: TextCellProps) => {
  return <div>{key}</div>
}
