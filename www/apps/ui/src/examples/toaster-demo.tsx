import { Button, Toaster, useToast } from "@medusajs/ui"

export default function ToasterDemo() {
  const { toast } = useToast()

  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "Info",
            description: "The quick brown fox jumps over the lazy dog.",
          })
        }
      >
        Show
      </Button>
    </>
  )
}
