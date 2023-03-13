import React from "react"
import Button from "../../fundamentals/button"
import InputField from "../input"
import { trim } from "lodash"

type SaveFilterItemProps = {
  saveFilter: () => void
  name: string
  setName: (name: string) => void
}

const SaveFilterItem: React.FC<SaveFilterItemProps> = ({
  saveFilter,
  setName,
  name,
}) => {
  const onSave = () => {
    const trimmedName = trim(name)
    if (trimmedName !== "") {
      saveFilter()
      setName("")
    }
  }

  return (
    <div className="mt-2 flex w-full">
      <InputField
        className="max-w-[172px] pt-0 pb-1"
        placeholder="Name your filter..."
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <Button
        className="border-grey-20 ml-2 border"
        variant="ghost"
        size="small"
        onClick={onSave}
      >
        Save
      </Button>
    </div>
  )
}

export default SaveFilterItem
