import { Base64 } from "js-base64"

export interface ImgProxyConstructorProps {
  key?: string
  salt?: string
  url: string
}

// See https://docs.imgproxy.net/generating_the_url to understand the options available.
export interface ImgProxyOptions {
  "min-width"?: number
  "min-height"?: number
  width?: number
  height?: number
  zoom?: number
  enlarge?: 1 | "t" | true
  resizing_type?: "fit" | "fill" | "fill-down" | "force" | "auto"
  extension?: "jpg" | "png" | "webp"
}

const urlSafeBase64 = (string: string) => {
  return Base64.encodeURI(string)
}

export class ImgProxy {
  constructor({ key, salt, url }: ImgProxyConstructorProps) {
    this.key = key
    this.salt = salt
    this.url = url
  }

  // Used for signing the payload
  private key?: string
  private salt?: string
  private url: string

  public getUrl(imageUrl: string, options: ImgProxyOptions): string {
    const slug = `${this.buildOptionsSlug(options)}/${urlSafeBase64(
      imageUrl
    )}${this.buildExtension(options)}`
    return `${this.url}/${this.buildSignature(slug)}/${slug}`
  }

  /**
   * Imgproxy provides a way to keep other people from using your server for resizing/manipulating images by signing the requests using a key and a salt.
   * But to enable that, we would need to add a lot of polyfills to our bundle for the node 'crypto' package to create SHA-256 hashes.
   * My thought is, let's add that security when we need it. For now I'm leaving our imgproxy instance insecure.
   * @param options
   * @returns
   */
  //
  private buildSignature(slug: string): string {
    return "insecure"
  }

  private buildExtension({ extension }: ImgProxyOptions): string {
    return extension ? `.${extension}` : ""
  }

  private buildOptionsSlug(options: ImgProxyOptions): string {
    const { extension, ...rest } = options
    const entries = Object.entries(rest)
    return entries.map(([key, value]) => `${key}:${value}`).join("/")
  }
}

const url = "https://img.cdn.market.haus"

export const imgProxy = new ImgProxy({ url })

export const imageProxyContexts = {
  tiny_square: {
    width: 360,
    height: 360,
  },
  small_square: {
    width: 720,
    height: 720,
  },
  medium_square: {
    width: 1080,
    height: 1080,
  },
  large_square: {
    width: 1440,
    height: 1440,
  },
  header_logo: {
    height: 108,
    width: 0,
  },
  post_header: {
    width: 1440,
    height: 0,
  },
  // Add additional contexts here as needed...
} as const

export type ImageProxyContextsKey = keyof typeof imageProxyContexts

export interface ImageProxyURLOptions extends ImgProxyOptions {
  context?: ImageProxyContextsKey
}

export const imageProxyDefaultOptions: ImgProxyOptions = {
  extension: "webp",
  resizing_type: "fit",
}

export const imageProxyURL = (
  imageURL: string,
  options?: ImageProxyURLOptions
) => {
  if (!imageURL || imageURL.startsWith("http://localhost")) return imageURL
  const { context = "medium_square", ...restOptions } = options || {}
  return imgProxy.getUrl(imageURL, {
    ...imageProxyDefaultOptions,
    ...(context ? imageProxyContexts[context] : {}),
    ...restOptions,
  })
}
