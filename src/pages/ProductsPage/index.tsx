import { useProduct } from "../../hooks/useProduct";
import ProductsPage from "./ProductsPage";

const ProductsPageContainer = () => {
  const productData = useProduct();

  return <ProductsPage data={productData} />;
};

export default ProductsPageContainer;
