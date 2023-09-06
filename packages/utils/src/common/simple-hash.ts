// DJB2 hash function
export function simpleHash(text: string): string {
  let hash = 5381
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) + hash + text.charCodeAt(i)
  }
  return hash.toString(16)
}
