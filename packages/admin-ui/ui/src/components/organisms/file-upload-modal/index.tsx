import React from "react"
import { useTranslation } from "react-i18next"
import FileUploadField from "../../atoms/file-upload-field"
import Modal from "../../molecules/modal"

type FileUploadModalProps = {
  setFiles: (files: any[]) => void
  handleClose: () => void
  filetypes: string[]
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  handleClose,
  filetypes,
  setFiles,
}) => {
  const { t } = useTranslation()
  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            {t("file-upload-modal-upload-a-new-photo", "Upload a new photo")}
          </span>
        </Modal.Header>
        <Modal.Content>
          <div className="h-96">
            <FileUploadField filetypes={filetypes} onFileChosen={setFiles} />
          </div>
        </Modal.Content>
      </Modal.Body>
    </Modal>
  )
}

export default FileUploadModal
