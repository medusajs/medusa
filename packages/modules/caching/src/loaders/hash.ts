import { asValue } from "awilix"

export default async ({ container }) => {
  const xxhashhWasm = await import("xxhash-wasm")
  const { h64ToString } = await xxhashhWasm.default()

  container.register("hasher", asValue(h64ToString))
}
