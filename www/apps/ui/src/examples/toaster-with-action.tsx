import { Button, Toaster, toast } from "@medusajs/ui"

export default function ToasterWithAction() {
  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast.success("Created Product", {
            description: "The product has been created.",
            action: {
              altText: "Undo product creation",
              onClick: () => {},
              label: "Undo",
            },
            duration: 10000,
          })
        }
      >
        Show
      </Button>
    </>
  )
}
