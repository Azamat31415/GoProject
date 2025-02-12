import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!token || role !== "admin") {
            navigate("/profile");
            return;
        }
        fetchData();
    }, [navigate, token, role]);

    const fetchData = async () => {
        try {
            const [productsRes, ordersRes, subsRes] = await Promise.all([
                fetch("http://localhost:8080/products", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("http://localhost:8080/orders", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("http://localhost:8080/subscriptions", { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setProducts(await productsRes.json());
            setOrders(await ordersRes.json());
            setSubscriptions(await subsRes.json());
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>
            <h3>Products</h3>
            <ul>
                {products.map((p) => (
                    <li key={p.id}>{p.name} - {p.price} USD</li>
                ))}
            </ul>
            <h3>Orders</h3>
            <ul>
                {orders.map((o) => (
                    <li key={o.id}>Order #{o.id} - Status: {o.status}</li>
                ))}
            </ul>
            <h3>Subscriptions</h3>
            <ul>
                {subscriptions.map((s) => (
                    <li key={s.id}>Subscription #{s.id}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
