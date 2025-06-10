import { Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        setIsLoggedIn(!!token);
    }, []);

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleDashboardClick = () => {
        navigate('/dashboard');
    }

    const handleLogoutClick = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");

        setIsLoggedIn(false);
        navigate('/');
        location.reload();
    };

    return (
        <nav className="header-div">
            <h1>Tienda</h1>

            <Button className="full-rounded" onClick={handleHomeClick}>Home</Button>
            <Button className="full-rounded">Más vendido</Button>
            <Button className="full-rounded">Soporte</Button>

            <input id="SearchBar" className="input" placeholder="Buscar un producto..." />

            <Button className="full-rounded shopping-cart">
                <FontAwesomeIcon icon={faCartShopping} />
            </Button>

            {/* Si NO está logueado: mostrar Login y Sign In */}
            {!isLoggedIn && (
                <div className="login-buttons">
                    <Button className="full-rounded" onClick={handleLoginClick}>Login</Button>
                    <Button className="full-rounded" onClick={handleRegisterClick}>Sign In</Button>
                </div>
            )}

            {/* Si está logueado: mostrar botón Cerrar sesión */}
            {isLoggedIn && (
                <div className="logged-buttons">
                    <Button className="full-rounded" id={"dashboard-btn"} onClick={handleDashboardClick}>Dashboard</Button>
                    <Button className="full-rounded" id={"logout-btn"} onClick={handleLogoutClick}>Cerrar sesión</Button>
                </div>
            )}
        </nav>
    );
}

export default Header;
