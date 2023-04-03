import React, { useState } from "react"
import Button from "../../fundamentals/button"
import DiscordIcon from "../../fundamentals/icons/discord-icon"
import InputField from "../../molecules/input"
import TextArea from "../../molecules/textarea"

import * as Dialog from "@radix-ui/react-dialog"

type MailDialogProps = {
  onClose: () => void
  open: boolean
}

const MailDialog = ({ open, onClose }: MailDialogProps) => {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [link, setLink] = useState("mailto:support@medusajs.com")

  React.useEffect(() => {
    setLink(
      `mailto:support@medusajs.com?subject=${encodeURI(
        subject
      )}&body=${encodeURI(body)}`
    )
  }, [subject, body])

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed top-0 left-0 right-0 bottom-0 z-50 grid place-items-end overflow-y-auto">
        <Dialog.Content className="bg-grey-0 shadow-dropdown rounded-rounded fixed top-[64px] bottom-2 right-3 flex w-[400px] flex-col justify-between p-8">
          <div>
            <Dialog.Title className="inter-xlarge-semibold mb-1">
              How can we help?
            </Dialog.Title>
            <Dialog.Description className="inter-small-regular text-grey-50 mb-6">
              We usually respond in a few hours
            </Dialog.Description>
            <InputField
              label={"Subject"}
              value={subject}
              className="mb-4"
              placeholder="What is it about?..."
              onChange={(e) => setSubject(e.target.value)}
            />
            <TextArea
              label={"How can we help?"}
              placeholder="Write a message..."
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
              }}
              rows={8}
              enableEmoji
            />
          </div>
          <div className="gap-y-base flex flex-col items-center">
            <a
              href="https://discord.gg/medusajs"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full cursor-pointer"
            >
              <div className="rounded-rounded group-hover:bg-grey-5 py-small flex w-full flex-col items-center justify-center">
                <span className="text-grey-40 mb-3">
                  <DiscordIcon size={24} />
                </span>
                <p className="text-grey-40 inter-small-regular text-center leading-6">
                  Feel free to join our community of
                  <br />
                  merchants and e-commerce developers
                </p>
              </div>
            </a>
            <a className="w-full" href={link}>
              <Button variant="primary" size="large" className="w-full">
                Send a message
              </Button>
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  )
}

export default MailDialog
