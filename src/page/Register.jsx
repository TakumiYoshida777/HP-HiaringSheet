import React, { useState } from 'react';
import './Register.scss';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (newPassword.length < 8) {
            setPasswordError('パスワードは8文字以上である必要があります');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
    };

    const handleSubmit = async (e) => {
        if (password.length < 8) {
            e.preventDefault();
            alert('パスワードは8文字以上である必要があります');
            return;
        }

        e.preventDefault();
        const auth = getAuth();

        if (confirmPassword === password) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                // ユーザーのdisplayNameをcompanyNameに設定します
                await updateProfile(userCredential.user, {
                    displayName: companyName,
                });

                console.log('新しいユーザーが登録されました', userCredential.user);

                // フォームフィールドとエラーステートをクリアします
                setCompanyName('');
                setEmail('');
                setPassword('');
                setError(null);
                navigate('/');
            } catch (error) {
                setError(error.message);
            }
        } else {
            alert('確認用パスワードが違います。');
        }
    };


    const slideLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <h2>新規登録</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="companyName">会社名</label>
                    <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">メールアドレス</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">パスワード</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <span className="error-message">{passwordError}</span>
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">パスワード【確認】</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                </div>
                <div className="form-group btns-flex">
                    <button type="submit">登録</button>
                    <div className="login-link-btn" onClick={slideLogin}>ログイン画面へ</div>
                </div>
            </form>
            <div >

            </div>
        </div>
    );
};

export default Register;
