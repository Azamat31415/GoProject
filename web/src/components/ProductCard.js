import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
    const handleAddToCart = async () => {
        const userID = localStorage.getItem("userID");
        const token = localStorage.getItem("token"); // Получаем токен из localStorage

        if (!userID || isNaN(parseInt(userID))) {
            alert("Please log in to add items to your cart.");
            return;
        }

        if (!token) {
            alert("Authorization token is missing. Please log in again.");
            return;
        }

        const cartItem = {
            user_id: parseInt(userID),
            product_id: product.ID,
            quantity: 1
        };

        console.log("Sending cart item:", JSON.stringify(cartItem));

        try {
            const response = await fetch("http://localhost:8080/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Добавляем токен в заголовок
                },
                body: JSON.stringify(cartItem),
            });

            const textResponse = await response.text();
            console.log("Response Text:", textResponse);

            if (!response.ok) {
                throw new Error(textResponse || "Failed to add item to cart");
            }

            alert("Item added to cart!");
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding item to cart");
        }
    };


    return (
        <div className="product-card">
            <img
                src={product.image || "https://catspaw.ru/wp-content/uploads/2016/06/Ela_Kaimo.jpg"}
                alt={product.name || "Unavailable"}
                className="product-image"
            />
            <h3 className="product-name">{product.name || "Unavailable"}</h3>
            <p className="product-description">{product.description || "No description available"}</p>
            <p className="product-price">Price: {product.price || "Not available"}</p>
            <button className="add-to-cart-button" onClick={handleAddToCart}>
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
