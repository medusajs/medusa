import React, { useState } from "react"

import Button from "../../../fundamentals/button"
import Modal from "../../../molecules/modal"
import RadioGroup from "../../radio-group"

type ConfirmationPromptProps = {
  handleClose: () => void
  onSaveOnlyVisible: () => Promise<void>
  onSaveAll: () => Promise<void>
  hiddenEditedColumns: string[]
}

const SavePrompt: React.FC<ConfirmationPromptProps> = ({
  handleClose,
  onSaveOnlyVisible,
  onSaveAll,
  hiddenEditedColumns,
}) => {
  const hasHiddenColumns = !!hiddenEditedColumns.length

  const [saveSelection, setSaveSelection] = useState("SAVE_VISIBLE_ONLY")

  return (
    <Modal isLargeModal={false} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">Saving changes</span>
            <span className="inter-base-regular text-grey-50 mt-1 mb-4 w-[420px]">
              {hasHiddenColumns
                ? `You have edited prices in hidden columns: (${hiddenEditedColumns.join(
                    ", "
                  )}). Do you wish to save these too?`
                : "Save edited variant prices"}
            </span>
          </div>

          {hasHiddenColumns && (
            <RadioGroup.Root
              className="gap-base mt-2 flex-col"
              value={saveSelection}
              onValueChange={setSaveSelection}
            >
              <RadioGroup.Item
                className="flex-1"
                label={"Save all"}
                description={"Save all price changes"}
                value="SAVE_ALL"
              />
              <RadioGroup.Item
                className="flex-1"
                label={"Save only visible"}
                description={"Save only visible price changes"}
                value="SAVE_VISIBLE_ONLY"
              />
            </RadioGroup.Root>
          )}
        </Modal.Content>
        <Modal.Footer className="flex items-center border border-t">
          <div className="mt-4 flex h-8 w-full justify-end gap-2">
            <Button
              variant="ghost"
              className="text-small mr-2  justify-center"
              size="small"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="small"
              color="black"
              className="text-small justify-center bg-black text-white hover:bg-black"
              variant="ghost"
              onClick={
                !hasHiddenColumns
                  ? onSaveOnlyVisible
                  : saveSelection === "SAVE_ALL"
                  ? onSaveAll
                  : onSaveOnlyVisible
              }
            >
              Save changes
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default SavePrompt
