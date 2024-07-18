export const TrackingLink = ({ trackingLink }) => {
  if (trackingLink.url) {
    return (
      <a
        style={{ textDecoration: "none" }}
        target="_blank"
        href={trackingLink.url}
        rel="noreferrer"
      >
        <div className="text-blue-60 ms-2">{trackingLink.tracking_number} </div>
      </a>
    )
  } else {
    return (
      <span className="text-blue-60 ms-2">{trackingLink.tracking_number} </span>
    )
  }
}
