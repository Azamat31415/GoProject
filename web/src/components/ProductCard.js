import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const ProductsPage = ({ category, subcategory, type }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Формируем URL запроса с параметрами фильтрации
        const fetchProducts = async () => {
            const response = await fetch(`/api/products?category=${category}&subcategory=${subcategory}&type=${type}`);
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, [category, subcategory, type]);

    return (
        <div className="products-page">
            <h2>Products</h2>
            <div className="product-list">
                {products.map((product) => (
                    <ProductCard
                        key={product.ID}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        image={product.image} // Допустим, у товара есть изображение
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;
