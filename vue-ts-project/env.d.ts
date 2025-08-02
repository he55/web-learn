/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MY_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
