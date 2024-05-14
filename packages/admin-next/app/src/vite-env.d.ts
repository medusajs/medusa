// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEDUSA_ADMIN_BACKEND_URL: string
  readonly VITE_MEDUSA_V2: "true" | "false"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __BASE__: string
