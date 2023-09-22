import { Button, Toaster, useToast } from "@medusajs/ui"

export default function ToasterWarning() {
  const { toast } = useToast()

  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "Warning",
            description: "The quick brown fox jumps over the lazy dog.",
            variant: "warning",
            duration: 5000,
          })
        }
      >
        Show
      </Button>
    </>
  )
}
