/**
 * Tracks which external types are referenced in the emitted interfaces,
 * so we can generate the correct import statements for the output file.
 */
export interface ImportTracker {
  needsFindParams: boolean
  needsSelectParams: boolean
  needsBaseFilterable: boolean
  needsOperatorMap: boolean
}

/**
 * Creates an empty ImportTracker with all flags set to false.
 */
export function createImportTracker(): ImportTracker {
  return {
    needsFindParams: false,
    needsSelectParams: false,
    needsBaseFilterable: false,
    needsOperatorMap: false,
  }
}
