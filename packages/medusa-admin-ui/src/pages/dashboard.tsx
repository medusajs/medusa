import { useProducts } from "medusa-react";

const Dashboard = () => {
  const { products } = useProducts();

  return (
    <div className="grid grid-cols-3 gap-4">
      {products?.map((product) => {
        return (
          <div key={product.title} className="flex flex-col gap-y-1">
            <div className="min-h-[230px] rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover object-center"
                src={product.images[0].url}
                alt={product.title}
                loading="lazy"
              />
            </div>
            <p>{product.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
