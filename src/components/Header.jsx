import { Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    }

    const handleHomeClick = () => {
        navigate('/');
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

            <div className="login-buttons">
                <Button className="full-rounded" onClick={handleLoginClick}>Login</Button>
                <Button className="full-rounded" onClick={handleRegisterClick}>Sign In</Button>
            </div>
        </nav>
    );
}

export default Header;
