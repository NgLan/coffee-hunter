import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';
import AuthBackground from '@/components/layout/AuthBackground'; // Đảm bảo bạn đã có component này

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
        <>
            {/* Component nền (nếu bạn chưa có thì nhớ tạo hoặc comment lại) */}
            <AuthBackground />

            <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                
                {/* --- KHUNG CHÍNH (CONTAINER) --- */}
                <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                    
                    {/* --- LEFT SIDE: Intro --- */}
                    {/* lg:border-r: Tạo đường kẻ ngăn cách bên phải */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-gray-50 lg:bg-white lg:border-r border-gray-200">
                        <div className="max-w-md mx-auto lg:mx-0">
                            <h1 className="text-4xl lg:text-5xl font-bold text-amber-700 mb-6">
                                Coffee Hunter
                            </h1>
                            <p className="text-base lg:text-lg text-gray-600 leading-relaxed font-medium text-justify">
                                カフェ・コーヒーハンターは、様々な場所でコーヒーを楽しんだ人のための、レコメンド機能を備えたアプリケーションです。
                                <br /><br />
                                より多くの場所を知ることで、まるでハンターのごとく新たな場所を発見することができます。また、様々な飲み方を試すことで、自分好みのコーヒーに出会える可能性も広がります。
                            </p>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: Form --- */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 text-gray-800">
                                ログイン
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                        disabled={isLoading}
                                    />
                                </div>
                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Error Message */}
                                {submitError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                                        {submitError}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold py-3.5 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-md"
                                >
                                    {isLoading ? 'ログイン中...' : 'ログイン'}
                                </button>

                                {/* Register Link (Màu vàng nhạt) */}
                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={handleRegisterLink}
                                        disabled={isLoading}
                                        className="w-full bg-yellow-100 hover:bg-yellow-200 disabled:bg-gray-100 text-amber-900 font-bold py-3.5 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-sm mt-2"
                                    >
                                        アカウント作成
                                    </button>
                                </div>

                                {/* Back to Home Link (Giữ lại nút này từ code cũ của bạn) */}
                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        disabled={isLoading}
                                        className="text-amber-600 hover:text-amber-700 disabled:text-amber-400 disabled:cursor-not-allowed text-sm underline transition"
                                    >
                                        ホームページへ戻る
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;