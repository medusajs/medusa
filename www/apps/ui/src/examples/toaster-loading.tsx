import { Button, Toaster, toast } from "@medusajs/ui"

export default function ToasterLoading() {
  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast.loading("Loading", {
            description: "The quick brown fox jumps over the lazy dog.",
            duration: 5000,
          })
        }
      >
        Show
      </Button>
    </>
  )
}
