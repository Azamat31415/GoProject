import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [pets, setPets] = useState([]);
    const role = localStorage.getItem("role");
    const userID = localStorage.getItem("userID");
    const token = localStorage.getItem("token");

    useEffect(() => {
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

        // Загружаем питомцев пользователя
        fetch(`http://localhost:8080/users/${userID}/pets`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setPets(data))
            .catch((error) => console.error("Error fetching pets:", error));
    }, [navigate, token, userID]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userID");
        navigate("/login");
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <div className="profile-info">
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Name:</strong> {userData.first_name} {userData.last_name}</p>
                <p><strong>Phone:</strong> {userData.phone}</p>

                {role === "admin" && (
                    <button className="admin-panel-button" onClick={() => navigate("/admin-panel")}>
                        Go to Admin Panel
                    </button>
                )}

                <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </div>

            <h3>My Pets</h3>
            <button className="add-pet-button" onClick={() => navigate("/add-pet")}>Add Pet</button>
            <div className="pets-list">
                {pets.length > 0 ? (
                    pets.map((pet) => (
                        <div key={pet.ID} className="pet-card">
                            <h4>{pet.Name}</h4>
                            <p>Species: {pet.Species}</p>
                            <p>Age: {pet.Age}</p>
                        </div>
                    ))
                ) : (
                    <p>No pets found.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
