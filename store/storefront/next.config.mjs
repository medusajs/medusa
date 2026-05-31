/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.medusajs.com" },
      { protocol: "http",  hostname: "localhost" },
    ],
  },
}

export default nextConfig
