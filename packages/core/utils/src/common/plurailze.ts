import pluralizeEN from "pluralize"
pluralizeEN.addUncountableRule("info")
/**
 * Function to pluralize English words.
 * @param word
 */
export function pluralize(word: string): string {
  // TODO: Implement language specific pluralize function
  return pluralizeEN(word)
}

export function singularize(word: string): string {
  return pluralizeEN.singular(word)
}
