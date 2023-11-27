import {
  Button,
  FocusModal,
  Heading,
  Table,
  useToggleState,
} from "@medusajs/ui"
import { useState } from "react"

export default function useToggleStateDemo() {
  const [editOpen, showEdit, closeEdit] = useToggleState()
  const [entityToEdit, setEntityToEdit] = useState<string>()

  const entities = ["foo", "bar", "baz"]

  const editEntity = (entity: string) => {
    setEntityToEdit(entity)
    showEdit()
  }

  const onSave = () => {
    // do entity update, etc.
    closeEdit()
  }

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Entity Name</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {entities.map((entity, index) => (
            <Table.Row key={index}>
              <Table.Cell>{entity}</Table.Cell>
              <Table.Cell className="text-right">
                <Button variant="secondary" onClick={() => editEntity(entity)}>
                  Edit
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <FocusModal
        open={editOpen}
        onOpenChange={(modalOpened) => {
          if (!modalOpened) {
            closeEdit()
          }
        }}
      >
        <FocusModal.Content>
          <FocusModal.Header>
            <Button onClick={() => onSave()}>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body>
            <div className="p-10">
              <Heading>Edit {entityToEdit}</Heading>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}
