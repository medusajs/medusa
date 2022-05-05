---
title: Making your store more powerful with Contentful
---

# Making your store more powerful with Contentful

In [part 1](https://docs.medusajs.com/how-to/headless-ecommerce-store-with-gatsby-contentful-medusa/) of this series you have set up [Medusa](https://medusajs.com) with Contentful as your CMS system and added a Gatsby storefront. In this part you will get a further introduction to Contentful and learn how [`medusa-plugin-contentful`](https://github.com/medusajs/medusa/tree/master/packages/medusa-plugin-contentful) can be leveraged to make your store more powerful. Apart from a front page, product pages and a checkout flow, most ecommerce stores also need miscalleneous pages like About and Contact pages. In this guide you will add a Rich Text content module to your Contentful space so that you can make this pages cool. You will also see how the content modules can be used to give your product pages more life.

What you will do in this guide:

- Add a rich text content module
- Add rich text to your `/about` page
- Add a "Related Products" section to your product page

Topics covered:

- Contentful Migrations
- Product enrichment

## Creating a rich text content module

In this guide you will make use of [Contentful Migrations](https://github.com/contentful/contentful-migration) to keep a versioned controlled record of how your Content evolves over time. The Contentful app allows you to create content models straight from their dashboard, however, when using the migrations tool you will be able to 1) quickly replicate your Contentful space and 2) incorporate migrations as part of a CI/CD pipeline. [You can read more about how to use CMS as Code here](https://www.contentful.com/help/cms-as-code/).

To prepare your migration create a new file at `contentful-migrations/rich-text.js` and add the following code:

```javascript
// contentful-migrations/rich-text.js

module.exports = function (migration, context) {
  const richText = migration
    .createContentType("richText")
    .name("Rich Text")
    .displayField("title")

  richText.createField("title").name("Title (Internal)").type("Symbol")
  richText.createField("body").name("Body").type("RichText")
}
```

This small snippet will create a content model in your Contentful space with two fields: a title which will be used to name entries in a meaningful manner (i.e. it won't be displayed to customers) and a body which contains the rich text to display. To apply your migration run:

```bash npm2yarn
npm run migrate:contentful --file contentful-migrations/rich-text.js
```

If you go to your Contentful space and click Content Model you will see that the Rich Text model has been added to your space:
![](https://i.imgur.com/sCMjr4B.png)

The validation rules in the Page model only allow Hero and Tile Sections to be added to the Content Modules fields so you will need another migration to make it possible for pages to make use of the new Rich Text modules. Create a new migration at `contentful-migrations/update-page-module-validation.js` and add the following:

```javascript
// contentful-migrations/update-page-module-validation.js

module.exports = function (migration, context) {
  const page = migration.editContentType("page")

  page.editField("contentModules").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: ["hero", "tileSection", "richText"],
      },
    ],
  })
}
```

After migrating your space you are ready create your new contact page:

```bash npm2yarn
npm run migrate:contentful --file contentful-migrations/update-page-module-validation.js
```

## Adding Rich Text to About

To use your new Rich Text module **Content > Page > About**, and click **Add Content > Page**. You will now make use of the new Rich Text module to add some more details about your store. You can write your own text or use the text provided below if you just want to copy/paste.

:::info About Medusa

 Medusa is an open-source headless commerce engine for fast-growing businesses. Getting started with Medusa is very easy and you will be able to start selling online with a basic setup in no time, however, the real power of Medusa starts showing up when you add custom functionality and extend your core to fit your needs.

 The core Medusa package and all the official Medusa plugins ship as individual NPM packages that you install into a Node project. You store and plugins are configured in your medusa-config.js file making it very easy to manage your store as your business grows. Custom functionality doesn't have to come from plugins, you can also add project-level functionality by simply adding files in your `src/` folder. Medusa will automatically register your custom functionalities in the bootstrap phase.

:::

![](https://i.imgur.com/hqiaoFq.png)

When you have added your text you can click **Publish changes** (make sure the About page is published too).

## Updating the storefront to support the Rich Text module

:::note

 If you want to jump straight to the final frontend code visit [medusajs/medusa-contentful-storefront@part-2](https://github.com/medusajs/medusa-contentful-storefront/tree/part-2).

:::

To display your newly created Rich Text module open up the storefront code and create a new file at `src/components/rich-text/rich-text.jsx`.

```jsx
// src/components/rich-text/rich-text.jsx

import React from "react"
import { renderRichText } from "gatsby-source-contentful/rich-text"

import * as styles from "../../styles/rich-text.module.css"

const RichText = ({ data }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {data.body ? renderRichText(data.body) : ""}
      </div>
    </div>
  )
}

export default RichText
```

The `renderRichText` function is imported from the `gatsby-source-contentful` plugin to easily transform the text you entered in the Rich Text module to html. To make the Rich Text component render nicely add a style file as well at `src/styles/rich-text.module.css`.

```css
/* src/styles/rich-text.module.css */

.container {
  display: flex;
  padding-top: 100px;
  padding-bottom: 100px;
}

.content {
  margin: auto;
  max-width: 870px;
}
```

If you restart your storefront server now you will not be able to see your new Rich Text module just yet. The last step to making that happen will be to let the Page component know to render the new Rich Text component when it encounters Rich Text in the Page's Content Modules. In your editor open up the file `src/pages/{ContentfulPage.slug}.js` and add the following:

At the top of the file import your `RichText` component:

```javascript
...
import RichText from "../components/rich-text/rich-text"
...
```

Now in the `contentModules.map` function return the `RichText` component whenever a `ContentfulRichText` module is encountered. Add a case to the switch statement:

```javascript
    case "ContentfulRichText":
      return <RichText key={cm.id} data={cm} />
```

Finally you will need to fetch the Rich Text data from Gatsby's data layer by modifying the GraphQL code at the bottom of the file after the line with `contentModules {` add:

```graphql
    ... on ContentfulRichText {
      id
      body {
        raw
      }
      internal {
        type
      }
    }
```

Restart your local Gatsby server and visit `http://localhost:8000/about`, you will now see the your newly added Rich Text module.

![](https://i.imgur.com/8Teuxin.png)

## Enriching your Product pages

You have now seen how the Page model in Contentful can be extended to include a new content module in a reusable and modular manner. The same idea can be extended to your Product pages allowing you to create completely bespoke universes around your products. You will use the same techniques as above to create a Related Products section below the "Medusa Shirt" product.

### Migrating Products

First, add a new field to the Product content model. Using migrations you can create a file `contentful-migrations/product-add-modules.js`:

```javascript
// contentful-migrations/product-add-modules.js

module.exports = function (migration, context) {
  const product = migration.editContentType("product")

  product
    .createField("contentModules")
    .name("Content Modules")
    .type("Array")
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: ["hero", "tileSection", "richText"],
        },
      ],
    })
}
```

Run the migration:

```bash npm2yarn
npm run migrate:contentful --file contentful-migrations/product-add-modules.js
```

### Adding "Related Products" Tile Section

After the migration you can now add Content Modules to Products, to enrich the Product pages with relevant content. In this guide you will add a Tile Section that holds "Related Products", but the functionality could be further extended to showcase look book images, inspirational content or more detailed product descriptions.

In Contentful go to **Content > Product > Medusa Shirt** scroll all the way to the bottom, where you should be able to find the new _Content Modules_ field:

![](https://i.imgur.com/jUUpW9I.png)

Click **Add content > Tile Section** which will open a new Tile Section. For the Title write "Related Products", and for Tiles click **Add content > Add existing content > Medusa Waterbottle > Insert 1 entry**.

![](https://i.imgur.com/N7alMGz.png)

Click **Publish** and make sure that the Medusa Shirt product is published too.

Your data is now ready to be used in the storefront, but you still need to make a couple of changes to the storefront code to be able to view the new content.

## Adding Content Modules to Product pages

Just like you did for the Page component, you will have to fetch the Content Modules from Gatsby's GraphQL data layer.

In the file `src/pages/products/{ContentfulProduct.handle}.js` add the following in the GraphQL query at the bottom of the file (e.g. after the variants query):

```graphql
  # src/pages/products/{ContentfulProduct.handle}.js

  contentModules {
    ... on ContentfulTileSection {
      id
      title
      tiles {
        ... on ContentfulProduct {
          id
          title
          handle
          thumbnail {
            gatsbyImageData
          }
          internal {
            type
          }
        }
        ... on ContentfulTile {
          id
          title
          cta
          image {
            gatsbyImageData
          }
          link {
            linkTo
            reference {
              slug
            }
          }
          internal {
            type
          }
        }
      }
      internal {
        type
      }
    }
  }
```

This snippet will query the Content Modules defined for the product and will allow you to use the data in your components.

Next open up the `src/views/products.jsx` file and add the following snippets.

Import the `TileSection` component:

```javascript
import TileSection from "../components/tile-section/tile-section"
```

Add the Content Modules in the JSX just before the final closing `div`:

```jsx
// src/views/products.jsx

<div className={styles.contentModules}>
  {product.contentModules?.map((cm) => {
    switch (cm.internal.type) {
      case "ContentfulTileSection":
        return <TileSection key={cm.id} data={cm} />
      default:
        return null
    }
  })}
</div>
```

Restart the Gatsby server and visit http://localhost:8000/product/medusa-shirt you should now see the new "Related Products" Tile Section below the Product page controls.

![](https://i.imgur.com/AQHKA6j.png)

## Summary

In this guide you created a new content model for Rich Text input in Contentful using [contentful-migration](https://github.com/contentful/contentful-migration). You further extended the storefront to render the new Rich Text plugin. The concepts in this guide are meant to demonstrate how Contentful can be used to make your store more powerful in a modular and scalable way. The content modules covered in this guide could be further extended to add other custom modules, for example, you could add a Newsletter Signup, module that when encountered in the code renders a newsletter form.

## What's next

In the next part of this guide you will learn how to implement further commerce functionalities to your site such as adding support for discount codes, region based shopping and more. (Coming soon)

- [Deploying Medusa on Heroku](https://docs.medusajs.com/how-to/deploying-on-heroku)
- [Deploying Medusa Admin on Netlify](https://docs.medusajs.com/how-to/deploying-admin-on-netlify)
