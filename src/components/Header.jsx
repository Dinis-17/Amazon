import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Header({ categories = [], onFilter }) {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showFilters, setShowFilters] = useState(false);
    const [category, setCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://192.168.0.220:3000/api/product');
            const data = await response.json();
            if (onFilter) onFilter(data.products);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    const applyFilters = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (category) queryParams.append('category', category);

            const url = `http://192.168.0.220:3000/api/search?${queryParams.toString()}`;
            console.log('Fetching:', url);

            const response = await fetch(url);
            const data = await response.json();

            if (onFilter) onFilter(data.products);
        } catch (error) {
            console.error('Error aplicando filtros:', error);
        }
    };

    const resetFilters = () => {
        setCategory('');
        setSortOrder('');
        fetchAllProducts();
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    return (
        <>
            <nav className="header-div">
                <h1>Amazon 2</h1>

                <Button className="full-rounded" onClick={() => navigate('/')}>Home</Button>
                <input id="SearchBar" className="input" placeholder="Buscar un producto..." />

                <Button className="full-rounded" onClick={toggleFilters}>Filtrar</Button>

                <Button className="full-rounded shopping-cart" onClick={() => navigate('/cart')}>
                    <FontAwesomeIcon icon={faCartShopping} />
                </Button>

                {!isLoggedIn ? (
                    <div className="login-buttons">
                        <Button className="full-rounded" onClick={() => navigate('/login')}>Login</Button>
                        <Button className="full-rounded" onClick={() => navigate('/register')}>Sign In</Button>
                    </div>
                ) : (
                    <div className="logged-buttons">
                        <Button className="full-rounded" id="dashboard-btn" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                        <Button className="full-rounded" id="logout-btn" onClick={handleLogoutClick}>Cerrar sesión</Button>
                    </div>
                )}
            </nav>

            {showFilters && window.location.pathname === '/' && (
                <div className="filters-container">
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                        <option value="">Ordenar por</option>
                        <option value="menor-mayor">Precio: menor a mayor</option>
                        <option value="high-low">Precio: mayor a menor</option>
                    </select>

                    <button onClick={applyFilters} className="btn-apply">Aplicar filtros</button>
                    <button onClick={resetFilters} className="btn-reset">Reset</button>
                </div>
            )}
        </>
    );
}

export default Header;
