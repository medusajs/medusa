export const consolidateImages = (images, uploaded) => {
  const result: any[] = []
  let i = 0
  let j = 0
  for (i = 0; i < images.length; i++) {
    const image = images[i].url
    if (image.startsWith("blob")) {
      result.push(uploaded[j])
      j++
    } else {
      result.push(image)
    }
  }
  return result
}
