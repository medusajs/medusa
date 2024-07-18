import { trim } from "lodash"
import React from "react"
import Button from "../../fundamentals/button"
import InputField from "../input"

type SaveFilterItemProps = {
  saveFilter: () => void
  name: string
  setName: (name: string) => void
}

/**
 * @deprecated Use `FilterMenu` instead
 */
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
        className="max-w-[172px] pb-1 pt-0"
        placeholder="Name your filter..."
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <Button
        className="border-grey-20 ms-2 border"
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
