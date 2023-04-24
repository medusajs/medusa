import React, { useRef, useState } from "react"
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
  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Upload a new photo</span>
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
