import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./subscryp.css";

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
        if (selected) {
            setPrice(selected.price);
            console.log("Updated price:", selected.price);
        }
    }, [selectedFood]);

    const handleSubscription = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userID");

        console.log("Token:", token);
        console.log("User ID:", userId);

        if (!token) {
            console.error("No token found in localStorage");
            alert("You need to log in to subscribe.");
            navigate("/login");
            return;
        }

        if (!userId) {
            console.error("No userID found in localStorage");
            alert("User ID is missing. Please log in again.");
            navigate("/login");
            return;
        }

        setIsLoading(true);

        const subscriptionData = {
            user_id: parseInt(userId),
            interval_days: 90,
            type: selectedFood,
            status: "active",
        };

        console.log("Sending subscription request:", subscriptionData);

        try {
            const response = await fetch("http://localhost:8080/subscriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(subscriptionData),
            });

            const responseText = await response.text();
            console.log("Server response:", responseText);

            if (response.ok) {
                alert("Subscription successful!");
                console.log("Navigating to /subpayment with:", { price, selectedFood });
                navigate("/subpayment", { state: { price, selectedFood } });
            } else {
                console.error("Subscription failed:", responseText);
                alert(`Failed to subscribe: ${responseText}`);
            }
        } catch (error) {
            console.error("Error during subscription request:", error);
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
        </div>
    );
};

export default SubscriptionPage;
