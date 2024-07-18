import clsx from "clsx"
import { ReactNode, useState } from "react"
import { useHref } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Tooltip from "../../atoms/tooltip"
import Button from "../../fundamentals/button"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import DownloadIcon from "../../fundamentals/icons/download-icon"
import FileIcon from "../../fundamentals/icons/file-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import WarningCircleIcon from "../../fundamentals/icons/warning-circle"
import Modal from "../../molecules/modal"

type FileSummaryProps = {
  name: string
  size: number
  hasError?: boolean
  errorMessage?: string
  action: ReactNode
  progress?: number
  status?: string
}

/**
 * Render an upload file summary (& upload progress).
 */
function FileSummary(props: FileSummaryProps) {
  const { action, name, progress, size, status, hasError, errorMessage } = props

  const formattedSize =
    size / 1024 < 10
      ? `${(size / 1024).toFixed(2)} KiB`
      : `${(size / (1024 * 1024)).toFixed(2)} MiB`

  return (
    <div className="relative">
      <Tooltip
        side="top"
        maxWidth={320}
        open={hasError ? undefined : false}
        content={
          hasError && errorMessage ? (
            <span className="font-normal text-rose-500">{errorMessage}</span>
          ) : null
        }
      >
        <div
          style={{ width: `${progress}%` }}
          className="bg-grey-5 transition-width absolute h-full duration-150 ease-in-out"
        />
        <div className="border-1 relative mt-6 flex items-center rounded-xl border">
          <div className="m-4">
            <FileIcon size={30} fill={progress ? "#9CA3AF" : "#2DD4BF"} />
          </div>

          <div className="my-6 flex-1">
            <div className="text-small text-grey-90 leading-5">{name}</div>
            <div
              className={clsx("text-xsmall text-grey-50 leading-4", {
                "text-rose-500": hasError,
              })}
            >
              {status || formattedSize}
            </div>
          </div>

          <div className="m-6">{action}</div>
        </div>
      </Tooltip>
    </div>
  )
}

type UploadSummaryProps = {
  creations?: number
  updates?: number
  type: string
}

/**
 * Render a batch update request summary.
 */
function UploadSummary(props: UploadSummaryProps) {
  const { creations, updates, type } = props
  const { t } = useTranslation()
  return (
    <div className="flex gap-6">
      <div className="text-small text-grey-90 flex items-center">
        <CheckCircleIcon color="#9CA3AF" className="me-2" />
        <span className="font-semibold"> {creations || 0}&nbsp;</span>{" "}
        {t("upload-modal-new", "new")} {type}
      </div>
      <div className="text-small text-grey-90 flex items-center">
        <WarningCircleIcon fill="#9CA3AF" className="me-2" />
        <span className="font-semibold">{updates || 0}&nbsp;</span>{" "}
        {t("upload-modal-updates", "updates")}
      </div>
    </div>
  )
}

type DropAreaProps = {
  onUpload: (d: DataTransferItem) => void
}

/**
 * Component handles an CSV file drop.
 */
function DropArea(props: DropAreaProps) {
  const { t } = useTranslation()
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (e.dataTransfer.items?.length) {
      props.onUpload(e.dataTransfer.items[0].getAsFile())
    }
  }

  const handleFileSelect = (e) => {
    props.onUpload(e.target.files[0])
  }

  const onDragOver = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  return (
    <div
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      onDragOver={onDragOver}
      onDrop={handleFileDrop}
      className={clsx(
        "mt-3 flex flex-col items-center justify-center rounded-xl border border-dashed p-6",
        { "opacity-50": isDragOver }
      )}
    >
      <span className="text-grey-50 text-small">
        {t("upload-modal-drop-your-file-here-or", "Drop your file here, or")}
        <a className="text-violet-60">
          <label className="cursor-pointer" htmlFor="upload-form-file">
            {" "}
            {t("upload-modal-click-to-browse", "click to browse.")}
          </label>
          <input
            type="file"
            id="upload-form-file"
            className="hidden"
            // multiple
            accept="text/csv"
            onChange={handleFileSelect}
          />
        </a>
      </span>
      <span className="text-grey-40 text-small">
        {t(
          "upload-modal-only-csv-files-are-supported",
          "Only .csv files are supported."
        )}
      </span>
    </div>
  )
}

type UploadModalProps = {
  type: string
  status?: string
  hasError?: boolean
  errorMessage?: string
  fileTitle: string
  description1Text: string
  description2Title: string
  description2Text: string
  onDownloadTemplate: () => any
  canImport?: boolean
  progress?: number
  onClose: () => void
  onSubmit: () => void
  onFileRemove: () => void
  processUpload: (...args: any[]) => Promise<any>
  summary?: { toCreate?: number; toUpdate?: number }
}

/**
 * Upload prices modal.
 */
function UploadModal(props: UploadModalProps) {
  const {
    description1Text,
    description2Text,
    description2Title,
    fileTitle,
    canImport,
    processUpload,
    onClose,
    onSubmit,
    onFileRemove,
    onDownloadTemplate,
    summary,
    hasError,
    errorMessage,
    status,
    type,
  } = props
  const [uploadFile, setUploadFile] = useState<File>()
  const { t } = useTranslation()

  const { name, size } = uploadFile || {}

  const onUpload = async (file) => {
    setUploadFile(file)
    await processUpload(file)
  }

  const removeFile = () => {
    setUploadFile(undefined)
    onFileRemove()
  }

  return (
    <Modal open handleClose={onClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex justify-between">
            <span className="text-grey-90 inter-large-semibold py-4 text-2xl">
              Import {fileTitle}
            </span>
            <button onClick={onClose} className="text-grey-50 cursor-pointer">
              <CrossIcon size={20} />
            </button>
          </div>

          <div className="text-grey-90 inter-large-semibold mb-1 text-base">
            {t("upload-modal-import-file-title", "Import {{fileTitle}}", {
              fileTitle,
            })}
          </div>

          <p className="text-grey-50 mb-4 text-base">{description1Text}</p>

          {summary && (
            <UploadSummary
              creations={summary.toCreate}
              updates={summary.toUpdate}
              type={type}
            />
          )}

          {!uploadFile ? (
            <DropArea onUpload={onUpload} />
          ) : (
            <FileSummary
              size={size!}
              name={name!}
              status={status}
              hasError={hasError}
              errorMessage={errorMessage}
              // progress={progress}
              // TODO: change this to actual progress once this we can track upload
              progress={100}
              action={
                <a className="h-6 w-6 cursor-pointer" onClick={removeFile}>
                  <TrashIcon stroke="#9CA3AF" />
                </a>
              }
            />
          )}

          <div className="text-grey-90 inter-large-semibold mt-8 text-base">
            {description2Title}
          </div>

          <p className="text-grey-50 mb-2 text-base">{description2Text}</p>

          <FileSummary
            name="medusa-template.csv"
            size={2967}
            action={
              <a
                className="h-6 w-6 cursor-pointer"
                onClick={onDownloadTemplate}
              >
                <DownloadIcon stroke="#9CA3AF" />
              </a>
            }
          />

          <div className="h-2" />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex h-8 w-full justify-end">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="text-small me-2 justify-center"
                size="small"
                onClick={onClose}
              >
                {t("upload-modal-cancel", "Cancel")}
              </Button>

              <Button
                size="small"
                disabled={!canImport || hasError}
                variant="primary"
                className="text-small"
                onClick={onSubmit}
              >
                {t("upload-modal-import-list", "Import List")}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default UploadModal
