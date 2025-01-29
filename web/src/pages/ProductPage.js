import ProductList from "../components/ProductList";
import { useParams } from "react-router-dom";

const ProductsPage = () => {
    const { category } = useParams();

    return (
        <div>
            <h1>Product Catalog</h1>
            <ProductList category={category} />
        </div>
    );
};

export default ProductsPage;
