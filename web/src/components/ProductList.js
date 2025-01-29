import { useState, useEffect } from 'react';
import { Link } from "react-router-dom"; // Импортируем Link из react-router-dom

const ProductList = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:8080/products");
                if (!response.ok) {
                    throw new Error("Data uploading error");
                }
                const data = await response.json();

                const filteredProducts = category
                    ? data.filter(product => product.category === category)
                    : data;

                setProducts(filteredProducts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (products.length === 0) return <p>No products</p>;

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <Link to={`/product/${product.id}`}>
                            <strong>{product.name}</strong> - ${product.price}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;