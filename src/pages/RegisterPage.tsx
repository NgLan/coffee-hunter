import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../components/features/AuthForm.module.css';
import { useToast } from '@/hooks/use-toast';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        fullname: '',
        year: '',
        month: '',
        day: '',
        gender: '',
        username: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validate name
        if (!formData.fullname.trim()) {
            newErrors.fullname = 'お名前を入力してください';
        }

        // Validate birthday
        if (!formData.year || !formData.month || !formData.day) {
            newErrors.birthday = '生年月日を入力してください';
        } else {
            const year = parseInt(formData.year);
            const month = parseInt(formData.month);
            const day = parseInt(formData.day);
            
            // Check if values are valid numbers
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                newErrors.birthday = '有効な数字を入力してください';
            } else if (year < 1900 || year > new Date().getFullYear()) {
                newErrors.birthday = '有効な年を入力してください（1900〜現在）';
            } else if (month < 1 || month > 12) {
                newErrors.birthday = '有効な月を入力してください（1〜12）';
            } else if (day < 1 || day > 31) {
                newErrors.birthday = '有効な日を入力してください（1〜31）';
            } else {
                // Check if the date is valid (e.g., Feb 30 doesn't exist)
                const dateObj = new Date(year, month - 1, day);
                if (
                    dateObj.getFullYear() !== year ||
                    dateObj.getMonth() !== month - 1 ||
                    dateObj.getDate() !== day
                ) {
                    newErrors.birthday = '存在しない日付です';
                }
                // Check if date is not in the future
                else if (dateObj > new Date()) {
                    newErrors.birthday = '未来の日付は入力できません';
                }
            }
        }

        // Validate gender
        if (!formData.gender) {
            newErrors.gender = '性別を選択してください';
        }

        // Validate username
        if (!formData.username.trim()) {
            newErrors.username = 'ユーザー名を入力してください';
        }

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = 'メールアドレスを入力してください';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '有効なメールアドレスを入力してください';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'パスワードを入力してください';
        } else if (formData.password.length < 6) {
            newErrors.password = 'パスワードは6文字以上である必要があります';
        } else {
            // Check password contains at least 2 of: uppercase, lowercase, numbers, symbols (except " and ')
            const hasUppercase = /[A-Z]/.test(formData.password);
            const hasLowercase = /[a-z]/.test(formData.password);
            const hasNumber = /[0-9]/.test(formData.password);
            const hasSymbol = /[^A-Za-z0-9"']/.test(formData.password);
            
            const conditionsMet = [hasUppercase, hasLowercase, hasNumber, hasSymbol].filter(Boolean).length;
            
            if (conditionsMet < 2) {
                newErrors.password = 'パスワードは大文字、小文字、数字、記号（"と\'を除く）のうち少なくとも2種類を含む必要があります';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const birthday = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;

        const result = signup({
            name: formData.username,
            email: formData.email,
            password: formData.password,
            birthday,
            gender: formData.gender as 'male' | 'female' | 'other'
        });

        if (result.success) {
            toast({
                title: "登録完了",
                description: "アカウントの登録が完了しました",
            });

            // Redirect to login page after 1.5 seconds
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } else {
            // Show error if registration fails
            setErrors({ email: result.error || '登録に失敗しました' });
        }
    };

    const handleLoginLink = () => {
        navigate('/login');
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formWrapper}>
                <div className={styles.header}>
                    <h1 className={styles.appTitle}>Coffee Hunter</h1>
                </div>

                <div className={styles.formContainer}>
                    <h2 className={styles.formTitle}>アカウント作成</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className={styles.formRow}>
                            <input
                                type="text"
                                placeholder="お名前"
                                value={formData.fullname}
                                onChange={(e) => handleInputChange('fullname', e.target.value)}
                                className={styles.input}
                            />
                            {errors.fullname && <div className={styles.error}>{errors.fullname}</div>}
                        </div>

                        {/* Birthday */}
                        <div className={styles.formRow}>
                            <div className={styles.birthdayRow}>
                                <input
                                    type="text"
                                    placeholder="日"
                                    value={formData.day}
                                    onChange={(e) => handleInputChange('day', e.target.value)}
                                    className={styles.birthdayInput}
                                />                            

                                <input
                                    type="text"
                                    placeholder="月"
                                    value={formData.month}
                                    onChange={(e) => handleInputChange('month', e.target.value)}
                                    className={styles.birthdayInput}
                                />

                                <input
                                    type="text"
                                    placeholder="年"
                                    value={formData.year}
                                    onChange={(e) => handleInputChange('year', e.target.value)}
                                    className={styles.birthdayInput}
                                />
                            </div>
                            {errors.birthday && <div className={styles.error}>{errors.birthday}</div>}
                        </div>

                        {/* Gender */}
                        <div className={styles.formRow}>
                            <div className={styles.genderRow}>
                                <label className={styles.genderOption}>
                                    <span>男</span>
                                    <input
                                        type="radio"
                                        value="male"
                                        name="gender"
                                        checked={formData.gender === 'male'}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                    />
                                </label>
                                <label className={styles.genderOption}>
                                    <span>女</span>
                                    <input
                                        type="radio"
                                        value="female"
                                        name="gender"
                                        checked={formData.gender === 'female'}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                    />
                                </label>
                            </div>
                            {errors.gender && <div className={styles.error}>{errors.gender}</div>}
                        </div>

                        {/* Username */}
                        <div className={styles.formRow}>
                            <input
                                type="text"
                                placeholder="ユーザー名"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className={styles.input}
                            />
                            {errors.username && <div className={styles.error}>{errors.username}</div>}
                        </div>

                        {/* Email */}
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

                        {/* Password */}
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

                        {/* Submit Button */}
                        <button type="submit" className={styles.submitButton}>
                            新規登録
                        </button>

                        {/* Login Link */}
                        <div className={styles.linkRow}>
                            <button
                                type="button"
                                onClick={handleLoginLink}
                                className={styles.link}
                            >
                                すでにアカウントをお持ちの方はこちら
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
