import React, { useEffect, useRef, useState } from 'react';
import './ManagementLogin.scss';
import Management from './Management';

const ManagementLogin = () => {
    const MANAGEMENT_PASS_2 = process.env.REACT_APP_MANAGEMENT_PASS_2;


    const managementLoginPassRef = useRef(null);
    const [login, setLogin] = useState(false);

    const handleLogin = () => {
        const enteredPassword = managementLoginPassRef.current.value;
        if (!enteredPassword) {
            alert("パスワードを入力してください。");
        } else if (enteredPassword === MANAGEMENT_PASS_2) {
            setLogin(true);
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
                </>
            ) : (
                // ログイン成功したら管理画面を表示
                <Management />
            )}
        </>
    );
};

export default ManagementLogin;
