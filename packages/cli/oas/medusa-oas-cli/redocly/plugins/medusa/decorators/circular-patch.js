module.exports = CircularPatch

/**
 * Since ref() is triggered upon reaching a $ref OAS line (leaf),
 * we want to inverse `schemas` instructions in order to optimize iterators.
 */
function preparePatches(schemas) {
  const patches = []
  const patchesObj = {}
  for (const schemaToPatch in schemas) {
    for (const schemaName of schemas[schemaToPatch]) {
      if (!patchesObj[schemaName]) {
        patchesObj[schemaName] = {
          schemaName,
          schemaPointer: `#/components/schemas/${schemaName}`,
          schemaToPatchPointers: [],
        }
      }
      const schemaToPatchPointer = `#/components/schemas/${schemaToPatch}`
      if (
        !patchesObj[schemaName].schemaToPatchPointers.includes(
          schemaToPatchPointer
        )
      ) {
        patchesObj[schemaName].schemaToPatchPointers.push(schemaToPatchPointer)
      }
    }
  }
  for (const key in patchesObj) {
    patches.push(patchesObj[key])
  }
  return patches
}

function applyPatch(node, schemaName) {
  delete node["$ref"]
  node.type = "object"
  if (!node.description && schemaName) {
    node.description = `${schemaName} object.`
  }
}

function CircularPatch({ schemas = {}, verbose = false }) {
  const logs = []
  const patches = preparePatches(schemas)
  const refPathPrefix = "#/components/schemas/"
  const refPathPrefixLength = refPathPrefix.length
  const refPathPrefixRegex = /#\/components\/schemas\/\w+/
  return {
    ref(ref, ctx, resolved) {
      if (
        ctx.type.name.toLowerCase() !== "schema" ||
        !resolved?.location?.pointer
      ) {
        return
      }
      for (const patch of patches) {
        if (resolved.location.pointer.replaceAll("\n", "") !== patch.schemaPointer) {
          continue
        }
        const pointerMatch = ctx.location.pointer.match(refPathPrefixRegex) || 
          resolved.location.pointer.match(refPathPrefixRegex)
        if (!pointerMatch.length) {
          continue
        }
        if (!patch.schemaToPatchPointers.includes(pointerMatch[0])) {
          continue
        }
        applyPatch(ref)
        if (verbose) {
          logs.push(
            `${pointerMatch[0].substring(refPathPrefixLength)} patch $ref to ${
              patch.schemaName
            }`
          )
        }
      }
    },
    Root: {
      leave() {
        if (verbose) {
          logs.sort()
          for (const log of logs) {
            console.debug(log)
          }
        }
      },
    },
  }
}
