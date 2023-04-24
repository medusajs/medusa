import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../../../components/molecules/tabs"
import { StylesForm } from "./forms/styles"

export const PostSectionStylesForm = () => (
  <div className="flex flex-col gap-4">
    <h2 className="inter-large-semibold mt-0">Styles</h2>

    <Tabs defaultValue="default">
      <TabsList>
        <TabsTrigger value="default">Default</TabsTrigger>
        <TabsTrigger value="mobile">Mobile</TabsTrigger>
      </TabsList>

      <TabsContent value="default">
        <StylesForm type="default" />
      </TabsContent>

      <TabsContent value="mobile">
        <StylesForm type="mobile" />
      </TabsContent>
    </Tabs>
  </div>
)
