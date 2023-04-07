import React from "react"
import { useHotkeys } from "react-hotkeys-hook"

type HotKeyActionProps = {
  label: string
  hotKey: string
  icon: React.ReactNode
  onAction: (keyboardEvent: KeyboardEvent, hotkeysEvent: any) => void | boolean
}

const HotKeyAction = ({ label, hotKey, icon, onAction }: HotKeyActionProps) => {
  useHotkeys(hotKey, onAction, {})
  return (
    <div className="flex items-center gap-2">
      <span className="text-grey-0 inter-small-semibold">{label}</span>
      <div className="inter-small-semibold text-grey-30 bg-grey-70 flex h-[24px] w-[24px] items-center justify-center rounded">
        {icon}
      </div>
    </div>
  )
}

export default HotKeyAction
