import Paragraph from "@editorjs/paragraph"
import Embed from "@editorjs/embed"
import Table from "@editorjs/table"
// import List from "@editorjs/list"
// import Warning from "@editorjs/warning"
import Code from "@editorjs/code"
// import LinkTool from "@editorjs/link"
import Image from "@editorjs/image"
import Raw from "@editorjs/raw"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
// import CheckList from "@editorjs/checklist"
import Delimiter from "@editorjs/delimiter"
import InlineCode from "@editorjs/inline-code"
// import SimpleImage from "@editorjs/simple-image"
import Underline from "@editorjs/underline"
import NestedList from "@editorjs/nested-list"
// import Attaches from "@editorjs/attaches"
// import FootnotesTune from "@editorjs/footnotes"
// import TextVariantTune from "@editorjs/text-variant-tune"
import AlignmentTuneTool from "editorjs-text-alignment-blocktune"
import { useUploadFile } from "../../../hooks/use-upload-file"

export const useEditorJSTools = () => {
  const uploadFile = useUploadFile()

  const handleFileUpload = async (file) => {
    const uploadedImage = await uploadFile([file])

    if (!uploadedImage) return

    return {
      success: 1,
      file: {
        url: uploadedImage[0].url,
      },
    }
  }

  return {
    header: {
      class: Header,
      tunes: ["textAlign"],
    },
    paragraph: {
      class: Paragraph,
      tunes: ["textAlign"],
      // tunes: ["footnotes"],
    },
    // list: {
    //   class: List,
    //   tunes: ["footnotes"],
    // },
    nestedList: {
      class: NestedList,
      tunes: ["textAlign"],
    },
    // linkTool: LinkTool,
    quote: Quote,
    underline: Underline,
    delimiter: Delimiter,
    embed: Embed,
    table: Table,
    image: {
      class: Image,
      config: {
        uploader: {
          uploadByFile: handleFileUpload,
        },
      },
    },
    // simpleImage: SimpleImage,
    // checklist: CheckList,
    raw: Raw,
    code: Code,
    inlineCode: InlineCode,
    // attaches: {
    //   class: Attaches,
    //   config: {
    //     uploader: {
    //       uploadByFile: handleFileUpload,
    //     },
    //   },
    // },
    // warning: Warning,
    marker: Marker,
    // footnotes: FootnotesTune,
    // textVariant: TextVariantTune,
    textAlign: {
      class: AlignmentTuneTool,
    },
  }
}
