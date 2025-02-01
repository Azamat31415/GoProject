import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const ProductsPage = () => {
    const { category, subcategory, type } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `http://localhost:8080/products?category=${category}`;
                if (subcategory) url += `&subcategory=${subcategory}`;
                if (type) url += `&type=${type}`;

                // Логируем URL для запроса
                console.log('Fetching from URL:', url);

                const response = await fetch(url);

                // Логируем статус ответа
                console.log('Response status:', response.status);

                // Логируем заголовки ответа
                console.log('Response headers:', response.headers);

                // Логируем тело ответа (текстовый формат, до того как преобразуем его в JSON)
                const text = await response.text();
                console.log('Response body (raw):', text);

                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.statusText}`);
                }

                // Пробуем обработать ответ как JSON
                const data = JSON.parse(text);
                console.log('Fetched products:', data);

                // Устанавливаем состояние с полученными продуктами
                setProducts(data);
            } catch (err) {
                // Логируем ошибку, если что-то пошло не так
                console.error('Error:', err.message);
                setError(err.message);
            } finally {
                // Завершаем загрузку
                setLoading(false);
            }
        };

        // Запуск асинхронной функции
        fetchProducts();
    }, [category, subcategory, type]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>{category} - {subcategory} - {type}</h1>
            <div className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.ID}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            image={product.image || 'https://catspaw.ru/wp-content/uploads/2016/06/Ela_Kaimo.jpg?hash=a89deb3661b481b73e552578bec263d3'}  // Если изображение не указано, использовать дефолтное
                        />
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
