// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MEDUSA_ADMIN_BACKEND_URL: string
  readonly MEDUSA_V2: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
