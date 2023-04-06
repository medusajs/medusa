import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import Picker, { EmojiStyle, SkinTones } from "emoji-picker-react"
import React from "react"
import Button from "../../fundamentals/button"
import HappyIcon from "../../fundamentals/icons/happy-icon"

type indexProps = {
  onEmojiClick: (emoji: string) => void
}

const EmojiPicker: React.FC<indexProps> = ({ onEmojiClick }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="small"
          type="button"
          className="text-grey-40 hover:text-violet-60 h-5 w-5 p-0 focus:border-none focus:shadow-none"
        >
          <HappyIcon size={20} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={5}
        className="bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown z-30 min-w-[200px] overflow-hidden border"
      >
        <Picker
          onEmojiClick={(emojiData) => onEmojiClick(emojiData.emoji)}
          defaultSkinTone={SkinTones.NEUTRAL}
          emojiStyle={EmojiStyle.NATIVE}
          skinTonesDisabled
          searchPlaceHolder={"Search Emoji..."}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default EmojiPicker
