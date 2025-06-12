import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userRole, setUserRole] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const role = localStorage.getItem('userRole') || '';
        setIsLoggedIn(!!token);
        setUserRole(role);

        const handleStorageChange = () => {
            const newToken = localStorage.getItem('userToken');
            const newRole = localStorage.getItem('userRole') || '';
            setIsLoggedIn(!!newToken);
            setUserRole(newRole);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (token, role) => {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRole', role);
        setIsLoggedIn(true);
        setUserRole(role);
    };

    const logout = () => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            localStorage.removeItem(`cart-${userId}`);
        }

        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');

        setIsLoggedIn(false);
        setUserRole('');
    };


    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
