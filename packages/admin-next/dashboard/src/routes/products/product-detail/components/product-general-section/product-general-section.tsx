import { EllipseGreenSolid, EllipsisHorizontal } from "@medusajs/icons";
import { Product, ProductTag } from "@medusajs/medusa";
import {
  Badge,
  Button,
  Container,
  Heading,
  IconButton,
  Text,
} from "@medusajs/ui";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

type ProductGeneralSectionProps = {
  product: Product;
};

export const ProductGeneralSection = ({
  product,
}: ProductGeneralSectionProps) => {
  return (
    <div>
      <Container>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
              <Heading>{product.title}</Heading>
              <div className="flex items-center gap-x-2">
                <Button variant="secondary">
                  <EllipseGreenSolid />
                  Published
                </Button>
                <IconButton>
                  <EllipsisHorizontal />
                </IconButton>
              </div>
            </div>
            <div className="max-w-[90%]">
              <Text className="text-ui-fg-subtle">{product.description}</Text>
            </div>
            <ProductTags tags={product.tags} />
          </div>
          <ProductDetails product={product} />
        </div>
      </Container>
    </div>
  );
};

type ProductTagsProps = {
  tags?: ProductTag[] | null;
};

const ProductTags = ({ tags }: ProductTagsProps) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="inline-flex flex-wrap gap-2">
      {tags.map((t) => {
        return (
          <Badge key={t.id} color="grey">
            {t.value}
          </Badge>
        );
      })}
    </div>
  );
};

type ProductDetailProps = {
  label: string;
  value?: ReactNode;
};

const ProductDetail = ({ label, value }: ProductDetailProps) => {
  return (
    <div className="flex items-center justify-between">
      <Text>{label}</Text>
      <Text>{value ? value : "-"}</Text>
    </div>
  );
};

type ProductDetailsProps = {
  product: Product;
};

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-2">
      <Text weight="plus">{t("general.details")}</Text>
      <div className="flex flex-col gap-y-2 text-ui-fg-subtle">
        <ProductDetail label={t("fields.subtitle")} value={product.subtitle} />
        <ProductDetail label={t("fields.handle")} value={product.handle} />
        <ProductDetail label={t("fields.categories")} value={undefined} />
        <ProductDetail label={t("fields.type")} value={undefined} />
        <ProductDetail label={t("fields.collection")} value={undefined} />
        <ProductDetail
          label={t("fields.discountable")}
          value={product.discountable ? "True" : "False"}
        />
      </div>
    </div>
  );
};
