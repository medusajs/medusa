import React, { useCallback, useEffect, useRef, useState } from "react"
import SendIcon from "../../fundamentals/icons/send-icon"
import EmojiPicker from "../emoji-picker"

type NoteInputProps = {
  onSubmit: (note: string | undefined) => void
}

const NoteInput: React.FC<NoteInputProps> = ({ onSubmit }) => {
  const [note, setNote] = useState<string | undefined>(undefined)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const handleAddEmoji = (emoji: string) => {
    setNote(`${note ? note : ""}${emoji}`)
  }

  const handleSubmit = () => {
    if (onSubmit && note) {
      onSubmit(note)
      setNote("")
    }
  }

  const onKeyDownHandler = useCallback(
    (event) => {
      switch (event.key) {
        case "Enter":
          if(event.ctrlKey) {
            event.preventDefault()
            event.stopPropagation()
            handleSubmit()
            inputRef.current?.blur()
          }
          break
        case "Esc":
        case "Escape":
          inputRef.current?.blur()
          break
        default:
          break
      }
    },
    [note, setNote, onSubmit]
  )

  useEffect(() => {
    if(inputRef.current) {
      inputRef.current.style.height = "0px";
      const scrollHeight = Math.max(inputRef.current.scrollHeight, 20);
      inputRef.current.style.height = scrollHeight + "px";
    }
  }, [note]);

  return (
    <form>
      <div
        className="flex items-end py-xsmall px-small bg-grey-5 border-grey-20 rounded-rounded border"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-end gap-x-small flex-grow">
          <EmojiPicker onEmojiClick={handleAddEmoji} />
          <textarea
            placeholder="Write a note... (Ctrl + Enter to add)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="inter-base-regular placeholder:text-grey-40 flex-grow bg-transparent focus:outline-none"
            ref={inputRef}
            id="note-input"
            autoComplete="off"
            onKeyDown={onKeyDownHandler}
            rows={2}
          />
        </div>
        <button
          className="text-grey-30 hover:text-violet-60"
          type="button"
          onClick={handleSubmit}
        >
          <SendIcon size={20} />
        </button>
      </div>
    </form>
  )
}

export default NoteInput
