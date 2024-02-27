import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@/components/button"
import { Badge } from "../../components/badge"
import { Text } from "../../components/text"
import { usePrompt } from "./use-prompt"

type DemoProps = {
  verificationText?: string
}

const Demo = ({ verificationText }: DemoProps) => {
  const [status, setStatus] = React.useState(false)
  const dialog = usePrompt()

  const handleDangerousAction = async () => {
    const confirmed = await dialog({
      title: "Delete Product",
      description:
        "Are you sure you want to delete this product? This action cannot be undone.",
      verificationText,
      variant: "danger",
    })

    setStatus(confirmed)
  }

  return (
    <div className="flex flex-col items-center gap-y-2">
      <Button variant="danger" onClick={handleDangerousAction}>
        Delete Product
      </Button>
      <Text>
        Status: <Badge>{status ? "Confirmed" : "Unconfirmed"}</Badge>
      </Text>
    </div>
  )
}

const meta: Meta<typeof usePrompt> = {
  title: "Hooks/usePrompt",
  component: Demo,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Demo>

export const Default: Story = {}

export const WithVerificationText: Story = {
  args: {
    verificationText: "product",
  },
}
