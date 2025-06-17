import { useEffect, useState } from 'react';
import style from '../styles/pagar.module.css';

function Pagar() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const carritoKey = `cart-${userId}`;
        const storedCart = localStorage.getItem(carritoKey);
        const storedProduct = localStorage.getItem('producto_seleccionado');

        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                    setCartItems(parsedCart);
                    return;
                }
            } catch {
                // Ignorar error JSON
            }
        }

        if (storedProduct) {
            try {
                const parsedProduct = JSON.parse(storedProduct);
                setCartItems([{ ...parsedProduct, quantity: 1 }]);
            } catch {
                // Ignorar error JSON
            }
        }
    }, []);

    useEffect(() => {
        const totalPrice = cartItems.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
        );
        setTotal(totalPrice);
    }, [cartItems]);

    return (
        <div className={style.container}>
            <h1 className={style.title}>Página de Pago</h1>

            {cartItems.length > 0 ? (
                <>
                    <div className={style.section}>
                        <h2>Resumen del Pedido</h2>
                        <div className={style.productList}>
                            {cartItems.map((item, index) => (
                                <div key={index} className={style.productItem}>
                                    <span className={style.productName}>
                                        {item.name} (x{item.quantity || 1})
                                    </span>
                                    <span className={style.productPrice}>
                                        {(item.price * (item.quantity || 1)).toFixed(2)}€
                                    </span>
                                </div>
                            ))}
                            <div className={style.productItem}>
                                <strong>Total:</strong>
                                <strong>{total.toFixed(2)}€</strong>
                            </div>
                        </div>
                    </div>

                    {/* Dirección de envío */}
                    <div className={style.section}>
                        <h2>Dirección de Envío</h2>
                        <div className={style.formGroup}>
                            <input type="text" placeholder="Nombre completo" className={style.input} />
                            <input type="text" placeholder="Dirección" className={style.input} />
                            <input type="text" placeholder="Ciudad" className={style.input} />
                            <input type="text" placeholder="Código Postal" className={style.input} />
                            <input type="text" placeholder="País" className={style.input} />
                        </div>
                    </div>

                    {/* Método de pago */}
                    <div className={style.section}>
                        <h2>Método de Pago</h2>
                        <select className={style.select}>
                            <option>Tarjeta de crédito</option>
                            <option>PayPal</option>
                        </select>
                        <div className={style.formGroup}>
                            <input type="text" placeholder="Número de tarjeta" className={style.input} />
                            <input type="text" placeholder="Fecha de expiración" className={style.input} />
                            <input type="text" placeholder="CVV" className={style.input} />
                        </div>
                    </div>

                    <button className={style.button}>Confirmar Pago</button>
                </>
            ) : (
                <p>No hay productos para pagar.</p>
            )}
        </div>
    );
}

export default Pagar;
