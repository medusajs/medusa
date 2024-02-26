/**
 * Some library provide pluralize function with language specific rules.
 * This is a simple implementation of pluralize function.
 * @param word
 */
export function pluralize(word: string): string {
  // Add basic rules for forming plurals
  if (
    //word.endsWith("s") ||
    word.endsWith("sh") ||
    word.endsWith("ss") ||
    word.endsWith("ch") ||
    word.endsWith("x") ||
    word.endsWith("o") ||
    word.endsWith("z")
  ) {
    return word + "es"
  } else if (word.endsWith("y") && !"aeiou".includes(word[word.length - 2])) {
    return word.slice(0, -1) + "ies"
  } else if (word.endsWith("es")) {
    return word
  } else if (word.endsWith("fe")) {
    return word.slice(0, -2) + "ves"
  } else {
    return word + "s"
  }
}
