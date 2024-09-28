import React, { createContext, useState, useContext, useEffect } from 'react';

export interface User {
    id: number;
    displayName: string;
    email: string;
    registeredAt: string;
    lastLoginAt: string | null;
    status: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (displayName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on initial load
        (async () => {
            const token = localStorage.getItem('token');
            if (token) {
                await fetchUser(token);
            }
            setIsLoading(false);
        })()
    }, []);

    const fetchUser = async (token: string) => {
        try {
            const response = await fetch('/api/User/Current', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await fetch('/api/User/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const { user, token } = await response.json();
            localStorage.setItem('token', token);
            setUser(user);
        } else {
            throw new Error(await response.text());
        }
    };

    const register = async (displayName: string, email: string, password: string) => {
        const response = await fetch('/api/User/Registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ displayName, email, password }),
        });

        if (response.ok) {
            const { user, token } = await response.json();
            localStorage.setItem('token', token);
            setUser(user);
        } else {
            throw new Error(await response.text());
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
    };

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};