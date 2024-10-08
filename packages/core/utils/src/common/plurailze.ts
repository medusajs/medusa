import pluralizeEN from "pluralize"

/**
 * Function to pluralize English words.
 * @param word
 */
export function pluralize(word: string): string {
  // TODO: Implement language specific pluralize function
  return pluralizeEN(word)
}
