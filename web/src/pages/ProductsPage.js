import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const ProductsPage = () => {
    const { category, subcategory, type } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/products?category=${category}&subcategory=${subcategory}&type=${type}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return response.json();
            })
            .then(data => setProducts(data))
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, [category, subcategory, type]);

    const addToCart = (productId) => {
        const userId = 1;
        const cartItem = { user_id: userId, product_id: productId, quantity: 1 };

        fetch("http://localhost:8080/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cartItem),
        })
            .then(response => response.text())
            .then(text => {
                console.log("Ответ от сервера:", text);
                try {
                    const json = JSON.parse(text);
                    alert("Product added to cart successfully");
                } catch (e) {
                    alert("Invalid server response: " + text);
                }
            })
            .catch(error => alert(error.message));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="products-page">
            <h2>Products: {category} - {subcategory} - {type}</h2>
            <div className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.ID} product={product} addToCart={addToCart} />
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
