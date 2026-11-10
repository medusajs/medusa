import { MemoryStore } from "../store/memory/memory-store"
import { runStoreConformance } from "../store/conformance"

runStoreConformance(
  "MemoryStore",
  async () => ({ store: new MemoryStore() }),
  undefined,
  { multiProcess: false }
)
