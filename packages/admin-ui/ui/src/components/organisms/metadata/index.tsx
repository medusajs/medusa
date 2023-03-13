import React, { useEffect, useState } from "react"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import InputField from "../../molecules/input"

type AddMetadataProps = {
  metadata: MetadataField[]
  setMetadata: (metadata: MetadataField[]) => void
  heading?: string
}

export type MetadataField = {
  key: string
  value: string
}

const Metadata: React.FC<AddMetadataProps> = ({
  metadata,
  setMetadata,
  heading = "Metadata",
}) => {
  const [localData, setLocalData] = useState<MetadataField[]>([])

  useEffect(() => {
    setLocalData(metadata)
  }, [metadata])

  const addKeyPair = () => {
    setMetadata([...metadata, { key: ``, value: `` }])
  }

  const onKeyChange = (index: number) => {
    return (key: string) => {
      const newFields = metadata
      newFields[index] = { key: key, value: newFields[index].value }
      setMetadata(newFields)
    }
  }

  const onValueChange = (index: number) => {
    return (value: any) => {
      const newFields = metadata
      newFields[index] = {
        key: newFields[index].key,
        value: value,
      }
      setMetadata(newFields)
    }
  }

  const deleteKeyPair = (index: number) => {
    return () => {
      setMetadata(metadata.filter((_, i) => i !== index))
    }
  }

  return (
    <div>
      <span className="inter-base-semibold">{heading}</span>
      <div className="mt-base gap-y-base flex flex-col">
        {localData.map((field, index) => {
          return (
            <DeletableElement key={index} onDelete={deleteKeyPair(index)}>
              <Field
                field={field}
                updateKey={onKeyChange(index)}
                updateValue={onValueChange(index)}
              />
            </DeletableElement>
          )
        })}
        <div>
          <Button
            variant="secondary"
            size="small"
            type="button"
            className="w-full"
            onClick={addKeyPair}
          >
            <PlusIcon size={20} />
            Add Metadata
          </Button>
        </div>
      </div>
    </div>
  )
}

type FieldProps = {
  field: MetadataField
  updateKey: (key: string) => void
  updateValue: (value: string) => void
}

const Field: React.FC<FieldProps> = ({ field, updateKey, updateValue }) => {
  return (
    <div className="gap-x-xsmall flex w-full items-center">
      <div className="maw-w-[200px]">
        <InputField
          label="Key"
          placeholder="Some key"
          defaultValue={field.key}
          onChange={(e) => {
            updateKey(e.currentTarget.value)
          }}
        />
      </div>
      <div className="flex-grow">
        <InputField
          label="Value"
          placeholder="Some value"
          defaultValue={field.value}
          onChange={(e) => {
            updateValue(e.currentTarget.value)
          }}
        />
      </div>
    </div>
  )
}

type DeletableElementProps = {
  onDelete: () => void
  children?: React.ReactNode
}

const DeletableElement: React.FC<DeletableElementProps> = ({
  onDelete,
  children,
}) => {
  return (
    <div className="gap-x-xlarge flex items-end">
      <div className="flex-grow">{children}</div>
      <Button
        variant="ghost"
        size="small"
        className="text-grey-40 h-10 w-10"
        type="button"
        onClick={onDelete}
      >
        <TrashIcon size={20} />
      </Button>
    </div>
  )
}

export default Metadata
