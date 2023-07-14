import React from "react"

import Button from "../../../fundamentals/button"
import Modal from "../../../molecules/modal"

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
        </Modal.Content>
        <Modal.Footer>
          <div className="flex h-8 w-full justify-end gap-2">
            <Button
              variant="ghost"
              className="text-small mr-2  justify-center"
              size="small"
              onClick={handleClose}
            >
              Cancel
            </Button>
            {hasHiddenColumns && (
              <Button
                size="small"
                className="text-small justify-center"
                variant="primary"
                onClick={onSaveOnlyVisible}
              >
                Save only visible
              </Button>
            )}
            <Button
              size="small"
              className="text-small justify-center"
              variant="primary"
              onClick={onSaveAll}
            >
              Save all
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default SavePrompt
