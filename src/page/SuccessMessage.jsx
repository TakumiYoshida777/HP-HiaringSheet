import React from 'react';
import './SuccessMessage.scss';
import { useNavigate } from 'react-router-dom';


const SuccessMessage = () => {

    const navigate = useNavigate();


    return (
        <div className="successMessage">
            <div className="innerContainer">
                <p className="message">ご協力ありがとうございます。</p>
                <p>内容を保存しました。</p>
                <p>編集も可能ですのでご活用ください。</p>
                <p>確認画面からPDFのダウンロードも可能です。</p>
            </div>
            <div className="btnBlock">
                <button className="prevBtn" onClick={() => { navigate("/"); }}>編集画面へ戻る</button>
            </div>
        </div>
    );
};

export default SuccessMessage;