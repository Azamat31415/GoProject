import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '' });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchUsers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/profile');
            const data = await response.json();
            setUsers([data]); // Если нужно подгрузить всех пользователей, изменяй этот вызов
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddProduct = async () => {
        try {
            const response = await fetch('/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (response.ok) {
                fetchProducts();
                setNewProduct({ name: '', description: '', price: '', stock: '', category: '' });
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`/products/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEditProduct = async () => {
        try {
            const response = await fetch(`/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct),
            });
            if (response.ok) {
                fetchProducts();
                setEditingProduct(null);
            }
        } catch (error) {
            console.error('Error editing product:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Panel</h1>

            {/* Products Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2>Products</h2>
                {products.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        <button onClick={() => setEditingProduct(product)} style={{ marginRight: '10px' }}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </div>
                ))}

                {/* Add New Product */}
                <h3>Add New Product</h3>
                <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} /><br />
                <input placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} /><br />
                <input placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} /><br />
                <input placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} /><br />
                <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} /><br />
                <button onClick={handleAddProduct}>Add Product</button>
            </div>

            {/* Users Section */}
            <div>
                <h2>Users</h2>
                {users.map(user => (
                    <div key={user.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p>Email: {user.email}</p>
                        <p>Address: {user.address}</p>
                        <p>Phone: {user.phone}</p>
                    </div>
                ))}
            </div>

            {/* Edit Product Dialog */}
            {editingProduct && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    padding: '20px',
                    border: '1px solid #ccc',
                    zIndex: 1000
                }}>
                    <h3>Edit Product</h3>
                    <input placeholder="Name" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} /><br />
                    <input placeholder="Description" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} /><br />
                    <input placeholder="Price" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} /><br />
                    <input placeholder="Stock" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })} /><br />
                    <input placeholder="Category" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} /><br />
                    <button onClick={handleEditProduct}>Save Changes</button>
                    <button onClick={() => setEditingProduct(null)} style={{ marginLeft: '10px' }}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
