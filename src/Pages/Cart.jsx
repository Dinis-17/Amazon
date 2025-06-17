import { useState, useEffect } from 'react';
import styles from '../styles/cart.module.css';
import { Trash2 } from 'lucide-react';
import {useNavigate} from "react-router-dom";

function Cart() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const handlePagarClick = () => {
        navigate('/pagar')
    }

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (!userId || userId.trim() === '' || userId === 'null' || userId === 'undefined') {
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }

        setIsLoggedIn(true);

        const storedCart = localStorage.getItem(`cart-${userId}`);
        if (storedCart) {
            const parsed = JSON.parse(storedCart);
            setCartItems(parsed);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const newTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(newTotal);
    }, [cartItems]);

    const deleteItem = (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;

        const userId = localStorage.getItem('userId');
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem(`cart-${userId}`, JSON.stringify(updatedCart));
    };

    if (loading) {
        return <p>Cargando carrito...</p>;
    }

    if (!isLoggedIn) {
        return <h1>Inicia sesión para ver tu carrito.</h1>;
    }

    return (
        <div className={styles.cartContainer}>
            <h1 className={styles.cartTitle}>Tu carrito</h1>

            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>
                    <table className={styles.cartTable}>
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>
                                    x{item.quantity} {item.price.toFixed(2)}€
                                </td>
                                <td>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className={styles.deleteBtn}
                                        aria-label={`Eliminar ${item.name}`}
                                        title={`Eliminar ${item.name}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className={styles.bottomActions}>
                        <p className={styles.total}>Total: {total.toFixed(2)}€</p>
                        <button
                            className={styles.checkoutBtn}
                            onClick={handlePagarClick}
                            disabled={cartItems.length === 0}
                        >
                            Realizar compra
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
