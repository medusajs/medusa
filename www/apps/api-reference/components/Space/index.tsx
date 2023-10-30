type SpaceProps = {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

const Space = ({ top = 0, bottom = 0, left = 0, right = 0 }: SpaceProps) => {
  return (
    <div
      className="w-full"
      style={{
        height: `1px`,
        marginTop: `${top ? top - 1 : top}px`,
        marginBottom: `${bottom ? bottom - 1 : bottom}px`,
        marginLeft: `${left}px`,
        marginRight: `${right}px`,
      }}
    ></div>
  )
}

export default Space
