import { Button, Toaster, useToast } from "@medusajs/ui"

export default function ToasterWithAction() {
  const { toast } = useToast()

  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "Created Product",
            description: "The product has been created.",
            variant: "success",
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
