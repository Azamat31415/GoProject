import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const ProductsPage = () => {
    const { category, subcategory, type } = useParams(); // Получаем параметры через useParams
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(`Fetching products for category: ${category}, subcategory: ${subcategory}, type: ${type}`);

        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/products?category=${category}&subcategory=${subcategory}&type=${type}`);

                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid JSON response from server");
                }

                const data = await response.json();
                console.log("Fetched data:", data);

                setProducts(data); // Обновляем данные только после успешного получения
            } catch (error) {
                console.error("Error fetching products:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, subcategory, type]); // Зависимости — только строки (не объекты)

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="products-page">
            <h2>Products: {category} - {subcategory} - {type}</h2>
            <div className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.ID}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            image={product.image || 'https://catspaw.ru/wp-content/uploads/2016/06/Ela_Kaimo.jpg?hash=a89deb3661b481b73e552578bec263d3'}
                        />
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
