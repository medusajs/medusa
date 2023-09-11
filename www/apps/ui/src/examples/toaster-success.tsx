import { Button, Toaster, useToast } from "@medusajs/ui"

export default function ToasterSuccess() {
  const { toast } = useToast()

  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "Success",
            description: "The quick brown fox jumps over the lazy dog.",
            variant: "success",
            duration: 5000,
          })
        }
      >
        Show
      </Button>
    </>
  )
}
