import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SubscriptionPaymentPage.css";

const SubscriptionPaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentMethod, setPaymentMethod] = useState("pay_now");
    const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "", cardholder: "" });
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (location.state) {
            setPrice(location.state.price);
            setSelectedFood(location.state.selectedFood); // Optionally, if you want to show the selected food
        }
    }, [location.state]);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleCardDetailsChange = (event) => {
        setCardDetails({ ...cardDetails, [event.target.name]: event.target.value });
    };

    const handlePayment = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in to proceed.");
            navigate("/login");
            return;
        }

        const paymentData = {
            user_id: parseInt(localStorage.getItem("userID")),
            amount: price,
            payment_method: paymentMethod,
            status: "completed",
        };

        try {
            const response = await fetch("http://localhost:8080/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(paymentData),
            });

            if (!response.ok) {
                throw new Error("Payment failed");
            }

            alert("Subscription payment successful!");
            navigate("/profile");
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("There was an error processing your payment.");
        }
    };

    return (
        <div className="subscription-payment-page">
            <h2>Subscription Payment</h2>
            <p>Price: ${price}</p>
            <div className="payment-method">
                <h3>Select a payment method</h3>
                <div
                    className={`payment-option ${paymentMethod === "pay_now" ? "selected" : ""}`}
                    onClick={() => handlePaymentMethodChange("pay_now")}
                >
                    Pay Now
                </div>
                <div
                    className={`payment-option ${paymentMethod === "pay_on_delivery" ? "selected" : ""}`}
                    onClick={() => handlePaymentMethodChange("pay_on_delivery")}
                >
                    Pay on Delivery
                </div>
            </div>

            {paymentMethod === "pay_now" && (
                <div className="card-details">
                    <input
                        type="text"
                        name="number"
                        value={cardDetails.number}
                        onChange={handleCardDetailsChange}
                        placeholder="Card Number"
                    />
                    <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardDetailsChange}
                        className="short-input"
                        placeholder="MM/YY"
                    />
                    <input
                        type="text"
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleCardDetailsChange}
                        className="short-input"
                        placeholder="CVC"
                    />
                    <input
                        type="text"
                        name="cardholder"
                        value={cardDetails.cardholder}
                        onChange={handleCardDetailsChange}
                        placeholder="Cardholder Name"
                    />
                </div>
            )}

            <button className="pay-button" onClick={handlePayment}>
                Confirm Payment
            </button>
            <button className="back-button" onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
    );
};

export default SubscriptionPaymentPage;
