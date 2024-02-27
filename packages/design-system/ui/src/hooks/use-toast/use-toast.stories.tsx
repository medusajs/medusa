import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@/components/button"
import { Toaster } from "@/components/toaster"
import { useToast } from "./use-toast"

const Demo = () => {
  const { toast } = useToast()

  const handleUndo = async () => {
    // Wait 3 seconds then resolve with true
    const confirmed = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 3000)
    })

    return confirmed
  }

  const handleSchedule = () => {
    const onAction = async (fn: (update: any) => void) => {
      fn({
        title: "Processing",
        description: "Removing post from queue.",
        variant: "loading",
        disableDismiss: true,
        action: undefined,
      })

      const confirmed = await handleUndo().then((confirmed) => {
        if (confirmed) {
          fn({
            title: "Success",
            description: "Your post was successfully removed from the queue.",
            variant: "success",
            disableDismiss: false,
          })
        } else {
          fn({
            title: "Error",
            description:
              "Something went wrong, and your post was not removed from the queue. Try again.",
            variant: "error",
            disableDismiss: false,
          })
        }
      })
    }

    const t = toast({
      title: "Scheduled",
      description: "Your post has been scheduled for 12:00 PM",
      variant: "success",
      action: {
        label: "Undo",
        onClick: () => onAction(t.update),
        altText:
          "Alternatively, you can undo this action by navigating to the scheduled posts page, and clicking the unschedule button.",
      },
    })
  }

  return (
    <div className="min-w-screen flex min-h-screen flex-col items-center justify-center">
      <Button onClick={handleSchedule}>Schedule</Button>
      <Toaster />
    </div>
  )
}

const meta: Meta<typeof Demo> = {
  title: "Hooks/useToast",
  component: Demo,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Demo>

export const Default: Story = {}
