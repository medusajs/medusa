import { HookRegistryItem } from "@/types/hooks"
import * as React from "react"

export const HookRegistry: Record<string, HookRegistryItem> = {
  usePrompt: {
    table: React.lazy(async () => import("../props/hooks/usePrompt")),
  },
  useToggleState: {
    table: React.lazy(async () => import("../props/hooks/useToggleState")),
  },
}
