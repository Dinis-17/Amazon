import './styles/app.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import CategoriaContainer from './components/CategoriaContainer.jsx';
import Footer from './components/Footer.jsx';
import Login from './pages/Login.jsx';
import Register from './Pages/Register.jsx';
import Dashboard from "./Pages/Dashboard.jsx";
import Cart from './Pages/Cart';
import ProductDetails from "./Pages/ProductDetails.jsx";

function App() {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const isAdmin = user?.permisos === "admin";

    return (
        <div className="app-layout">
            <Router>
                <Header />

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<CategoriaContainer />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/cart" element={<Cart />} />
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
