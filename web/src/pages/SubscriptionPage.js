import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const foodOptions = [
    { type: "Dry", price: 100 },
    { type: "Wet", price: 120 },
    { type: "Grain-free", price: 110 },
];

const SubscriptionPage = () => {
    const [selectedFood, setSelectedFood] = useState(foodOptions[0].type);
    const [price, setPrice] = useState(foodOptions[0].price);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const selected = foodOptions.find(food => food.type === selectedFood);
        if (selected) setPrice(selected.price);
    }, [selectedFood]);

    const handleSubscription = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in to subscribe.");
            navigate("/login");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8080/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: 1, // Подставьте реальный user ID
                    interval_days: 90,
                    type: selectedFood,
                    status: "active"
                }),
            });

            if (response.ok) {
                alert("Subscription successful!");
                // Navigate to SubscriptionPaymentPage and pass the price and selected food
                navigate("/subscription-payment", { state: { price, selectedFood } });
            } else {
                alert("Failed to subscribe. Please try again later.");
            }
        } catch (error) {
            alert("An error occurred. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="subscription-container">
            <h2>3-Month Pet Food Subscription</h2>
            <p>Receive your selected pet food every month for 3 months.</p>
            <label>
                Choose food type:
                <select
                    value={selectedFood}
                    onChange={(e) => setSelectedFood(e.target.value)}
                >
                    {foodOptions.map((food) => (
                        <option key={food.type} value={food.type}>{food.type}</option>
                    ))}
                </select>
            </label>
            <p className="price">Price: {price} $</p>
            <button className="subscribe-button" onClick={handleSubscription} disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe Now"}
            </button>

            <style jsx>{`
                .subscription-container {
                    max-width: 400px;
                    margin: 50px auto;
                    padding: 20px;
                    border-radius: 10px;
                    background: #f9f9f9;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    font-family: Arial, sans-serif;
                }
                h2 {
                    color: #333;
                }
                select {
                    padding: 8px;
                    margin: 10px 0;
                    border-radius: 5px;
                }
                .price {
                    font-size: 18px;
                    font-weight: bold;
                    color: #007bff;
                }
                .subscribe-button {
                    background: #28a745;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background 0.3s;
                }
                .subscribe-button:hover {
                    background: #218838;
                }
                .subscribe-button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default SubscriptionPage;
