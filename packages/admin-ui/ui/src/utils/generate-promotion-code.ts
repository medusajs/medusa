import randomize from "randomatic"

export const generatePromotionCode = () => {
  const code = [
    randomize("A0", 4),
    randomize("A0", 4),
    randomize("A0", 4),
    randomize("A0", 4),
  ].join("-")

  return code
}
