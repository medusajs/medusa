import { HookRegistryItem } from "@/types/hooks"
import * as React from "react"

export const HookRegistry: Record<string, HookRegistryItem> = {
  ToasterToast: {
    table: React.lazy(async () => import("../props/hooks/ToasterToast")),
  },
  usePrompt: {
    table: React.lazy(async () => import("../props/hooks/usePrompt")),
  },
  useToggleState: {
    table: React.lazy(async () => import("../props/hooks/useToggleState")),
  },
}
