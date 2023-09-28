import React, { useState } from 'react';
import './Login.scss';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const MANAGEMENT_EMAIL = process.env.REACT_APP_MANAGEMENT_EMAIL;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user.email);
                if (user.email === MANAGEMENT_EMAIL) {
                    navigate('/management-data');
                } else {
                    navigate('/');
                }
            })
            .catch((error) => {
                setError('エラー：ログイン情報が見つかりませんでした。');
            });
    };

    const slideRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <h2>ログイン</h2>
            <form onSubmit={handleSubmit}>
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
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit">ログイン</button>
                </div>
            </form>
            <div className="register-link">
                <button onClick={slideRegister}>新規登録</button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Login;
