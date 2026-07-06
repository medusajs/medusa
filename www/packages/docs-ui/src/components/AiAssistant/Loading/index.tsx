import { motion } from "motion/react"
import React, { useEffect, useState } from "react"

interface AiAssistantLoadingProps {
  className?: string
  size?: number
  state?: string
}

const patterns = [
  {
    squares: [
      { row: 1, col: 2, color: "bg-zinc-200" },
      { row: 1, col: 3, color: "bg-zinc-400" },
      { row: 2, col: 1, color: "bg-zinc-200" },
      { row: 2, col: 2, color: "bg-zinc-600" },
      { row: 2, col: 3, color: "bg-zinc-400" },
      { row: 2, col: 4, color: "bg-zinc-200" },
      { row: 3, col: 1, color: "bg-zinc-200" },
      { row: 3, col: 2, color: "bg-zinc-400" },
      { row: 3, col: 3, color: "bg-zinc-600" },
      { row: 3, col: 4, color: "bg-zinc-200" },
      { row: 4, col: 2, color: "bg-zinc-400" },
      { row: 4, col: 3, color: "bg-zinc-200" },
    ],
  },
  {
    squares: [
      { row: 1, col: 1, color: "bg-zinc-500" },
      { row: 1, col: 4, color: "bg-zinc-500" },
      { row: 2, col: 1, color: "bg-zinc-200" },
      { row: 2, col: 2, color: "bg-zinc-400" },
      { row: 2, col: 3, color: "bg-zinc-400" },
      { row: 2, col: 4, color: "bg-zinc-200" },
      { row: 3, col: 1, color: "bg-zinc-200" },
      { row: 3, col: 2, color: "bg-zinc-400" },
      { row: 3, col: 3, color: "bg-zinc-400" },
      { row: 3, col: 4, color: "bg-zinc-200" },
      { row: 4, col: 1, color: "bg-zinc-500" },
      { row: 4, col: 4, color: "bg-zinc-500" },
    ],
  },
  {
    squares: [
      { row: 1, col: 1, color: "bg-zinc-300" },
      { row: 1, col: 2, color: "bg-zinc-300" },
      { row: 1, col: 3, color: "bg-zinc-300" },
      { row: 1, col: 4, color: "bg-zinc-300" },
      { row: 2, col: 1, color: "bg-zinc-400" },
      { row: 2, col: 2, color: "bg-zinc-400" },
      { row: 2, col: 3, color: "bg-zinc-400" },
      { row: 2, col: 4, color: "bg-zinc-400" },
      { row: 3, col: 1, color: "bg-zinc-500" },
      { row: 3, col: 2, color: "bg-zinc-500" },
      { row: 3, col: 3, color: "bg-zinc-500" },
      { row: 3, col: 4, color: "bg-zinc-500" },
      { row: 4, col: 1, color: "bg-zinc-200" },
      { row: 4, col: 2, color: "bg-zinc-200" },
      { row: 4, col: 3, color: "bg-zinc-200" },
      { row: 4, col: 4, color: "bg-zinc-200" },
    ],
  },
  {
    squares: [
      { row: 1, col: 2, color: "bg-zinc-300" },
      { row: 1, col: 3, color: "bg-zinc-200" },
      { row: 2, col: 1, color: "bg-zinc-200" },
      { row: 2, col: 2, color: "bg-zinc-500" },
      { row: 2, col: 3, color: "bg-zinc-500" },
      { row: 3, col: 2, color: "bg-zinc-300" },
      { row: 3, col: 3, color: "bg-zinc-400" },
      { row: 4, col: 1, color: "bg-zinc-400" },
      { row: 4, col: 2, color: "bg-zinc-300" },
      { row: 4, col: 4, color: "bg-zinc-200" },
    ],
  },
  {
    squares: [
      { row: 1, col: 2, color: "bg-zinc-200" },
      { row: 1, col: 3, color: "bg-zinc-300" },
      { row: 1, col: 4, color: "bg-zinc-400" },
      { row: 2, col: 2, color: "bg-zinc-400" },
      { row: 2, col: 3, color: "bg-zinc-500" },
      { row: 2, col: 4, color: "bg-zinc-500" },
      { row: 3, col: 2, color: "bg-zinc-500" },
      { row: 3, col: 3, color: "bg-zinc-400" },
      { row: 3, col: 4, color: "bg-zinc-200" },
      { row: 4, col: 1, color: "bg-zinc-300" },
    ],
  },
  {
    squares: [
      { row: 1, col: 1, color: "bg-zinc-300" },
      { row: 2, col: 1, color: "bg-zinc-400" },
      { row: 2, col: 2, color: "bg-zinc-400" },
      { row: 2, col: 3, color: "bg-zinc-400" },
      { row: 3, col: 1, color: "bg-zinc-500" },
      { row: 3, col: 3, color: "bg-zinc-500" },
      { row: 3, col: 4, color: "bg-zinc-500" },
      { row: 4, col: 2, color: "bg-zinc-200" },
      { row: 4, col: 3, color: "bg-zinc-200" },
    ],
  },
]

const colorMap = {
  "bg-zinc-200": "#e4e4e7",
  "bg-zinc-300": "#d4d4d8",
  "bg-zinc-400": "#a1a1aa",
  "bg-zinc-500": "#71717a",
  "bg-zinc-600": "#52525b",
}

export function AiAssistantLoading() {
  const [currentPattern, setCurrentPattern] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPattern((prev) => (prev + 1) % patterns.length)
    }, 800)

    return () => clearInterval(interval)
  }, [])

  const allPositions = []
  for (let row = 1; row <= 4; row++) {
    for (let col = 1; col <= 4; col++) {
      allPositions.push({ row, col })
    }
  }

  const currentSquares = patterns[currentPattern].squares

  return (
    <div className="relative shrink-0 size-[15px]">
      <div className="absolute gap-[1.5px] grid grid-cols-[fit-content(100%)_fit-content(100%)_fit-content(100%)_fit-content(100%)] grid-rows-[fit-content(100%)_fit-content(100%)_fit-content(100%)_fit-content(100%)] left-1/2 size-[12.5px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
        {allPositions.map(({ row, col }) => {
          const square = currentSquares.find(
            (s) => s.row === row && s.col === col
          )

          return (
            <motion.div
              key={`${row}-${col}`}
              className={`[grid-area:${row}_/_${col}] shrink-0 size-[2px]`}
              animate={{
                backgroundColor: square
                  ? colorMap[square.color as keyof typeof colorMap]
                  : "rgba(0, 0, 0, 0)",
                opacity: square ? 1 : 0,
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export const BuildingLoader: React.FC<AiAssistantLoadingProps> = ({
  className = "",
  state = "Loading",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-docs_0.5 mt-docs_1 ${className}`}
    >
      <AiAssistantLoading />

      <div className="relative overflow-hidden">
        <span className="txt-small-plus text-ui-fg-subtle">
          {state ? `${state}...` : ""}
        </span>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
