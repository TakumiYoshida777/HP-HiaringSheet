import React, { useEffect, useRef, useState } from 'react';
import './Management.scss';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import CorporateList from './CorporateList/CorporateList';


const Management = () => {
    const emailRef = useRef(null);
    // const companyRef = useRef(null);
    // const telRef = useRef(null);

    const [hiaringData, setHiaringData] = useState();
    // console.log(hiaringData, "hiaringData");
    // データを検索する関数
    const searchHiaringData = async (e) => {
        e.preventDefault();

        // ユーザーが入力した検索条件を取得します
        const email = emailRef.current.value;

        // Firestoreのクエリを作成します
        const q = query(collection(db, "hp-hearing-data"), where("email", "==", email));

        try {
            const querySnapshot = await getDocs(q);

            // クエリ結果をhiaringDataステートに設定します
            setHiaringData(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        } catch (error) {
            console.error("Error searching data:", error);
        }
    };
    useEffect(() => {
        // コンポーネントがマウントされたときに実行されるデータ取得関数
        const getHearingItems = async () => {
            const data = await getDocs(collection(db, "hp-hearing-data"));
            // データを取得してhiaringDataステートに設定します。
            setHiaringData(data.docs.map(doc => ({ ...doc.data() })));
        };
        // コンポーネントがマウントされたときに一度だけデータを取得します。
        getHearingItems();
    }, []);

    return (
        <div className="Management">
            <div className="searchBar">
                <div className="searchBar__email searchBar__item">
                    <div>Email</div>
                    <input type="email" name="" id="" ref={emailRef} />
                </div>
                {/* <div className="searchBar__companyName searchBar__item">
                    <div>会社名</div>
                    <input type="text" name="" id="" ref={companyRef} />
                </div>
                <div className="searchBar__tel searchBar__item">
                    <div>電話番号</div>
                    <input type="tel" name="" id="" ref={telRef} />
                </div> */}
                <button className="btn btn-border searchBtn" onClick={(e) => searchHiaringData(e)}>検索</button>
            </div>
            <CorporateList hiaringData={hiaringData} />
        </div>
    );
};

export default Management;
