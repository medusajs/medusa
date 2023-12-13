type TProps = {
  trackingLink: {
    url: string
    tracking_number: string
    fulfillment_id: string
    idempotency_key: string
    metadata: Record<string, string>
  }
}

export const TrackingLink = ({ trackingLink }: TProps) => {
  if (trackingLink?.url) {
    return (
      <div className="flex flex-row">
        <a
          style={{ textDecoration: "none" }}
          target="_blank"
          href={trackingLink.url}
          rel="noreferrer"
        >
          <div className="text-blue-60">{trackingLink.tracking_number}</div>
        </a>
        &nbsp;-&nbsp;
        {trackingLink?.metadata?.labelBase64PDF &&
        trackingLink?.metadata?.labelBase64PDF.length > 100 &&
        trackingLink?.metadata?.labelBase64PDF.includes(
          "data:application/pdf;base64,JVB"
        ) ? (
          <a
            style={{ textDecoration: "none" }}
            target="_blank"
            download={`${trackingLink.tracking_number}.pdf`}
            href={trackingLink.metadata.labelBase64PDF}
            rel="noreferrer"
          >
            Download label
          </a>
        ) : (
          trackingLink?.metadata?.labelUrl && (
            <a
              style={{ textDecoration: "none" }}
              target="_blank"
              href={trackingLink.metadata.labelUrl}
              rel="noreferrer"
            >
              Download label
            </a>
          )
        )}
      </div>
    )
  } else {
    return (
      <span className="text-blue-60 ml-2">{trackingLink.tracking_number} </span>
    )
  }
}
