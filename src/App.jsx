import './styles/app.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import CategoriaContainer from './components/CategoriaContainer.jsx';
import Footer from './components/Footer.jsx';
import Login from './pages/Login.jsx';
import Register from './Pages/Register.jsx';
import Dashboard from "./Pages/Dashboard.jsx";
import Cart from './Pages/Cart';
import Pagar from './Pages/Pagar.jsx';
import ProductDetails from "./Pages/ProductDetails.jsx";
import { useState, useEffect } from 'react';

function App() {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const isAdmin = user?.permisos === "admin";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://192.168.0.220:3000/api/product")
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar productos');
                return res.json();
            })
            .then(data => {
                setProducts(data.products);
                const uniqueCategories = [...new Set(data.products.map(p => p.category))];
                setCategories(uniqueCategories);
            })
            .catch(error => {
                console.error(error);
                setError('Estamos teniendo problemas con los servidores. Por favor intentelo de nuevo más tarde.');
            });
    }, []);

    return (
        <div className="app-layout">
            <Router>
                <Header categories={categories} onFilter={setProducts} />

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<CategoriaContainer
                            products={products} isAdmin={isAdmin} error={error}/>}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/pagar" element={<Pagar />} />
                        <Route
                            path="/product/:id"
                            element={<ProductDetails isAdmin={isAdmin} />}
                        />
                    </Routes>
                </main>

                <Footer />
            </Router>
        </div>
    );
}

export default App;
