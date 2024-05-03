import { MDXRemote } from "next-mdx-remote/rsc"
import MDXComponents from "../MDXComponents"

type MDXContentProps = {
  children: string
}

const MDXContent = ({ children }: MDXContentProps) => {
  return <MDXRemote source={children} components={MDXComponents} />
}

export default MDXContent
