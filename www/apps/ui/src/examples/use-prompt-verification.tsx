import { Button, usePrompt } from "@medusajs/ui"

export default function usePromptVerification() {
  const entityName = "foo-bar-baz"

  const dialog = usePrompt()

  const deleteEntity = async () => {
    const userHasConfirmed = await dialog({
      title: "Please confirm",
      description: "Are you sure you want to delete this entity?",
      verificationText: entityName,
    })
    console.log({ userHasConfirmed })
    if (userHasConfirmed) {
      // Perform Delete
    }
  }

  return (
    <Button onClick={async () => deleteEntity()}>Delete {entityName}</Button>
  )
}
