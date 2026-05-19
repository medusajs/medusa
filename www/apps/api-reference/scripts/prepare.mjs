import { generateSplitSidebars } from "build-scripts"

async function main() {
  await generateSplitSidebars({
    sidebars: [
      {
        sidebar_id: "store",
        title: "Store",
        items: [],
        custom_autogenerate: "api-ref",
      },
      {
        sidebar_id: "admin",
        title: "Admin",
        items: [],
        custom_autogenerate: "api-ref",
      },
    ],
  })
}

void main()
