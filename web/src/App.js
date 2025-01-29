import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductPage";
import Home from "./pages/Home";
import ProductDetails from "./components/ProductDetails";
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:category" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetails />} /> {/* Новый маршрут для ProductDetails */}
            </Routes>
        </Router>
    );
}

export default App;