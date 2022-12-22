import React from "react"

export const TrackingLink = ({ trackingLink }) => {
  if (trackingLink.url) {
    return (
      <a
        style={{ textDecoration: "none" }}
        target="_blank"
        href={trackingLink.url}
      >
        <div className="text-blue-60 ml-2">{trackingLink.tracking_number} </div>
      </a>
    )
  } else {
    return (
      <span className="text-blue-60 ml-2">{trackingLink.tracking_number} </span>
    )
  }
}
