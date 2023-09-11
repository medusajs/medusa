import { Button, Toaster, useToast } from "@medusajs/ui"

export default function ToasterLoading() {
  const { toast } = useToast()

  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "Loading",
            description: "The quick brown fox jumps over the lazy dog.",
            variant: "loading",
            duration: 5000,
          })
        }
      >
        Show
      </Button>
    </>
  )
}
