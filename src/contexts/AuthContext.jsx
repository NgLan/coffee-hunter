import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "@/mocks/data/users";

/**
 * Hàm loadUsers cải tiến:
 * 1. Nếu localStorage trống: Khởi tạo dữ liệu từ MOCK_USERS vào localStorage.
 * 2. Nếu đã có dữ liệu: Lấy dữ liệu từ localStorage nhưng bổ sung các trường còn thiếu 
 * (như location, registration_date) từ file MOCK_USERS gốc.
 */
const loadUsers = () => {
    const savedUsersStr = localStorage.getItem('mockUsers');

    if (!savedUsersStr) {
        // Trường hợp lần đầu truy cập hoặc vừa xóa Storage: Lưu MOCK_USERS vào LocalStorage
        localStorage.setItem('mockUsers', JSON.stringify(MOCK_USERS));
        return;
    }

    try {
        const parsedSavedUsers = JSON.parse(savedUsersStr);

        // Tiến hành Merge: Giữ lại thông tin đã sửa trong Storage, 
        // nhưng bổ sung các trường mới từ code gốc (như location, registration_date)
        const updatedList = MOCK_USERS.map(defaultUser => {
            const savedUser = parsedSavedUsers.find(u => u.id === defaultUser.id);
            if (savedUser) {
                // Ưu tiên thông tin trong savedUser, bổ sung trường mới từ defaultUser
                return { ...defaultUser, ...savedUser };
            }
            return defaultUser;
        });

        // Cập nhật lại MOCK_USERS trong bộ nhớ app
        MOCK_USERS.length = 0;
        MOCK_USERS.push(...updatedList);

        // Đồng bộ ngược lại LocalStorage để lần sau không bị thiếu trường nữa
        localStorage.setItem('mockUsers', JSON.stringify(MOCK_USERS));
    } catch (e) {
        console.error('Error loading users from localStorage', e);
    }
};

// Context cho Authentication
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    // Load users ngay khi Provider mount
    useEffect(() => {
        loadUsers();
    }, []);

    const [currentUser, setCurrentUser] = useState(() => {
        loadUsers(); // Đảm bảo dữ liệu đã được merge trước khi tìm user
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            const foundUser = MOCK_USERS.find(u => u.email === savedEmail);
            return foundUser || null;
        }
        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const savedEmail = localStorage.getItem('userEmail');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        return isLoggedIn && !!savedEmail;
    });

    // Hàm login (mock)
    const login = (email, password) => {
        loadUsers(); // Luôn load/merge trước khi check login
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
        const existingUser = MOCK_USERS.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, error: "このメールアドレスは既に登録されています" };
        }

        const newUser = {
            id: MOCK_USERS.length + 1,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
            // Mặc định cho user mới đăng ký
            location: "ベトナム・ハノイ",
            registration_date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
            ...userData,
        };

        MOCK_USERS.push(newUser);
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
