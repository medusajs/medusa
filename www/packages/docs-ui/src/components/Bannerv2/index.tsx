import React from "react"
import { Card, Link } from "../.."

export const Bannerv2 = () => {
  return (
    <Card>
      This documentation is for Medusa v2, which isn&apos;t ready for
      production.
      <br />
      <br />
      For production-use, refer to{" "}
      <Link href="https://docs.medusajs.com">this documentation</Link> instead.
    </Card>
  )
}
