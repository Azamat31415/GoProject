import React, { useState, useEffect } from "react";
import "./OrderHistory.css";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/orders") // Замени URL на свой API
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => console.error("Error fetching orders:", err));
    }, []);

    return (
        <div className="order-history-container">
            {orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <h3>Order #{order.id}</h3>
                        <p className="order-details">
                            <strong>Status:</strong>{" "}
                            <span className={`status-${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                        </p>
                        <p className="order-details"><strong>Delivery:</strong> {order.delivery_method}</p>
                        <p className="order-details"><strong>Total Price:</strong> ${order.total_price.toFixed(2)}</p>
                        <div>
                            <strong>Items:</strong>
                            {order.order_items.map((item) => (
                                <p key={item.id} className="order-item">
                                    {item.product_name} x {item.quantity} (${item.price.toFixed(2)})
                                </p>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default OrderHistory;
