import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, addToCart }) => {
    console.log("Product data:", product); // Проверим структуру данных

    return (
        <div className="product-card">
            <img
                src={product.image || 'https://catspaw.ru/wp-content/uploads/2016/06/Ela_Kaimo.jpg?hash=a89deb3661b481b73e552578bec263d3'}
                alt={product.name || "Unavailable"}
                className="product-image"
            />
            <h3 className="product-name">{product.name || "Unavailable"}</h3>
            <p className="product-description">{product.description || "No description available"}</p>
            <p className="product-price">Price: {product.price || "Not available"}</p>
            <button className="add-to-cart-button" onClick={() => addToCart(product.ID)}>
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
