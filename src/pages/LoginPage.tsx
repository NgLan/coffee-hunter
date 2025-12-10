import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../components/features/AuthForm.module.css';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = login(formData.email, formData.password);

    if (result.success) {
      toast({
        title: "ログイン成功",
        description: "ログインしました",
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setErrors({ email: result.error || 'ログインに失敗しました' });
    }
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
            <div className={styles.formRow}>
              <input
                type="email"
                placeholder="メールアドレス"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={styles.input}
              />
              {errors.email && <div className={styles.error}>{errors.email}</div>}
            </div>

            <div className={styles.formRow}>
              <input
                type="password"
                placeholder="パスワード"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={styles.input}
              />
              {errors.password && <div className={styles.error}>{errors.password}</div>}
            </div>

            <button type="submit" className={styles.submitButton}>
              ログイン
            </button>

            <div className={styles.linkRow}>
              <button
                type="button"
                onClick={handleRegisterLink}
                className={styles.link}
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
