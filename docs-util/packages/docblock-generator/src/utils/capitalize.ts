export default function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase()}${str.substring(1).toLowerCase()}`
}
