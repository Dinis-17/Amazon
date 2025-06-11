import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        const userData = { email, password };

        fetch('http://192.168.0.220:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Error en la respuesta del servidor');
                return data;
            })
            .then((data) => {
                if (data.success) {
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('userRole', data.permisos);
                    navigate('/dashboard');
                } else {
                    throw new Error(data.message || 'Error al iniciar sesión');
                }
            })
            .catch((err) => {
                setError(err.message || 'Error de conexión con el servidor');
            });
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Iniciar sesión</h2>

                {error && <p className="error-message">{error}</p>}

                <label>Correo electrónico</label>
                <input
                    type="email"
                    id="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    id="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Entrar</button>

                <p className="register-link">
                    ¿No tienes cuenta? <a href="/register">Regístrate</a>
                </p>
            </form>
        </div>
    );
}

export default Login;
