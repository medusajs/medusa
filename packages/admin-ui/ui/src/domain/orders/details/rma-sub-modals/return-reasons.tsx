import { useAdminReturnReasons } from "medusa-react"
import React, { useContext, useState } from "react"
import FileUploadField from "../../../../components/atoms/file-upload-field"
import Button from "../../../../components/fundamentals/button"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import Select from "../../../../components/molecules/select"
import Medusa from "../../../../services/api"

type RMAReturnReasonSubModalProps = {
  onSubmit: (reason, note, images) => void
  reason?: any
  existingNote?: string
  customReturnOptions?: any[]
  addImage?: boolean
  images: string[]
  isLargeModal?: boolean
}

const RMAReturnReasonSubModal: React.FC<RMAReturnReasonSubModalProps> = ({
  onSubmit,
  reason,
  existingNote,
  customReturnOptions = undefined,
  addImage,
  images,
}) => {
  const { pop } = useContext(LayeredModalContext)
  const { return_reasons } = useAdminReturnReasons()
  const [note, setNote] = useState(existingNote || "")
  const [files, setFiles] = useState<any[]>([])
  const [selectedReason, setSelectedReason] = useState(
    reason ? { value: reason, label: reason.label } : null
  )

  const onFileChosen = (file) => {
    setFiles((files) => [...files, ...file])
  }

  const removeFileFromList = (file) => {
    const newFiles = [...files]
    newFiles.splice(newFiles.indexOf(file), 1)
    setFiles(newFiles)
  }

  const handleImageDelete = (url) => {
    Medusa.uploads.delete(url)
  }

  const onChange = (value) => {
    setNote(value.target.value)
  }

  return (
    <>
      <Modal.Content>
        <div className="h-full">
          <h2 className="inter-base-semibold mb-4">Reason for Return</h2>
          <Select
            label="Reason"
            value={selectedReason}
            onChange={setSelectedReason}
            options={
              customReturnOptions ||
              return_reasons?.map((rr) => ({ value: rr, label: rr.label })) ||
              []
            }
          />
          <InputField
            label={"Note"}
            value={note}
            className="my-4"
            onChange={(val) => onChange(val)}
          />
          {addImage && (
            <div>
              {images &&
                images.map((i) => (
                  <ImageRow
                    url={i}
                    name={i.split("//").pop()}
                    size={undefined}
                    onDelete={() => handleImageDelete(i)}
                  />
                ))}
              {files.map((f) => (
                <ImageRow
                  url={window.URL.createObjectURL(f)}
                  name={f.name}
                  size={(f.size / 1000).toFixed(2)}
                  onDelete={() => removeFileFromList(f)}
                />
                // <div className="flex items-center w-full justify-between my-8">
                //   <div className="flex items-center">
                //     <div className="w-20 h-20 bg-voilet-60">
                //       <img
                //         className="object-cover rounded-rounded w-full h-full"
                //         src={window.URL.createObjectURL(f)}
                //       />
                //     </div>
                //     <div className="inter-small-regular ml-8 flex flex-col">
                //       {f.name}
                //       <span className="text-grey-50">
                //         {(f.size / 1000).toFixed(2)} KB
                //       </span>
                //     </div>
                //   </div>
                //   <Button
                //     variant="ghost"
                //     size="small"
                //     className="w-8 h-8 text-grey-40"
                //     onClick={() => removeFileFromList(f)}
                //   >
                //     <TrashIcon size={20} />
                //   </Button>
                // </div>
              ))}
              <div className="h-20">
                <FileUploadField
                  onFileChosen={onFileChosen}
                  filetypes={["image/png", "image/jpeg"]}
                />
              </div>
            </div>
          )}
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full justify-end">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={() => pop()}
          >
            Back
          </Button>
          <Button
            variant="primary"
            className="w-[112px]"
            size="small"
            disabled={typeof selectedReason === "undefined"}
            onClick={() => {
              onSubmit(selectedReason, note, files)
              pop()
            }}
          >
            Add
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

const ImageRow = ({ url, onDelete, name, size }) => (
  <div className="my-8 flex w-full items-center justify-between">
    <div className="flex items-center">
      <div className="bg-voilet-60 h-20 w-20">
        <img className="rounded-rounded h-full w-full object-cover" src={url} />
      </div>
      <div className="inter-small-regular ml-8 flex flex-col">
        {name}
        {size && <span className="text-grey-50">{size} KB</span>}
      </div>
    </div>
    <Button
      variant="ghost"
      size="small"
      className="text-grey-40 h-8 w-8"
      onClick={onDelete}
    >
      <TrashIcon size={20} />
    </Button>
  </div>
)
export default RMAReturnReasonSubModal
