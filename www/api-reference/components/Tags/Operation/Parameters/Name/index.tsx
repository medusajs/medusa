export type TagOperationParametersNameProps = {
  name: string
  is_required?: boolean
}

const TagOperationParametersName = ({
  name,
  is_required,
}: TagOperationParametersNameProps) => {
  return (
    <span className="font-monospace w-1/3 ">
      {name}
      {is_required && (
        <>
          <br />
          <span className="text-medusa-tag-red-text text-[11px]">required</span>
        </>
      )}
    </span>
  )
}

export default TagOperationParametersName
