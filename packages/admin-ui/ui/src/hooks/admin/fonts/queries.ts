import { Font } from "../../../types/shared"
import { fonts } from "./fonts"

export const useFontsList = (): { fonts: Font[] } => {
  // Note: keeping this in case we want to use the Google Fonts API to download the fonts CSS again
  // let apiUrl = `https://fonts.googleapis.com/css?family=`
  // fonts.forEach((font) => {
  //   const fontName = font.family.replace(/ /g, "+")
  //   apiUrl += `${fontName}:100,200,300,400,500,600,700,800,900|`
  // })

  return { fonts } as { fonts: Font[] }
}

// Note: this ex an example of how to use the Google Fonts API key in a React Query hook, but we are instead using the fonts list from the local fonts.ts file.
// import { useQuery, UseQueryOptions } from "react-query"
// import axios from "axios"

// export const useFontList = (
//   options?: Omit<
//     UseQueryOptions<any, Error, any, "fontList">,
//     "queryKey" | "queryFn"
//   >
// ) => {

//   const { data, refetch, ...rest } = useQuery(
//     "fontList",
//     async () => {
//       const response = await axios.get(
//         `https://www.googleapis.com/webfonts/v1/webfonts?key=${
//           import.meta.env.VITE_GOOGLE_FONTS_API_KEY
//         }`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       return response.data
//     },
//     options
//   )

//   return { ...data, ...rest, refetch }
// }
