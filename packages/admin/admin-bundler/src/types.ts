import { AdminOptions } from "@medusajs/types"

export type BundlerOptions = Required<Pick<AdminOptions, "path">> &
  Pick<AdminOptions, "vite" | "backendUrl" | "storefrontUrl" | "maxUploadFileSize"> & {
    outDir: string
    sources?: string[]
    plugins?: string[]
  }
