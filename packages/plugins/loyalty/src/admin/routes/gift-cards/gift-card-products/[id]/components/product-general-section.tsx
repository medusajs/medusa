import { PencilSquare, Trash } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Container, Heading, StatusBadge, usePrompt } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";
import { ActionMenu } from "../../../../../components/action-menu";
import { SectionRow } from "../../../../../components/section-row";
import { useDeleteProduct } from "../../../../../hooks/api/products";

const productStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "grey";
    case "proposed":
      return "orange";
    case "published":
      return "green";
    case "rejected":
      return "red";
    default:
      return "grey";
  }
};

type ProductGeneralSectionProps = {
  product: HttpTypes.AdminProduct;
};

export const ProductGeneralSection = ({
  product,
}: ProductGeneralSectionProps) => {
  const prompt = usePrompt();
  const navigate = useNavigate();

  const { mutateAsync } = useDeleteProduct(product.id);

  const handleDelete = async () => {
    const res = await prompt({
      title: "Are you sure?",
      description: `Are you sure you want to delete gift card product ${product.title}?`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!res) {
      return;
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("..");
      },
    });
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{product.title}</Heading>
        <div className="flex items-center gap-x-4">
          <StatusBadge
            color={productStatusColor(product.status)}
            className="capitalize"
          >
            {product.status}
          </StatusBadge>

          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: "Edit",
                    to: "edit",
                    icon: <PencilSquare />,
                  },
                ],
              },
              {
                actions: [
                  {
                    label: "Delete",
                    onClick: handleDelete,
                    icon: <Trash />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      <SectionRow title={"Description"} value={product.description} />
      <SectionRow title={"Subtitle"} value={product.subtitle} />
      <SectionRow title={"Handle"} value={`/${product.handle}`} />
    </Container>
  );
};
