import React from "react"
import { Button } from "@/components"
import { Sparkles } from "@medusajs/icons"
import { useAiAssistant } from "../../../providers/AiAssistant"

export const NavbarAiAssistantButton = () => {
  const { setOpen } = useAiAssistant()

  return (
    <Button variant="secondary" onClick={() => setOpen(true)}>
      <Sparkles className="text-fg-medusa-subtle" />
      <span>AI Assistant</span>
    </Button>
  )
}
