/**
 * Tracks which external types are referenced in the emitted interfaces,
 * so we can generate the correct import statements for the output file.
 */
export class ImportTracker {
  needsFindParams = false
  needsSelectParams = false
  needsBaseFilterable = false
  needsOperatorMap = false
}
