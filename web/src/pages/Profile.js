import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://localhost:8080/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.email) {
                    setUserData(data);
                } else {
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
                navigate("/login");
            });
    }, [navigate]);

    const handleLogout = () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("http://localhost:8080/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then(() => {
                localStorage.removeItem("token");
                navigate("/login");
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <div className="profile-info">
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Name:</strong> {userData.first_name} {userData.last_name}</p>
                <p><strong>Phone:</strong> {userData.phone}</p>
                <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
};

export default Profile;
