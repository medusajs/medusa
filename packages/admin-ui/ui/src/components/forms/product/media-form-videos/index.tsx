import clsx from "clsx"
import { useMemo } from "react"
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useWatch,
} from "react-hook-form"
import { FormImage } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import FileUploadField from "../../../atoms/file-upload-field"
import Button from "../../../fundamentals/button"
import CheckCircleFillIcon from "../../../fundamentals/icons/check-circle-fill-icon"
import TrashIcon from "../../../fundamentals/icons/trash-icon"
import Actionables, { ActionType } from "../../../molecules/actionables"

type ImageType = { selected: boolean } & FormImage
export type VideoType = ImageType
export type MediaFormType = {
  videos: VideoType[]
}

type Props = {
  form: NestedForm<MediaFormType>
}

const MediaFormVideos = ({ form }: Props) => {
  const { control, path, setValue } = form

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: path("videos"),
  })

  const handleFilesChosen = (files: File[]) => {
    if (files.length) {
      const toAppend = files.map((file) => {
        return {
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          nativeFile: file,
          selected: false,
        }
      })

      append(toAppend)
    }
  }

  const videos = useWatch({
    control,
    name: path("videos"),
    defaultValue: [],
  })

  const selected = useMemo(() => {
    const selected: number[] = []

    videos!.forEach((i, index) => {
      if (i.selected) {
        selected.push(index)
      }
    })

    return selected
  }, [videos])

  const handleRemove = () => {
    remove(selected)
  }

  const handleDeselect = () => {
    selected.forEach((i) => {
      setValue(path(`videos.${i}.selected`), false)
    })
  }

  return (
    <div>
      <div>
        <div>
          <FileUploadField
            onFileChosen={handleFilesChosen}
            placeholder="Upload Video"
            multiple
            filetypes={[
              "video/mp4",
              "video/x-msvideo",
              "video/ogg",
              "video/webm",
              "video/MP2T",
              "video/quicktime",
              "video/x-msvideo",
              "video/x-flv",
              "video/x-matroska",
            ]}
            className="py-large"
          />
        </div>
      </div>
      {fields.length > 0 && (
        <div className="mt-large">
          <div className="mb-small flex items-center justify-between">
            <h2 className="inter-large-semibold">Uploads</h2>
            <ModalActions
              number={selected.length}
              onDeselect={handleDeselect}
              onRemove={handleRemove}
            />
          </div>
          <div className="gap-y-2xsmall flex flex-col">
            {fields.map((field, index) => {
              console.log(field)
              return (
                <Video
                  key={field.id}
                  video={field}
                  index={index}
                  remove={remove}
                  form={form}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

type VideoProps = {
  video: FieldArrayWithId<MediaFormType, "videos", "id">
  index: number
  remove: (index: number) => void
  form: NestedForm<MediaFormType>
}

const Video = ({ video, index, form, remove }: VideoProps) => {
  const { control, path } = form

  const actions: ActionType[] = [
    {
      label: "Delete",
      onClick: () => remove(index),
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  return (
    <Controller
      name={path(`videos.${index}.selected`)}
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <div className="relative">
            <button
              className={clsx(
                "px-base py-xsmall hover:bg-grey-5 rounded-rounded group flex items-center justify-between",
                {
                  "bg-grey-5": value,
                }
              )}
              type="button"
              onClick={() => onChange(!value)}
            >
              <div className="gap-x-large flex items-center">
                <div className="flex h-16 w-16 items-center justify-center">
                  <img
                    src={video.url}
                    alt={video.name || "Uploaded Video"}
                    className="rounded-rounded max-h-[64px] max-w-[64px]"
                  />
                </div>
                <div className="inter-small-regular flex flex-col text-left">
                  <p>{video.name}</p>
                  <p className="text-grey-50">
                    {video.size ? `${(video.size / 1024).toFixed(2)} KB` : ""}
                  </p>
                </div>
              </div>
              <div className="gap-x-base flex items-center">
                <span
                  className={clsx("hidden", {
                    "!text-violet-60 !block": value,
                  })}
                >
                  <CheckCircleFillIcon size={24} />
                </span>
              </div>
            </button>
            <div className="right-base absolute bottom-0 top-0 flex items-center">
              <Actionables actions={actions} forceDropdown />
            </div>
          </div>
        )
      }}
    />
  )
}

type ModalActionsProps = {
  number: number
  onRemove: () => void
  onDeselect: () => void
}

const ModalActions = ({ number, onRemove, onDeselect }: ModalActionsProps) => {
  return (
    <div className="flex h-10 items-center overflow-y-hidden pr-1">
      <div
        className={clsx(
          "gap-x-small flex items-center transition-all duration-200",
          {
            "translate-y-[-42px]": !number,
            "translate-y-[0px]": number,
          }
        )}
      >
        <span>{number} selected</span>
        <div className="bg-grey-20 h-5 w-px" />
        <div className="gap-x-xsmall flex items-center">
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={onDeselect}
          >
            Deselect
          </Button>
          <Button
            variant="danger"
            size="small"
            type="button"
            onClick={onRemove}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MediaFormVideos
