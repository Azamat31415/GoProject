import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./subscryp.css";

const foodOptions = [
    { type: "Dry", price: 100 },
    { type: "Wet", price: 120 },
    { type: "Grain-free", price: 110 },
];

const SubscriptionPage = () => {
    const [selectedFood, setSelectedFood] = useState(foodOptions[0].type);
    const [price, setPrice] = useState(foodOptions[0].price);
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const selected = foodOptions.find(food => food.type === selectedFood);
        if (selected) {
            setPrice(selected.price);
        }
    }, [selectedFood]);

    useEffect(() => {
        if (location.state?.subscriptionActive) {
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + 3);
            setSubscriptionEndDate(currentDate.toLocaleDateString());
        }
    }, [location.state]);

    const fetchSubscription = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userID");

        if (!token || !userId) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/subscriptions/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.renewal_date) {
                    setSubscriptionEndDate(new Date(data.renewal_date).toLocaleDateString());
                } else {
                    console.warn("No renewal date found in response.");
                }
            } else {
                console.error("Failed to fetch subscription:", await response.text());
            }
        } catch (error) {
            console.error("Error fetching subscription:", error);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    const handleSubscription = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userID");

        if (!token) {
            alert("You need to log in to subscribe.");
            navigate("/login");
            return;
        }

        if (!userId) {
            alert("User ID is missing. Please log in again.");
            navigate("/login");
            return;
        }

        const subscriptionData = {
            user_id: parseInt(userId),
            interval_days: 90,
            type: selectedFood,
            status: "active",
        };

        try {
            const response = await fetch("http://localhost:8080/subscriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(subscriptionData),
            });

            if (response.ok) {
                alert("Subscription successful!");
                await fetchSubscription(); // Обновляем данные подписки после успешной покупки
                const selectedFoodItem = foodOptions.find(food => food.type === selectedFood);
                navigate("/subpayment", { state: { price: selectedFoodItem?.price, selectedFood } });
            } else {
                const responseText = await response.text();
                alert(`Failed to subscribe: ${responseText}`);
            }
        } catch (error) {
            alert("An error occurred. Please check your connection.");
        }
    };

    return (
        <div className="subscription-container">
            <h2>3-Month Pet Food Subscription</h2>
            {subscriptionEndDate ? (
                <p>Your subscription is active until {subscriptionEndDate}.</p>
            ) : (
                <>
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
                    <button className="subscribe-button" onClick={handleSubscription}>
                        Subscribe Now
                    </button>
                </>
            )}
        </div>
    );
};

export default SubscriptionPage;
