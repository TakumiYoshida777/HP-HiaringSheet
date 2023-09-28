import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import './Topbar.scss';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Topbar = () => {
    // ユーザー情報を取得
    const currentUser = auth.currentUser;
    // console.log(currentUser, "currentUser");

    // ログインユーザーの登録済みのヒアリングデータ
    const [hiaringData, setHiaringData] = useState([]);

    useEffect(() => {
        const getInitData = async () => {
            // uidに基づいてフィルタリングします
            const q = query(collection(db, "hp-hearing-data"), where("uid", "==", currentUser.uid));
            const data = await getDocs(q);
            // データを取得してhiaringDataステートに設定します。
            const hearingData = data.docs.map(doc => ({ ...doc.data() }));
            setHiaringData(hearingData);
        };
        getInitData();
    }, []);
    return (
        <div className="topbar">
            <nav>
                {hiaringData.length > 0 && (
                    <li>
                        <div>
                            <p className="company-name">{hiaringData[0].companyName}様</p>
                        </div>
                    </li>
                )}

                <li>
                </li>
            </nav>

        </div>
    );
};

export default Topbar;