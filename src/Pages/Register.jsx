import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';
import { AuthContext } from '../components/AuthContext.jsx';

function Register() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        const userData = {
            name: name,
            email: email,
            password: password,
        };

        fetch('http://192.168.0.220:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error('Error en la respuesta del servidor');
                const data = await res.json();
                return data;
            })
            .then((data) => {
                if (data.message === 'Usuario creado correctamente') {
                    if(data.token && data.permisos) {
                        login(data.token, data.permisos);
                    }
                    localStorage.setItem('userId', data.id);
                    localStorage.setItem('userName', data.name || name);

                    navigate('/dashboard');
                } else if (data.message === 'Error, email ya registrado') {
                    setError(data.error || 'Ya existe un usuario con ese correo.');
                } else {
                    setError(data.error || 'Error al registrar el usuario');
                }
            })
            .catch((err) => {
                setError(err.message || 'Error de conexión con el servidor');
            });
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Crear cuenta</h2>

                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Correo electrónico</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label>Confirmar contraseña</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit">Registrar</button>

                <p className="login-link">
                    ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
                </p>
            </form>
        </div>
    );
}

export default Register;
