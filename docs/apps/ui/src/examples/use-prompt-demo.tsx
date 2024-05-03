import { Button, usePrompt } from "@medusajs/ui"

export default function usePromptDemo() {
  const dialog = usePrompt()

  const deleteEntity = async () => {
    const userHasConfirmed = await dialog({
      title: "Please confirm",
      description: "Are you sure you want to do this?",
    })
    if (userHasConfirmed) {
      // Perform Delete
    }
  }

  return <Button onClick={async () => deleteEntity()}>Delete Entity</Button>
}
