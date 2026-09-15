"use client"

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Loading } from "@/components/Loading"
import mermaid from "mermaid"
import type { RenderResult } from "mermaid"
import { Controlled as ControlledZoom } from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import clsx from "clsx"
import icons from "./icons.json"

type MermaidDiagramProps = {
  diagramContent: string
}

const VIEWBOX_REGEX =
  /viewBox="([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)"/

export const MermaidDiagram = ({ diagramContent }: MermaidDiagramProps) => {
  const [result, setResult] = useState<RenderResult | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const mermaidId = useRef(
    `mermaid-svg-${Math.round(Math.random() * 10000000)}`
  ).current!

  useEffect(() => {
    mermaid.registerIconPacks([
      {
        name: icons.prefix,
        loader: async () => icons,
      },
    ])

    mermaid.initialize({
      theme: "base",
      themeVariables: {
        primaryColor: "#FFF",
        primaryBorderColor: "#D4D4D8",
        secondaryColor: "#FFF",
        tertiaryColor: "#FFF",
        nodeBorder: "#D4D4D8",
        mainBkg: "#FFF",
        secondBkg: "#FFF",
        tertiaryBkg: "#FFF",
        lineColor: "#71717A",
        primaryTextColor: "#18181B",
        secondaryTextColor: "#18181B",
        tertiaryTextColor: "#18181B",
        edgeLabelBackground: "#FAFAFA",
        textColor: "rgba(82, 82, 91, 1)",
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
      },
      sequence: {
        mirrorActors: false,
      },
    })

    mermaid
      .render(mermaidId, diagramContent)
      .then(setResult)
      .catch((e) =>
        console.error(
          `An error occurred while rendering Mermaid.js diagram. Content: \n ${diagramContent}\n Error: ${e}`
        )
      )
  }, [mermaidId, diagramContent])

  const viewBox = useMemo(() => {
    const matchedRegex = result ? VIEWBOX_REGEX.exec(result.svg) : undefined

    if (!matchedRegex) {
      return undefined
    }

    const [, x, y, width, height] = matchedRegex

    return { value: `${x} ${y} ${width} ${height}`, width, height }
  }, [result])

  const handleZoomChange = useCallback((shouldZoom: boolean) => {
    setIsZoomed(shouldZoom)
  }, [])

  return (
    <Suspense fallback={<Loading />}>
      <ControlledZoom
        isZoomed={isZoomed}
        onZoomChange={handleZoomChange}
        classDialog={clsx(
          "[&_data-rmiz-modal-img]:!top-0 [&_data-rmiz-modal-img]:!left-0 [&_data-rmiz-modal-img]:!transform-x-0",
          ["[&_data-rmiz-modal-img]:!transform-y-0 [&_data-rmiz-modal-img]:"]
        )}
      >
        <div
          className={clsx(
            "bg-medusa-bg-subtle rounded-docs_DEFAULT my-docs_1",
            "flex items-center justify-center overflow-hidden",
            isZoomed ? "h-screen w-screen" : "aspect-video w-full"
          )}
        >
          <svg
            dangerouslySetInnerHTML={result ? { __html: result.svg } : undefined}
            viewBox={viewBox?.value}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: viewBox ? `${viewBox.width}px` : "100%" }}
            className="h-auto max-h-full max-w-full"
          />
        </div>
      </ControlledZoom>
    </Suspense>
  )
}
