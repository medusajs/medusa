import { TightLayout } from "docs-ui"
import Feedback from "@/components/Feedback"
import EditButton from "@/components/EditButton"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TightLayout
      sidebarProps={{
        expandItems: true,
      }}
      showPagination={true}
      feedbackComponent={<Feedback className="my-2" />}
      editComponent={<EditButton />}
    >
      {children}
    </TightLayout>
  )
}
