/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Quickstart",
      items: [
        {
          type: "doc",
          id: "quickstart/quick-start",
          label: "Quickstart",
        },
        {
          type: "doc",
          id: "quickstart/quick-start-docker",
          label: "Quickstart w. Docker (Coming soon!)",
        },
      ],
    },
    {
      type: "category",
      label: "Tutorials",
      items: [
        {
          type: "doc",
          id: "tutorials/set-up-your-development-environment",
          label: "Set up your development environment",
        },
        {
          type: "doc",
          id: "tutorials/creating-your-medusa-server",
          label: "Creating your Medusa server",
        },
        {
          type: "doc",
          id: "tutorials/adding-custom-functionality",
          label: "Adding custom functionality",
        },
        {
          type: "doc",
          id: "tutorials/linking-your-local-project-with-medusa-cloud",
          label: "Linking your local project with Medusa Cloud",
        },
        {
          type: "doc",
          id: "tutorials/plugins",
          label: "Plugins in Medusa",
        },
      ],
    },
  ],
};
