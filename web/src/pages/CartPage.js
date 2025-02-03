import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import "./CartPage.css";

const CartPage = () => {
    const [cart, setCart] = useState([
        {
            id: 1,
            name: "Product 1",
            description: "Description of product 1",
            price: 100,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 2,
            name: "Product 2",
            description: "Description of product 2",
            price: 200,
            image: "https://via.placeholder.com/150",
        },
    ]); // Временные данные, замените на реальный источник

    const removeFromCart = (id) => {
        setCart(cart.filter((product) => product.id !== id));
    };

    const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>
            {cart.length > 0 ? (
                <>
                    <div className="cart-list">
                        {cart.map((product) => (
                            <div key={product.id} className="cart-item">
                                <ProductCard product={product} />
                                <button
                                    className="remove-button"
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <h3>Total: ${totalPrice}</h3>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default CartPage;
