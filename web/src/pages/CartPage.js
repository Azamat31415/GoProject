import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./CartPage.css";

const CartPage = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            const userID = localStorage.getItem("userID");
            if (!userID) return;

            try {
                const response = await fetch(`http://localhost:8080/cart/user/${userID}/products`);
                if (!response.ok) throw new Error("Failed to fetch cart items");

                const data = await response.json();
                setCart(data); // Ожидается, что API вернет массив продуктов
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCartItems();
    }, []);

    const removeFromCart = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/cart/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to remove item");

            setCart(cart.filter((product) => product.id !== id));
        } catch (error) {
            console.error("Error removing item:", error);
        }
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
