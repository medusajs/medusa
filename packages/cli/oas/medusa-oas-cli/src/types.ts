type ApiType = "store" | "admin" | "combined"

type CircularReferenceSchema = Record<string, string[]>

type CircularReferenceConfig = {
  decorators: {
    "medusa/circular-patch": {
      schemas: CircularReferenceSchema
    }
  }
}
