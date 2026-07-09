import { ArrowsPointingOut, CircleSliders } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useEffect, useRef } from "react"

export interface TieredPriceControlsProps {
  isTiered: boolean
  isAnchor: boolean
  onOpenModal: () => void
  symbolWidth?: number
}

export const TieredPriceControls = ({
  isTiered,
  isAnchor,
  onOpenModal,
  symbolWidth,
}: TieredPriceControlsProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnchor && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault()
        buttonRef.current?.click()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isAnchor])

  return (
    <div
      className="absolute inset-y-0 z-[3] flex w-fit items-center justify-center"
      style={{
        left: symbolWidth ? `${symbolWidth + 16 + 4}px` : undefined,
      }}
    >
      {isTiered && !isAnchor && (
        <div className="flex size-[15px] items-center justify-center group-hover/container:hidden">
          <CircleSliders className="text-ui-fg-interactive" />
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        className={clx(
          "hover:text-ui-fg-subtle text-ui-fg-muted transition-fg hidden size-[15px] items-center justify-center rounded-md bg-transparent group-hover/container:flex",
          { flex: isAnchor }
        )}
        onClick={onOpenModal}
      >
        <ArrowsPointingOut />
      </button>
    </div>
  )
}
