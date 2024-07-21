import React, { useState } from "react"
import clsx from "clsx"

import Button from "../../../fundamentals/button"
import Modal from "../../../molecules/modal"
import RadioGroup from "../../radio-group"

type ConfirmationPromptProps = {
  handleClose: () => void
  onSaveOnlyVisible: () => Promise<void>
  onSaveAll: () => Promise<void>
  hiddenEditedColumns: string[]
}

enum SaveMode {
  SAVE_VISIBLE_ONLY = "SAVE_VISIBLE_ONLY",
  SAVE_ALL = "SAVE_ALL",
}

const SavePrompt: React.FC<ConfirmationPromptProps> = ({
  handleClose,
  onSaveOnlyVisible,
  onSaveAll,
  hiddenEditedColumns,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const hasHiddenColumns = !!hiddenEditedColumns.length

  const [saveSelection, setSaveSelection] = useState<SaveMode>(
    SaveMode.SAVE_VISIBLE_ONLY
  )

  return (
    <Modal isLargeModal={false} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">Saving changes</span>
            <span className="inter-base-regular text-grey-50 mb-4 mt-1 w-[420px]">
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
                value={SaveMode.SAVE_ALL}
              />
              <RadioGroup.Item
                className="flex-1"
                label={"Save only visible"}
                description={"Save only visible price changes"}
                value={SaveMode.SAVE_VISIBLE_ONLY}
              />
            </RadioGroup.Root>
          )}
        </Modal.Content>
        <Modal.Footer className="flex items-center border border-t">
          <div className="mt-4 flex h-8 w-full justify-end gap-2">
            <Button
              variant="ghost"
              className="text-small me-2  justify-center"
              size="small"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="small"
              color="black"
              className={clsx(
                "text-small justify-center bg-black text-white active:bg-black active:text-white",
                {
                  "hover:bg-black": !isLoading,
                }
              )}
              loading={isLoading}
              onClick={() => {
                setIsLoading(true)

                const callback = !hasHiddenColumns
                  ? onSaveOnlyVisible
                  : saveSelection === SaveMode.SAVE_ALL
                    ? onSaveAll
                    : onSaveOnlyVisible

                callback()
              }}
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
