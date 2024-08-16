"use client"

import clsx from "clsx"
import {
  useAnimationControls,
  useDragControls,
  useMotionValue,
  motion,
} from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import { ArrowPathMini, MinusMini, PlusMini } from "@medusajs/icons"
import { DropdownMenu, Text } from "@medusajs/ui"
import { createNodeClusters, getNextCluster } from "../../../utils"
import { WorkflowDiagramCanvasDepth } from "./Depth"
import { WorkflowDiagramCommonProps } from "../../.."

type ZoomScale = 0.5 | 0.75 | 1

const defaultState = {
  x: -1000,
  y: -1020,
  scale: 1,
}

const MAX_ZOOM = 1.5
const MIN_ZOOM = 0.5
const ZOOM_STEP = 0.25

export const WorkflowDiagramCanvas = ({
  workflow,
}: WorkflowDiagramCommonProps) => {
  const [zoom, setZoom] = useState<number>(1)
  const [isDragging, setIsDragging] = useState(false)

  const scale = useMotionValue(defaultState.scale)
  const x = useMotionValue(defaultState.x)
  const y = useMotionValue(defaultState.y)

  const controls = useAnimationControls()

  const dragControls = useDragControls()
  const dragConstraints = useRef<HTMLDivElement>(null)

  const canZoomIn = zoom < MAX_ZOOM
  const canZoomOut = zoom > MIN_ZOOM

  useEffect(() => {
    const unsubscribe = scale.on("change", (latest) => {
      setZoom(latest as ZoomScale)
    })

    return () => {
      unsubscribe()
    }
  }, [scale])

  const clusters = createNodeClusters(workflow.steps)

  function scaleXandY(
    prevScale: number,
    newScale: number,
    x: number,
    y: number
  ) {
    const scaleRatio = newScale / prevScale
    return {
      x: x * scaleRatio,
      y: y * scaleRatio,
    }
  }

  const changeZoom = (newScale: number) => {
    const { x: newX, y: newY } = scaleXandY(zoom, newScale, x.get(), y.get())

    setZoom(newScale)
    controls.set({ scale: newScale, x: newX, y: newY })
  }

  const zoomIn = () => {
    const curr = scale.get()

    if (curr < 1.5) {
      const newScale = curr + ZOOM_STEP
      changeZoom(newScale)
    }
  }

  const zoomOut = () => {
    const curr = scale.get()

    if (curr > 0.5) {
      const newScale = curr - ZOOM_STEP
      changeZoom(newScale)
    }
  }

  const resetCanvas = async () => await controls.start(defaultState)

  return (
    <div className="h-[200px] w-full rounded-docs_DEFAULT">
      <div
        ref={dragConstraints}
        className="relative size-full rounded-docs_DEFAULT"
      >
        <div className="relative size-full overflow-hidden object-contain rounded-docs_DEFAULT shadow-elevation-card-rest">
          <div>
            <motion.div
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              drag
              dragConstraints={dragConstraints}
              dragElastic={0}
              dragMomentum={false}
              dragControls={dragControls}
              initial={false}
              animate={controls}
              transition={{ duration: 0.25 }}
              style={{
                x,
                y,
                scale,
              }}
              className={clsx(
                "bg-medusa-bg-subtle relative size-[500rem] origin-top-left items-start justify-start overflow-hidden",
                "bg-[radial-gradient(var(--docs-border-base)_1.5px,transparent_0)] bg-[length:20px_20px] bg-repeat",
                !isDragging && "cursor-grab",
                isDragging && "cursor-grabbing"
              )}
            >
              <main className="size-full">
                <div className="absolute left-[1100px] top-[1100px] flex select-none items-start">
                  {Object.entries(clusters).map(([depth, cluster]) => {
                    const next = getNextCluster(clusters, Number(depth))

                    return (
                      <WorkflowDiagramCanvasDepth
                        cluster={cluster}
                        next={next}
                        key={depth}
                      />
                    )
                  })}
                </div>
              </main>
            </motion.div>
          </div>
        </div>
        <div className="bg-medusa-bg-base shadow-borders-base text-medusa-fg-subtle absolute bottom-docs_1 left-docs_1.5 flex h-[28px] items-center overflow-hidden rounded-docs_sm">
          <div className="flex items-center">
            <button
              onClick={zoomIn}
              type="button"
              disabled={!canZoomIn}
              aria-label="Zoom in"
              className="disabled:text-medusa-fg-disabled transition-fg hover:bg-medusa-bg-base-hover active:bg-medusa-bg-base-pressed focus-visible:bg-medusa-bg-base-pressed border-r p-docs_0.25 outline-none"
            >
              <PlusMini />
            </button>
            <div>
              <DropdownMenu>
                <DropdownMenu.Trigger className="disabled:text-medusa-fg-disabled transition-fg hover:bg-medusa-bg-base-hover active:bg-medusa-bg-base-pressed focus-visible:bg-medusa-bg-base-pressed flex w-[50px] items-center justify-center border-r p-docs_0.25 outline-none">
                  <Text
                    as="span"
                    size="xsmall"
                    leading="compact"
                    className="select-none tabular-nums"
                  >
                    {Math.round(zoom * 100)}%
                  </Text>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-medusa-bg-base">
                  {[50, 75, 100, 125, 150].map((value) => (
                    <DropdownMenu.Item
                      key={value}
                      onClick={() => changeZoom(value / 100)}
                      className="px-docs_0.5 py-[6px]"
                    >
                      {value}%
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
            <button
              onClick={zoomOut}
              type="button"
              disabled={!canZoomOut}
              aria-label="Zoom out"
              className="disabled:text-medusa-fg-disabled transition-fg hover:bg-medusa-bg-base-hover active:bg-medusa-bg-base-pressed focus-visible:bg-medusa-bg-base-pressed border-r p-docs_0.25 outline-none"
            >
              <MinusMini />
            </button>
          </div>
          <button
            onClick={resetCanvas}
            type="button"
            aria-label="Reset canvas"
            className="disabled:text-medusa-fg-disabled transition-fg hover:bg-medusa-bg-base-hover active:bg-medusa-bg-base-pressed focus-visible:bg-medusa-bg-base-pressed p-docs_0.25 outline-none"
          >
            <ArrowPathMini />
          </button>
        </div>
      </div>
    </div>
  )
}
