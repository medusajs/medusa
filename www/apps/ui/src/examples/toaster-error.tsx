import { Button, Toaster, useToast } from "@medusajs/ui"

export default function ToasterError() {
  const { toast } = useToast()

  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "Error",
            description: "The quick brown fox jumps over the lazy dog.",
            variant: "error",
            duration: 5000,
          })
        }
      >
        Show
      </Button>
    </>
  )
}
