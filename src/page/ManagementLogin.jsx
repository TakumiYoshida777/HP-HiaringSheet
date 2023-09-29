import React, { useEffect, useRef, useState } from 'react';
import './ManagementLogin.scss';
import Management from './Management';
import { useNavigate } from 'react-router-dom';



const ManagementLogin = () => {
    const MANAGEMENT_PASS_2 = process.env.REACT_APP_MANAGEMENT_PASS_2;
    const navigate = useNavigate();

    const managementLoginPassRef = useRef(null);
    const [login, setLogin] = useState(false);

    useEffect(() => {
        const loginState = localStorage.getItem('login');
        if (loginState === "true") {
            setLogin(true);
        }
    }, []);

    const handleLogin = () => {
        const enteredPassword = managementLoginPassRef.current.value;
        if (!enteredPassword) {
            alert("パスワードを入力してください。");
        } else if (enteredPassword === MANAGEMENT_PASS_2) {
            setLogin(true);
            localStorage.setItem('login', true);
        } else {
            alert("パスワードが違います。");
        }
    };

    return (
        <>
            {!login ? (
                <>
                    <h1>ログインしてください</h1>
                    <div>
                        PASS<input type="text" name="" id="" ref={managementLoginPassRef} />
                    </div>
                    <button className="btn" onClick={handleLogin}>ログイン</button>
                    <button className="btn" onClick={() => navigate("/login")}>戻る</button>
                </>
            ) : (
                // ログイン成功したら管理画面を表示
                <Management />
            )}
        </>
    );
};

export default ManagementLogin;
