import React from "react"

export const TrackingLink = ({ trackingLink }) => {
  if (trackingLink.url) {
    return (
      <a
        style={{ textDecoration: "none" }}
        target="_blank"
        href={trackingLink.url}
      >
        <div className="text-violet-60">{trackingLink.tracking_number}</div>
      </a>
    )
  } else {
    return (
      <span className="text-violet-60">{trackingLink.tracking_number}</span>
    )
  }
}
