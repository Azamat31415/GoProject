import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // Импортируем компонент карточки

const ProductsPage = () => {
    const { category, subcategory, type } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(`Fetching products for category: ${category}, subcategory: ${subcategory}, type: ${type}`);

        fetch(`http://localhost:8080/products?category=${category}&subcategory=${subcategory}&type=${type}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched data:", data);
                setProducts(data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setError(error.message);
            })
            .finally(() => setLoading(false));
    }, [category, subcategory, type]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="products-page">
            <h2>Products: {category} - {subcategory} - {type}</h2>
            <div className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} /> // Используем компонент карточки
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
