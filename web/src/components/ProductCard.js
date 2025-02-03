import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img
                src={product.image || 'https://catspaw.ru/wp-content/uploads/2016/06/Ela_Kaimo.jpg?hash=a89deb3661b481b73e552578bec263d3'}
                alt={product.name}
                className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price: {product.price}</p>
        </div>
    );
};

export default ProductCard;
