import { Plus, Trash } from "@medusajs/icons"
import { Button, Input, Table } from "@medusajs/ui"
import { useState } from "react"

interface KeyPair {
  key: string
  value: string
}

export interface KeypairProps {
  labels: {
    add: string
    key?: string
    value?: string
  }
  value: KeyPair[]
  onChange: (value: KeyPair[]) => void
  disabled?: boolean
}

export const Keypair = ({ labels, onChange, value }: KeypairProps) => {
  const addKeyPair = () => {
    onChange([...value, { key: ``, value: `` }])
  }

  const deleteKeyPair = (index: number) => {
    return () => {
      onChange(value.filter((_, i) => i !== index))
    }
  }

  const onKeyChange = (index: number) => {
    return (key: string) => {
      const newArr = value.map((pair, i) => {
        if (i === index) {
          return { key, value: pair.value }
        }
        return pair
      })

      onChange(newArr)
    }
  }

  const onValueChange = (index: number) => {
    return (val: string) => {
      const newArr = value.map((pair, i) => {
        if (i === index) {
          return { key: pair.key, value: val }
        }
        return pair
      })

      onChange(newArr)
    }
  }

  return (
    <div>
      <Table className="w-full">
        <Table.Header className="border-t-0">
          <Table.Row>
            <Table.HeaderCell>{labels.key}</Table.HeaderCell>
            <Table.HeaderCell>{labels.value}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {value.map((pair, index) => {
            return (
              <Field
                labels={labels}
                field={pair}
                updateKey={onKeyChange(index)}
                updateValue={onValueChange(index)}
                onDelete={deleteKeyPair(index)}
              />
            )
          })}
        </Table.Body>
      </Table>
      <Button
        variant="secondary"
        size="small"
        type="button"
        className="w-full mt-4"
        onClick={addKeyPair}
      >
        <Plus />
        {labels.add}
      </Button>
    </div>
  )
}

type FieldProps = {
  field: KeyPair
  labels: {
    key?: string
    value?: string
  }
  updateKey: (key: string) => void
  updateValue: (value: string) => void
  onDelete: () => void
}

const Field: React.FC<FieldProps> = ({
  field,
  updateKey,
  updateValue,
  onDelete,
}) => {
  const [key, setKey] = useState(field.key)
  const [value, setValue] = useState(field.value)

  return (
    <Table.Row>
      <Table.Cell className="!p-0 h-0">
        <Input
          className="rounded-none bg-transparent"
          onBlur={() => updateKey(key)}
          value={key}
          onChange={(e) => {
            setKey(e.currentTarget.value)
          }}
        />
      </Table.Cell>
      <Table.Cell className="!p-0 h-0">
        <Input
          className="rounded-none bg-transparent"
          onBlur={() => updateValue(value)}
          value={value}
          onChange={(e) => {
            setValue(e.currentTarget.value)
          }}
        />
      </Table.Cell>
      <Table.Cell className="!p-0 h-0 border-r">
        <Button
          variant="transparent"
          size="small"
          type="button"
          onClick={onDelete}
        >
          <Trash />
        </Button>
      </Table.Cell>
    </Table.Row>
  )
}
