import { useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Header() {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="header-div">
            <h1>Amazon 2</h1>

            <Button className="full-rounded" onClick={() => navigate('/')}>Home</Button>
            <input id="SearchBar" className="input" placeholder="Buscar un producto..." />

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
    );
}

export default Header;
