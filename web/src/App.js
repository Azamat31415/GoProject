import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductPage";
import Home from "./pages/Home";
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:category" element={<ProductsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
