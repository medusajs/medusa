import { ThumbnailBadge } from "@medusajs/icons";
import { AdminProduct, HttpTypes } from "@medusajs/types";
import {
  Button,
  Checkbox,
  CommandBar,
  Container,
  Heading,
  Text,
  Tooltip,
  clx,
  usePrompt,
} from "@medusajs/ui";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUpdateProduct } from "../../../../../hooks/api/products";

type ProductMedisaSectionProps = {
  product: HttpTypes.AdminProduct;
};

export const ProductMediaSection = ({ product }: ProductMedisaSectionProps) => {
  const prompt = usePrompt();
  const [selection, setSelection] = useState<Record<string, boolean>>({});

  const media = getMedia(product);

  const handleCheckedChange = (id: string) => {
    setSelection((prev) => {
      if (prev[id]) {
        const { [id]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [id]: true };
      }
    });
  };

  const { mutateAsync } = useUpdateProduct(product.id);

  const handleDelete = async () => {
    const ids = Object.keys(selection);
    const includingThumbnail = ids.some(
      (id) => media.find((m) => m.id === id)?.isThumbnail
    );

    const res = await prompt({
      title: "Are you sure?",
      description: includingThumbnail
        ? `Deleting ${ids.length} image(s) including the thumbnail. This will remove the thumbnail from the product.`
        : `Deleting ${ids.length} image(s).`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!res) {
      return;
    }

    const mediaToKeep = (product?.images || [])
      .filter((i) => !ids.includes(i.id))
      .map((i) => ({ url: i.url }));

    await mutateAsync(
      {
        images: mediaToKeep,
        thumbnail: includingThumbnail ? "" : undefined,
      },
      {
        onSuccess: () => {
          setSelection({});
        },
      }
    );
  };

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Media</Heading>

        {media.length > 0 && (
          <Link
            to={`media?view=edit`}
            className="text-ui-fg-muted text-sm  txt-compact-medium-plus"
          >
            Edit
          </Link>
        )}
      </div>

      {media.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 px-6 pb-4">
          {media.map((i, index) => {
            const isSelected = selection[i.id];

            return (
              <div
                className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
                key={i.id}
              >
                <div
                  className={clx(
                    "transition-fg invisible absolute right-2 top-2 opacity-0 group-hover:visible group-hover:opacity-100",
                    {
                      "visible opacity-100": isSelected,
                    }
                  )}
                >
                  <Checkbox
                    checked={selection[i.id] || false}
                    onCheckedChange={() => handleCheckedChange(i.id)}
                  />
                </div>
                {i.isThumbnail && (
                  <div className="absolute left-2 top-2">
                    <Tooltip content="Thumbnail">
                      <ThumbnailBadge />
                    </Tooltip>
                  </div>
                )}
                <Link to={`media`} state={{ curr: index }}>
                  <img
                    src={i.url}
                    alt={`${product.title} image`}
                    className="size-full object-cover"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-4 pb-8 pt-6">
          <div className="flex flex-col items-center">
            <Text
              size="small"
              leading="compact"
              weight="plus"
              className="text-ui-fg-subtle"
            >
              No media yet
            </Text>
            <Text size="small" className="text-ui-fg-muted">
              Add images to your product
            </Text>
          </div>
          <Button size="small" variant="secondary" asChild>
            <Link to="media?view=edit">Add images</Link>
          </Button>
        </div>
      )}
      <CommandBar open={!!Object.keys(selection).length}>
        <CommandBar.Bar>
          <CommandBar.Value>
            {Object.keys(selection).length} selected
          </CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            action={handleDelete}
            label="Delete"
            shortcut="d"
          />
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  );
};

type Media = {
  id: string;
  url: string;
  isThumbnail: boolean;
};

const getMedia = (product: AdminProduct) => {
  const { images = [], thumbnail } = product;

  const media: Media[] = (images || []).map((image) => ({
    id: image.id,
    url: image.url,
    isThumbnail: image.url === thumbnail,
  }));

  if (thumbnail && !media.some((mediaItem) => mediaItem.url === thumbnail)) {
    media.unshift({
      id: "img_thumbnail",
      url: thumbnail,
      isThumbnail: true,
    });
  }

  return media;
};
