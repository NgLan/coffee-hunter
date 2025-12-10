import React, { createContext, useContext, useState } from "react";
import { MOCK_USERS } from "@/mocks/data/users";

// Context cho Authentication
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    // Mock: User đã login (có thể để null nếu muốn test chưa login)
    const [currentUser, setCurrentUser] = useState(() => {
        const savedEmail = localStorage.getItem('userEmail');
        // Nếu có email trong storage, tìm user tương ứng trong MOCK_USERS
        if (savedEmail) {
            const foundUser = MOCK_USERS.find(u => u.email === savedEmail);
            return foundUser || null; // Nếu tìm thấy thì trả về, không thì fallback về default
        }
        return null; // Mặc định nếu chưa có gì trong storage
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const savedEmail = localStorage.getItem('userEmail');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

       return isLoggedIn && !!savedEmail;
    });

    // Hàm login (mock)
    const login = (email, password) => {
        console.log('Attempting login with', email, password);
        const user = MOCK_USERS.find((u) => u.email === email);
        if (!user) {
            return { success: false, error: "アカウントが見つかりません" };
        }
        if (user.password !== password) {
            return { success: false, error: "メールアドレスまたはパスワードが正しくありません" };
        }
        setCurrentUser(user);
        setIsAuthenticated(true);

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);

        return { success: true };
    };

    // Hàm logout
    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
    };

    // Hàm signup (mock)
    const signup = (userData) => {
        const newUser = {
            id: MOCK_USERS.length + 1,
            ...userData,
        };
        MOCK_USERS.push(newUser);
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        return { success: true };
    };

    const value = {
        currentUser,
        isAuthenticated,
        login,
        logout,
        signup,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng Auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
