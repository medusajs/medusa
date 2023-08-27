const ProductImportCSV =
  "data:text/csv;charset=utf-8," +
  `Product Id;Product Handle;Product Title;Product Subtitle;Product Description;Product Status;Product Thumbnail;Product Weight;Product Length;Product Width;Product Height;Product HS Code;Product Origin Country;Product MID Code;Product Material;Product Collection Title;Product Collection Handle;Product Type;Product Tags;Product Discountable;Product External Id;Product Profile Name;Product Profile Type;Variant Id;Variant Title;Variant SKU;Variant Barcode;Variant Inventory Quantity;Variant Allow Backorder;Variant Manage Inventory;Variant Weight;Variant Length;Variant Width;Variant Height;Variant HS Code;Variant Origin Country;Variant MID Code;Variant Material;Price EUR;Price USD;Option 1 Name;Option 1 Value;Image 1 Url;Image 2 Url
;coffee-mug-v2;Medusa Coffee Mug;;Every programmer's best friend.;published;https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png;400;;;;;;;;;;;;true;;;;;One Size;;;100;false;true;;;;;;;;;1000;1200;Size;One Size;https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png;
;sweatpants-v2;Medusa Sweatpants;;Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.;published;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png;400;;;;;;;;;;;;true;;;;;S;;;100;false;true;;;;;;;;;2950;3350;Size;S;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png
;sweatpants-v2;Medusa Sweatpants;;Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.;published;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png;400;;;;;;;;;;;;true;;;;;M;;;100;false;true;;;;;;;;;2950;3350;Size;M;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png
;sweatpants-v2;Medusa Sweatpants;;Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.;published;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png;400;;;;;;;;;;;;true;;;;;L;;;100;false;true;;;;;;;;;2950;3350;Size;L;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png
;sweatpants-v2;Medusa Sweatpants;;Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.;published;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png;400;;;;;;;;;;;;true;;;;;XL;;;100;false;true;;;;;;;;;2950;3350;Size;XL;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png;https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png
`
export function downloadProductImportCSVTemplate() {
  const encodedUri = encodeURI(ProductImportCSV)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "product-import-template.csv")
  document.body.appendChild(link)

  link.click()
}
