export type TagOperationParametersNameProps = {
  name: string
  isRequired?: boolean
}

const TagOperationParametersName = ({
  name,
  isRequired,
}: TagOperationParametersNameProps) => {
  return (
    <span className="font-monospace w-1/3 ">
      {name}
      {isRequired && (
        <>
          <br />
          <span className="text-medusa-tag-red-text text-[11px]">required</span>
        </>
      )}
    </span>
  )
}

export default TagOperationParametersName
