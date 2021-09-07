export const formatRoute = string => {
  return string.replace(/{(.*?)}/g, ":$1")
}
