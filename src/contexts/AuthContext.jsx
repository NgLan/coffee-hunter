import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "@/mocks/data/users";

// Load users from localStorage if available
const loadUsers = () => {
    const savedUsers = localStorage.getItem('mockUsers');
    if (savedUsers) {
        try {
            const parsedUsers = JSON.parse(savedUsers);
            // Merge with MOCK_USERS, keeping saved users
            MOCK_USERS.length = 0;
            MOCK_USERS.push(...parsedUsers);
        } catch (e) {
            console.error('Error loading users from localStorage', e);
        }
    }
};

// Context cho Authentication
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    // Load users on mount
    useEffect(() => {
        loadUsers();
    }, []);

    // Mock: User đã login (có thể để null nếu muốn test chưa login)
    const [currentUser, setCurrentUser] = useState(() => {
        loadUsers();
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
        loadUsers(); // Reload users before login
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
        // Check if email already exists
        const existingUser = MOCK_USERS.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, error: "このメールアドレスは既に登録されています" };
        }

        const newUser = {
            id: MOCK_USERS.length + 1,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
            ...userData,
        };
        MOCK_USERS.push(newUser);
        
        // Save to localStorage for persistence
        localStorage.setItem('mockUsers', JSON.stringify(MOCK_USERS));
        
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', userData.email);
        
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
