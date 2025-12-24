import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left side - Title and Description */}
          <div className="hidden lg:flex lg:flex-col lg:justify-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Coffee Hunter
            </h1>
            <p className="text-xs lg:text-sm text-gray-700 leading-relaxed">
              カフェ・コーヒーハンターは、様々な場所でコーヒーを楽しんだ人のための、レコメンド機能を備えたアプリケーションです。より多くの場所を知ることで、まるでハンターのごとく新たな場所を発見することができます。また、様々な飲み方を試すことで、自分好みのコーヒーに出会える可能性も広がります。
            </p>
          </div>

          {/* Right side - Form */}
          <div className="lg:col-span-1">
            {/* Mobile title */}
            <div className="lg:hidden mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Coffee Hunter
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                カフェ・コーヒーハンターは、様々な場所でコーヒーを楽しんだ人のための、レコメンド機能を備えたアプリケーションです。より多くの場所を知ることで、まるでハンターのごとく新たな場所を発見することができます。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h2 className="text-2xl lg:text-2xl font-bold text-center mb-8 text-gray-800">
                ログイン
              </h2>

             <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    placeholder="ユーザー名"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition text-sm md:text-base placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>
                {/* Password Input */}
                <div>
                  <input
                    type="password"
                    placeholder="パスワード"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition text-sm md:text-base placeholder-gray-400"
                    disabled={isLoading}
                  />
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

                        {/* Back to Home Link */}
                        <div className={styles.linkRow}>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className={styles.link}
                                disabled={isLoading}
                            >
                                ホームへ戻る
                            </button>
                        </div>
                    </form>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;