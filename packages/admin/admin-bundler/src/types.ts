import { AdminOptions } from "@medusajs/types"

export type BundlerOptions = Required<Pick<AdminOptions, "outDir" | "path">> &
  Pick<AdminOptions, "vite" | "backendUrl" | "storefrontUrl"> & {
    outDir: string
    sources?: string[]
  }
