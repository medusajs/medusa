import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@/components/button"
import { toast } from "@/utils/toast"
import { Toaster } from "./toaster"

const meta: Meta<typeof Toaster> = {
  title: "Components/Toaster",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  render: (args) => {
    const makeMessageToast = () => {
      toast("This is a message toast.")
    }

    const makeInfoToast = () => {
      toast.info("This is an info toast.")
    }

    const makeSuccessToast = () => {
      toast.success("This is a success toast.")
    }

    const makeWarningToast = () => {
      toast.warning("This is a warning toast.")
    }

    const makeErrorToast = () => {
      toast.error("This is an error toast.")
    }

    const makeActionToast = () => {
      toast.error("This is an error toast with an action.", {
        action: {
          label: "Retry",
          altText: "Retry the request",
          onClick: () => {
            console.log("Retrying the request...")
          },
        },
      })
    }

    const doAsyncStuff = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            resolve("Success!")
          } else {
            reject("Failed!")
          }
        }, 3000)
      })
    }

    const makeAsyncToast = async () => {
      toast.promise(doAsyncStuff, {
        loading: "Loading...",
        success: "Success!",
        error: "Failed!",
      })
    }

    const makeUpdatingToast = () => {
      let id: number | string = Math.random()

      const retry = async () => {
        const coinFlip = Math.random() > 0.5

        console.log("retrying", id)

        toast.loading("Request in progress", {
          id: id,
          description: "The request is in progress.",
        })

        // wait 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000))

        if (coinFlip) {
          toast.success("Request succeeded", {
            id: id,
            description: "The request succeeded.",
          })
        } else {
          toast.error("Request failed", {
            id: id,
            description:
              "Insert the description here. Can be semi-long and still work.",
            action: {
              label: "Retry",
              altText: "Retry the request",
              onClick: retry,
            },
          })
        }
      }

      toast.error("Request failed", {
        id: id,
        description:
          "Insert the description here. Can be semi-long and still work.",
        action: {
          label: "Retry",
          altText: "Retry the request",
          onClick: retry,
        },
      })
    }

    return (
      <div className="size-full">
        <div className="flex flex-col gap-y-2">
          <Button size="small" variant="secondary" onClick={makeMessageToast}>
            Make message toast
          </Button>
          <Button size="small" variant="secondary" onClick={makeInfoToast}>
            Make info toast
          </Button>
          <Button size="small" variant="secondary" onClick={makeSuccessToast}>
            Make success toast
          </Button>
          <Button size="small" variant="secondary" onClick={makeWarningToast}>
            Make warning toast
          </Button>
          <Button size="small" variant="secondary" onClick={makeErrorToast}>
            Make error toast
          </Button>
          <Button size="small" variant="secondary" onClick={makeActionToast}>
            Make action toast
          </Button>
          <Button size="small" variant="secondary" onClick={makeUpdatingToast}>
            Make toast
          </Button>
          <Button size="small" variant="secondary" onClick={makeAsyncToast}>
            Make async toast
          </Button>
        </div>
        <Toaster {...args} />
      </div>
    )
  },
}

export default meta

type Story = StoryObj<typeof Toaster>

export const TopRight: Story = {
  args: {
    position: "top-right",
  },
}

export const TopCenter: Story = {
  args: {
    position: "top-center",
  },
}

export const TopLeft: Story = {
  args: {
    position: "top-left",
  },
}

export const BottomRight: Story = {
  args: {
    position: "bottom-right",
  },
}

export const BottomCenter: Story = {
  args: {
    position: "bottom-center",
  },
}

export const BottomLeft: Story = {
  args: {
    position: "bottom-left",
  },
}
