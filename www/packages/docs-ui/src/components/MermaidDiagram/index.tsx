"use client"
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Loading } from "@/components"
import mermaid from "mermaid"
import type { RenderResult } from "mermaid"
import { Controlled as ControlledZoom } from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import clsx from "clsx"

type MermaidDiagramProps = {
  diagramContent: string
}

const VIEWBOX_REGEX = /viewBox="([0-9.-]+\s*){4}"/

export const MermaidDiagram = ({ diagramContent }: MermaidDiagramProps) => {
  const [result, setResult] = useState<RenderResult | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const mermaidId = useRef(
    `mermaid-svg-${Math.round(Math.random() * 10000000)}`
  ).current!

  useEffect(() => {
    mermaid.mermaidAPI.initialize()

    mermaid
      .render(mermaidId, diagramContent)
      .then(setResult)
      .catch((e) =>
        console.error(
          `An error occurred while rendering Mermaid.js diagram. Content: \n ${diagramContent}\n Error: ${e}`
        )
      )
  }, [mermaidId, diagramContent])

  const matchedRegex = useMemo(() => {
    return result ? VIEWBOX_REGEX.exec(result.svg) : undefined
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
        <svg
          dangerouslySetInnerHTML={result ? { __html: result.svg } : undefined}
          width={isZoomed ? "100vw" : "100%"}
          height={
            isZoomed
              ? `100vh`
              : matchedRegex && matchedRegex.length >= 1
              ? `${matchedRegex[1]}px`
              : "100%"
          }
        />
      </ControlledZoom>
    </Suspense>
  )
}
