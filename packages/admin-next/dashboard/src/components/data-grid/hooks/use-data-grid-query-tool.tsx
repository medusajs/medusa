import { RefObject, useEffect, useRef } from "react"

import { DataGridQueryTool } from "../models"

export const useDataGridQueryTool = (containerRef: RefObject<HTMLElement>) => {
  const queryToolRef = useRef<DataGridQueryTool | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      queryToolRef.current = new DataGridQueryTool(containerRef.current)
    }
  }, [containerRef])

  return queryToolRef.current
}
