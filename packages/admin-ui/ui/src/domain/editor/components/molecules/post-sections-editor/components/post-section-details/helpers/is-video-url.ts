export const videoURLRegex =
  /^(https?:\/\/)?((www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)|((player|www)\.)?vimeo\.com\/(video\/)?)([\w-]+)(\S+)?$/

export const isVideoURL = (url: string): boolean => videoURLRegex.test(url)
