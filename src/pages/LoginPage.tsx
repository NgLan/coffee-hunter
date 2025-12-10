import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../components/features/AuthForm.module.css';
// import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    // const { toast } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [submitError, setSubmitError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (submitError) {
            setSubmitError('');
        }
    };

    // Validate email format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate password strength (at least 2 out of 3: letters, numbers, symbols)
    const validatePassword = (password: string): boolean => {
        if (password.length === 0) return false;

        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]/.test(password);

        const strengthCount = [hasLetters, hasNumbers, hasSymbols].filter(Boolean).length;
        return strengthCount >= 2;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // // Validate format (silently)
        // if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
        //     setSubmitError('メールアドレスまたはパスワードが正しくありません');
        //     return;
        // }

        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const result = login(formData.email, formData.password);

            if (result.success) {
                // Save login state to localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', formData.email);

                // Redirect to home page after 1.5 seconds
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                console.log('Login failed:', result.error);
                const errorMessage = result.error || 'メールアドレスまたはパスワードが正しくありません';
                setSubmitError(errorMessage);
            }

            setIsLoading(false);
        }, 500);
    };

    const handleRegisterLink = () => {
        navigate('/register');
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formWrapper}>
                <div className={styles.header}>
                    <h1 className={styles.appTitle}>Coffee Hunter</h1>
                </div>

                <div className={styles.formContainer}>
                    <h2 className={styles.formTitle}>ログイン</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className={styles.formRow}>
                            <input
                                type="email"
                                placeholder="メールアドレス"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={styles.input}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password */}
                        <div className={styles.formRow}>
                            <input
                                type="password"
                                placeholder="パスワード"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={styles.input}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Submit Error */}
                        {submitError && (
                            <div className={styles.formRow}>
                                <div className={styles.error}>{submitError}</div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'ログイン中...' : 'ログイン'}
                        </button>

                        {/* Register Link */}
                        <div className={styles.linkRow}>
                            <button
                                type="button"
                                onClick={handleRegisterLink}
                                className={styles.link}
                                disabled={isLoading}
                            >
                                アカウントをお持ちでない方はこちら
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
