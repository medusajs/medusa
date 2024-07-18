export interface AdminCreateCollection {
  title: string
  handle?: string
  metadata?: Record<string, any>
}

export interface AdminUpdateCollection {
  title?: string
  handle?: string
  metadata?: Record<string, any>
}

export interface AdminUpdateCollectionProducts {
  add?: string[]
  remove?: string[]
}
