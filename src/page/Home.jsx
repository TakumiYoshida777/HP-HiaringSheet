import React, { useEffect, useRef, useState } from 'react';
import './Home.scss';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Topbar from '../components/Topbar/Topbar';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Home = () => {

    // ユーザー情報を取得
    const currentUser = auth.currentUser;

    // ログインユーザーの登録済みのヒアリングデータ
    const [hiaringData, setHiaringData] = useState([]);
    // console.log(hiaringData, "hiaringData");

    // 会社情報
    const [companyName, setCompanyName] = useState(''); // 会社名
    const [companyNameKana, setCompanyNameKana] = useState(''); // 会社名（カナ）
    const [industry, setIndustry] = useState(''); // 業界
    const [contactName, setContactName] = useState(''); // 連絡担当者名
    const [position, setPosition] = useState(''); // 役職
    const [tel, setTel] = useState(''); // 電話番号
    const [chatTool, setChatTool] = useState(''); // チャットツール
    const [otherRequests, setOtherRequests] = useState(''); // その他の要望
    const [websitePurpose, setWebsitePurpose] = useState(''); // ウェブサイトの目的
    const [referenceSiteUrl, setReferenceSiteUrl] = useState(''); // 参考サイトURL

    const [strongPoint, setStrongPoint] = useState(''); // 企業の強み
    const [target, setTarget] = useState(''); // ターゲット
    const [useCms, setUseCms] = useState(''); // CMSの使用
    const [device, setDevice] = useState(''); // デバイス
    const [deadline, setDeadline] = useState(''); // 締切日
    const [budget, setBudget] = useState(''); // 予算

    // console.log(otherRequests, "その他ご要望");

    // その他のフィールドも同様にuseStateを使用して管理
    // フォームの状態を管理するためのuseStateフック
    const [designData, setDesignData] = useState('有');
    const [spData, setSpData] = useState('有');
    const [photoData, setPhotoData] = useState('有');
    const [domainData, setDomainData] = useState('有');
    const [serverData, setServerData] = useState('有');
    const [moreMenu, setMoreMenu] = useState(['']);//メニュー追加リスト
    const [competitors, setCompetitors] = useState(['']);//競合サイトリスト
    // チェックボックスの状態を管理するためのuseStateフック
    const [selectedValues, setMenuSelectedValues] = useState([]);
    // SNSチェックボックスの状態を管理するためのuseStateフック
    const [selectedSnsValues, setSelectedSnsValues] = useState([]);

    //確認画面の切り替え用
    const [confirmState, setConfirmState] = useState(false);
    const handleConfirmHiaringSheet = () => {
        setConfirmState(prevState => !prevState);
    };
    const navigate = useNavigate();



    // console.log("designData:", designData, "photoData:", photoData, "spData:", spData);
    // console.log("selectedSnsValues", selectedSnsValues);

    //初期化処理
    useEffect(() => {
        if (currentUser) {
            // コンポーネントがマウントされたときに実行されるデータ取得関数
            const getHearingItems = async () => {
                try {
                    // uidに基づいてフィルタリングします
                    const q = query(collection(db, "hp-hearing-data"), where("uid", "==", currentUser.uid));
                    const data = await getDocs(q);
                    // データを取得してhiaringDataステートに設定します。
                    const hearingData = data.docs.map(doc => ({ ...doc.data() }));
                    setHiaringData(hearingData);

                    if (hearingData.length > 0) {
                        const data = hearingData[0]; // データを取得

                        // 各項目の初期状態を設定
                        setCompanyName(data.companyName);
                        setCompanyNameKana(data.companyNameKana);
                        setIndustry(data.industry);
                        setContactName(data.contactName);
                        setPosition(data.position);
                        setTel(data.tel);
                        setChatTool(data.chatTool);
                        setOtherRequests(data.otherRequests);
                        setWebsitePurpose(data.websitePurpose);
                        setReferenceSiteUrl(data.referenceSiteUrl);
                        setStrongPoint(data.strongPoint);
                        setTarget(data.target);
                        setUseCms(data.useCms);
                        setDevice(data.device);
                        setDeadline(data.deadline);
                        setBudget(data.budget);
                        setCompetitors(data.competitors);

                        // その他のフィールドの初期状態も設定
                        setDesignData(data.designData);
                        setSpData(data.sp);
                        setPhotoData(data.photoData);
                        setDomainData(data.domainData);
                        setServerData(data.serverData);

                        // チェックボックスの初期状態を設定
                        setMenuSelectedValues(data.menu); // メニューはカンマ区切りの文字列と仮定
                        setMoreMenu(data.otherMenu); //その他メニュー
                        setSelectedSnsValues(data.connectSns); // SNS
                    }

                } catch (error) {
                    console.log(error);
                }
            };
            // コンポーネントがマウントされたときに一度だけデータを取得します。
            getHearingItems();
        }
    }, []);


    // console.log(selectedSnsValues, "SNS 選択");

    //SNSのチェック状態の初期表示
    useEffect(() => {
        // selectedSnsValuesに含まれる値と一致するcheckboxを選択する
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            if (selectedSnsValues.includes(checkbox.value)) {
                checkbox.checked = true;
            }
            if (selectedValues.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }, [selectedSnsValues, confirmState]);


    // デザインデータの変更ハンドラー
    const handleDesignDataChange = (event) => {
        setDesignData(event.target.value);
    };
    // SPの変更ハンドラー
    const handleSpDataChange = (event) => {
        setSpData(event.target.value);
    };
    // 素材画像の変更ハンドラー
    const handlePhotoDataChange = (event) => {
        setPhotoData(event.target.value);
    };
    // ドメインの変更ハンドラー
    const handleDomainDataChange = (event) => {
        setDomainData(event.target.value);
    };
    // ドメインの変更ハンドラー
    const handleServerDataChange = (event) => {
        setServerData(event.target.value);
    };

    // 「その他」メニューアイテムを追加
    const handleAddItem = () => {
        setMoreMenu([...moreMenu, '']);
    };

    // 「その他」メニューアイテムを削除
    const handleRemoveItem = (index) => {
        const updatedItems = [...moreMenu];
        updatedItems.splice(index, 1);
        setMoreMenu(updatedItems);
    };

    // 競合サイトのリストを追加
    const handleAddCompetitor = () => {
        setCompetitors([...competitors, '']);
    };

    // 競合サイトのリストを削除
    const handleRemoveCompetitor = (index) => {
        const updatedCompetitors = [...competitors];
        updatedCompetitors.splice(index, 1);
        setCompetitors(updatedCompetitors);
    };

    // チェックボックスの変更ハンドラー
    const handleMenuCheckBoxChange = (event) => {
        const value = event.target.value;

        if (event.target.checked) {
            // チェックボックスがチェックされた場合
            // selectedValues 配列に新しい値を追加します。
            setMenuSelectedValues([...selectedValues, value]);
        } else {
            // チェックボックスのチェックが外れた場合
            // selectedValues 配列から対応する値を削除します。
            setMenuSelectedValues(selectedValues.filter((item) => item !== value));
        }
    };

    // console.log(selectedValues, "selectedValues");
    // チェックボックスの変更ハンドラー【SNS】
    const handleSnsCheckBoxChange = (event) => {
        const value = event.target.value;
        if (event.target.checked) {
            // チェックされた場合、selectedSnsValuesに追加
            setSelectedSnsValues([...selectedSnsValues, value]);
        } else {
            // チェックが外れた場合、selectedSnsValuesから削除
            const updatedValues = selectedSnsValues.filter((item) => item !== value);
            setSelectedSnsValues(updatedValues);
        }
    };

    // フォームデータをFirebaseに送信
    const createHpHearingData = async (e) => {
        e.preventDefault();

        let confirmRes = window.confirm("内容を管理者に送信します。");

        if (confirmRes) {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるため+1する
            const day = currentDate.getDate().toString().padStart(2, '0');
            const hours = currentDate.getHours().toString().padStart(2, '0');
            const minutes = currentDate.getMinutes().toString().padStart(2, '0');

            const formattedDate = `${year}年${month}月${day}日 ${hours}:${minutes}`;

            try {
                // 更新または作成したいドキュメントへの参照を取得
                const hpHearingDocRef = doc(db, "hp-hearing-data", currentUser.uid);

                // ドキュメントが存在するかどうかを確認してから更新します
                const docSnapshot = await getDoc(hpHearingDocRef);
                const hpHearingCollection = collection(db, "hp-hearing-data");
                if (docSnapshot.exists()) {
                    await updateDoc(doc(hpHearingCollection, currentUser.uid), {
                        uid: currentUser.uid,
                        companyName: companyName, // 会社名
                        companyNameKana: companyNameKana, // 会社名（フリガナ）
                        industry: industry, // 業種
                        contactName: contactName, // 担当者名
                        position: position, // 役職
                        dateTime: formattedDate, // 日時
                        tel: tel, // 電話番号
                        chatTool: chatTool, // 指定のチャットツール
                        email: currentUser.email, // メールアドレス
                        sp: spData, // SP対応の有無
                        designData: designData, // デザインの有無
                        photoData: photoData, // 素材画像の有無
                        menu: selectedValues, // メニュー
                        otherMenu: moreMenu, // その他メニュー
                        competitors: competitors, // 競合サイト
                        strongPoint: strongPoint, //企業の強み
                        websitePurpose: websitePurpose, // HPの使用目的
                        referenceSiteUrl: referenceSiteUrl, // 参考サイトURL
                        target: target, // ターゲット
                        domainData: domainData, // ドメインの有無
                        serverData: serverData, // サーバーの有無
                        useCms: useCms, // CMS
                        device: device, // 対応デバイス
                        connectSns: selectedSnsValues, //SNS連携
                        deadline: deadline, // 納期
                        budget: budget, // 予算
                        otherRequests: otherRequests, // その他ご要望
                    });

                    console.log("新規ドキュメント");
                } else {
                    // ドキュメントが存在しない場合、新しいドキュメントを作成します
                    await setDoc(doc(hpHearingCollection, currentUser.uid), {
                        uid: currentUser.uid,
                        companyName: companyName, // 会社名
                        companyNameKana: companyNameKana, // 会社名（フリガナ）
                        industry: industry, // 業種
                        contactName: contactName, // 担当者名
                        position: position, // 役職
                        dateTime: formattedDate, // 日時
                        tel: tel, // 電話番号
                        chatTool: chatTool, // 指定のチャットツール
                        email: currentUser.email, // メールアドレス
                        sp: spData, // SP対応の有無
                        designData: designData, // デザインの有無
                        photoData: photoData, // 素材画像の有無
                        menu: selectedValues, // メニュー
                        otherMenu: moreMenu, // その他メニュー
                        competitors: competitors, // 競合サイト
                        strongPoint: strongPoint, //企業の強み
                        websitePurpose: websitePurpose, // HPの使用目的
                        target: target, // ターゲット
                        domainData: domainData, // ドメインの有無
                        serverData: serverData, // サーバーの有無
                        useCms: useCms, // CMS
                        device: device, // 対応デバイス
                        connectSns: selectedSnsValues, //SNS連携
                        deadline: deadline, // 納期
                        budget: budget, // 予算
                        otherRequests: otherRequests, // その他ご要望
                    });
                    console.log("更新ドキュメント");
                }
                navigate('/success');
            } catch (error) {
                console.log(error);
            }
        } else {
            return;
        }
    };

    //クリアボタン押下
    const handleClear = () => {
        let confirmRes = window.confirm("入力されている内容が全て初期化されます。よろしいですか？");

        if (confirmRes) {

            // 各入力フィールドの値を初期状態にリセット
            setCompanyName('');
            setCompanyNameKana('');
            setIndustry('');
            setContactName('');
            setPosition('');
            setTel('');
            setChatTool('');
            setWebsitePurpose('');
            setReferenceSiteUrl('');
            setTarget('');
            setUseCms('');
            setDevice('');
            setDeadline('');
            setBudget('');
            setOtherRequests('');
            setStrongPoint("");

            // SP, デザイン, 素材画像, ドメイン, サーバーのラジオボタンの初期化
            setSpData('有');
            setDesignData('有');
            setPhotoData('有');
            setDomainData('有');
            setServerData('有');

            // チェックボックスの選択解除
            const checkBox = document.querySelectorAll("input[type=checkbox]");
            checkBox.forEach(element => {
                element.checked = false;
            });
        } else {
            return;
        }

    };

    // フォームフィールドが変更されたときに対応するuseStateを更新します
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'companyName':
                setCompanyName(value);

                break;
            case 'companyNameKana':
                setCompanyNameKana(value);
                break;
            case 'industry':
                setIndustry(value);
                break;
            case 'contactName':
                setContactName(value);
                break;
            case 'position':
                setPosition(value);
                break;
            case 'tel':
                setTel(value);
                break;
            case 'chatTool':
                setChatTool(value);
                break;
            case 'otherRequests':
                setOtherRequests(value); // その他の要望
                break;
            case 'websitePurpose':
                setWebsitePurpose(value); // ウェブサイトの目的
                break;
            case 'referenceSiteUrl':
                setReferenceSiteUrl(value); // 参考サイトURL
                break;
            case 'strongPoint':
                setStrongPoint(value); //企業の強み
                break;
            case 'target':
                setTarget(value); // ターゲット
                break;
            case 'useCms':
                setUseCms(value); // CMSの使用
                break;
            case 'device':
                setDevice(value); // デバイス
                break;
            case 'deadline':
                setDeadline(value); // 締切日
                break;
            case 'budget':
                if (value > 0) {//1以上ならture
                    setBudget(value); // 予算
                } else {
                    return;
                }
                break;
            case 'otherRequests':
                setOtherRequests(value); //その他のご要望
            default:
                break;
        }
    };


    //PDFダウンロード機能
    const generatePDF = async () => {
        const pdf = new jsPDF('p', 'pt', 'letter'); // ページサイズを指定
        const contentToPdf = document.getElementById('user-content-to-pdf');
        const pageHeight = pdf.internal.pageSize.height;

        // 1ページ目を生成
        const firstPageCanvas = await html2canvas(contentToPdf);
        const firstPageImgData = firstPageCanvas.toDataURL('image/png');
        pdf.addImage(firstPageImgData, 'PNG', 40, 40, firstPageCanvas.width * 0.75, firstPageCanvas.height * 0.75);

        // 2ページ目を生成
        if (firstPageCanvas.height > pageHeight) {
            pdf.addPage();
            pdf.setPage(2); // 2ページ目をアクティブに
            pdf.addImage(firstPageImgData, 'PNG', 40, -pageHeight + 40, firstPageCanvas.width * 0.75, firstPageCanvas.height * 0.75);
        }

        pdf.save('downloaded.pdf');
    };
    return (
        <div className='home'>
            <Topbar />

            <h1 className="home-title">HPヒアリングシート</h1>

            <div className="container">
                <div className="firstMessage">
                    <p>※企業秘密な情報のご入力はお控えください。</p>
                </div>
                <form onSubmit={(e) => createHpHearingData(e)}>
                    {!confirmState
                        ?
                        <>
                            <h2 className="list-title">会社情報</h2>
                            <ul className="list company">
                                <li className="item">
                                    <label>会社名</label>
                                    <input
                                        type="text"
                                        required
                                        name="companyName"
                                        value={companyName}
                                        onChange={handleInputChange}
                                    />
                                </li>
                                <li className="item">
                                    <label>会社名（フリガナ）</label>
                                    <input
                                        type="text"
                                        required
                                        name="companyNameKana"
                                        value={companyNameKana}
                                        onChange={handleInputChange}
                                    />
                                </li>
                                <li className="item">
                                    <label>業種</label>
                                    <input
                                        type="text"
                                        required
                                        name="industry"
                                        value={industry}
                                        onChange={handleInputChange}
                                    />
                                </li>
                                <li className="item">
                                    <label>ご担当者様名</label>
                                    <input
                                        type="text"
                                        required
                                        name="contactName"
                                        value={contactName}
                                        onChange={handleInputChange}
                                    />
                                </li>
                                <li className="item">
                                    <label>役職</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={position}
                                        onChange={handleInputChange}
                                    />
                                </li>
                                <li className="item">
                                    <label>電話番号</label>
                                    <input
                                        type="text"
                                        required
                                        name="tel"
                                        value={tel}
                                        onChange={handleInputChange}
                                    />
                                </li>
                                <li className="item">
                                    <label>メールアドレス</label>
                                    <div>
                                        {currentUser.email}
                                    </div>
                                </li>
                                <li className="item">
                                    <label>希望のチャットツール</label>
                                    <input
                                        type="text"
                                        required
                                        name="chatTool"
                                        value={chatTool}
                                        onChange={handleInputChange}
                                    />
                                </li>
                            </ul>
                            <hr />
                            <h2 className="list-title">HP情報</h2>
                            <ul className="list hp">
                                <li className="item">
                                    <div>SP対応</div>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="spRadio"
                                                value="有"
                                                checked={spData === '有'} // 選択状態を管理するためにchecked属性を設定
                                                onChange={handleSpDataChange}
                                            />
                                            有
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="spRadio"
                                                value="無"
                                                checked={spData === '無'} // 選択状態を管理するためにchecked属性を設定
                                                onChange={handleSpDataChange}
                                            />
                                            無
                                        </label>
                                    </div>
                                </li>
                                <li className="item">
                                    <div>素材画像の有無</div>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="radio-photo-data"
                                                value="有"
                                                checked={photoData === '有'} // 選択状態を管理するためにchecked属性を設定
                                                onChange={handlePhotoDataChange}
                                            />
                                            有
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="radio-photo-data"
                                                value="無"
                                                checked={photoData === '無'} // 選択状態を管理するためにchecked属性を設定
                                                onChange={handlePhotoDataChange}
                                            />
                                            無
                                        </label>
                                    </div>
                                </li>
                                <li className="item">
                                    <label>デザインの有無</label>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="radio-design-data"
                                                value="有"
                                                onChange={handleDesignDataChange}
                                                checked={designData === '有'}
                                            />有
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="radio-design-data"
                                                value="無"
                                                onChange={handleDesignDataChange}
                                                checked={designData === '無'}
                                            />無
                                        </label>
                                    </div>
                                </li>
                            </ul>
                            {designData === "無" &&
                                <div className="newsiteMenu">
                                    <h2>必要なメニュー</h2>
                                    {hiaringData.length !== 0 &&
                                        hiaringData[0].menu &&
                                        <div className="registeredMenuContainer">登録済みのメニュー　：
                                            <span className="registeredMenu">{hiaringData[0].menu},{hiaringData[0].otherMenu}</span>
                                        </div>
                                    }
                                    <div className="selectedMenuContainer">
                                        選択中のメニュー：
                                        {selectedValues
                                        }
                                    </div>
                                    <ul className="required-menu-list">
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="ホーム"
                                                    onChange={handleMenuCheckBoxChange}

                                                />ホーム

                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="企業情報"
                                                    onChange={handleMenuCheckBoxChange} />企業情報
                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="会社概要"
                                                    onChange={handleMenuCheckBoxChange} />会社概要
                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="会社理念"
                                                    onChange={handleMenuCheckBoxChange} />会社理念
                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="事業内容"
                                                    onChange={handleMenuCheckBoxChange} />事業内容
                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="サービス"
                                                    onChange={handleMenuCheckBoxChange} />サービス
                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="求人"
                                                    onChange={handleMenuCheckBoxChange} />求人
                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="メンバーやスタッフの紹介"
                                                    onChange={handleMenuCheckBoxChange} />メンバーやスタッフの紹介

                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="ニュース"
                                                    onChange={handleMenuCheckBoxChange} />ニュース
                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="投資家情報"
                                                    onChange={handleMenuCheckBoxChange} />投資家情

                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="沿革"
                                                    onChange={handleMenuCheckBoxChange} />沿革
                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="料金"
                                                    onChange={handleMenuCheckBoxChange} />料金
                                            </label>
                                        </li>
                                        <li>
                                            <label className="menu-list-item">
                                                <input type="checkbox" name="" value="お問い合わせ"
                                                    onChange={handleMenuCheckBoxChange} />お問いわせ
                                            </label>
                                        </li>
                                    </ul>
                                    <div>※その他メニュー</div>
                                    <ul>
                                        {moreMenu.map((item, index) => (
                                            <li key={index} className="rival-site">
                                                <input
                                                    className="moremenu-item add-menu"
                                                    type="text"
                                                    name={`additional-item-${index}`}
                                                    value={item}
                                                    onChange={(e) => {
                                                        const updatedItems = [...moreMenu];
                                                        updatedItems[index] = e.target.value;
                                                        setMoreMenu(updatedItems);
                                                    }}
                                                />
                                                <button className="delete-btn" type="button" onClick={() => handleRemoveItem(index)}>削除</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="add-btn" onClick={handleAddItem}>+</div>
                                </div>
                            }
                            <hr />
                            <h2>詳細</h2>
                            <ul className="list requirement">
                                <li className="item">
                                    <label>会社の強み</label>
                                    <textarea className="strongPoint"
                                        name="strongPoint"
                                        value={strongPoint}
                                        onChange={(e) => {
                                            // 文字数制限を800文字に制限
                                            if (e.target.value.length <= 600) {
                                                handleInputChange(e);
                                            } else {
                                                alert("orver");
                                            }
                                        }}
                                    ></textarea>
                                </li>
                                <li className="item">
                                    <label>競合サイト</label>
                                    <div>
                                        <ul>
                                            {competitors.map((competitor, index) => (
                                                <li key={index} className="rival-site add-menu">
                                                    <input
                                                        name="competitors"
                                                        type="text"
                                                        value={competitor}
                                                        onChange={(e) => {
                                                            const updatedCompetitors = [...competitors];
                                                            updatedCompetitors[index] = e.target.value;
                                                            setCompetitors(updatedCompetitors);
                                                        }}
                                                    />
                                                    <button className="delete-btn" type="button" onClick={() => handleRemoveCompetitor(index)}>削除</button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="add-btn" onClick={handleAddCompetitor}>+</div>
                                    </div>
                                </li>
                                <li className="item">
                                    <label>HPの使用目的</label>
                                    <input type="text"
                                        // required 
                                        name="websitePurpose"
                                        value={websitePurpose}
                                        placeholder='例：広告、求人'
                                        onChange={handleInputChange} />
                                </li>
                                <li className="item">
                                    <label>参考サイトURL <span className="smal">※複数可</span></label>
                                    <textarea type="text"
                                        className="referenceSiteUrl"
                                        // required 
                                        name="referenceSiteUrl"
                                        value={referenceSiteUrl}
                                        placeholder='https://www.google.com'
                                        onChange={handleInputChange} />
                                </li>
                                <li className="item">
                                    <label>ターゲット</label>
                                    <input type="text"
                                        // required 
                                        name="target"
                                        value={target}
                                        onChange={handleInputChange} />
                                </li>
                                <li className="item">
                                    <label>ドメインの有無</label>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="radio-domain-data"
                                                value="有"
                                                onChange={handleDomainDataChange}
                                                checked={domainData === '有'}
                                            />有
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="radio-domain-data"
                                                value="無"
                                                onChange={handleDomainDataChange}
                                                checked={domainData === '無'}
                                            />無
                                        </label>
                                    </div>
                                </li>
                                <li className="item">
                                    <label>サーバーの有無</label>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="radio-server-data"
                                                value="有"
                                                onChange={handleServerDataChange}
                                                checked={serverData === '有'}
                                            />有
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="radio-server-data"
                                                value="無"
                                                onChange={handleServerDataChange}
                                                checked={serverData === '無'}
                                            />無
                                        </label>
                                    </div>
                                </li>
                                <li className="item">
                                    <label>CMS</label>
                                    <input type="text"
                                        name="useCms"
                                        value={useCms}
                                        onChange={handleInputChange} />
                                </li>
                                <li className="item">
                                    <div>対応するデバイス ※iPhon,iPad 以外</div>
                                    <input type="text"
                                        // required 
                                        name="device"
                                        value={device}
                                        onChange={handleInputChange} />
                                </li>
                                <li className="item">
                                    <label>SNS連携</label>
                                    <div>
                                        <label>
                                            <input type="checkbox" name="" value="X（旧:Twitter）"
                                                onChange={handleSnsCheckBoxChange} />X（旧:Twitter）
                                        </label>
                                        <label>
                                            <input type="checkbox" name="" value="Instagram"
                                                onChange={handleSnsCheckBoxChange} />Instagram
                                        </label>
                                        <label>
                                            <input type="checkbox" name="" value="Facebook"
                                                onChange={handleSnsCheckBoxChange} />Facebook
                                        </label>
                                        <label>
                                            <input type="checkbox" name="" value="その他"
                                                onChange={handleSnsCheckBoxChange} />その他
                                        </label>
                                    </div>
                                </li>
                                <li className="item">
                                    <label>納期</label>
                                    <input type="date" name="deadline"
                                        value={deadline}
                                        // required
                                        onChange={handleInputChange} />
                                </li>
                                <li className="item">
                                    <label>予算</label>
                                    <input type="number" name="budget"
                                        value={budget}
                                        // required
                                        onChange={handleInputChange} />
                                </li>
                            </ul>
                            <div>
                                <label>その他ご要望</label>
                                <textarea className="more-request"
                                    name="otherRequests"
                                    value={otherRequests}
                                    placeholder="例：ヘッダーは固定して常に上部に表示してください。"

                                    onChange={(e) => {
                                        // 文字数制限を2000文字に制限
                                        if (e.target.value.length <= 1500) {
                                            handleInputChange(e);
                                        } else {
                                            alert("orver");
                                        }
                                    }}></textarea>
                            </div>
                            <div className="btns">
                                <button type="button" className="clear-btn" onClick={handleClear}>クリア</button>
                                <button onClick={handleConfirmHiaringSheet}>内容の確認</button>
                                <button>送信</button>

                            </div>
                        </>

                        : <>

                            <div className="confirm-list"
                                id="user-content-to-pdf">
                                <div className="confirm-item">
                                    <div className="confirm-title">会社名： </div><div>{companyName}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">会社名（フリガナ：</div> <div>{companyNameKana}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">デザインの有無：</div> <div>{designData}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">メールアドレス：</div> <div>{currentUser.email}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">業種： </div><div>{industry}</div>
                                </div>
                                {selectedValues && (
                                    <>
                                        <div className="confirm-item">
                                            <div className="confirm-title">メニュー：</div> <div>{selectedValues}</div>
                                        </div>
                                        <div>
                                            {moreMenu.map((item, index) => (
                                                <div className="confirm-item" key={index}>
                                                    <div className="confirm-title">その他メニュー{index + 1}：</div> <div>{item}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="confirm-item">
                                    <div className="confirm-title">デザインの有無：</div> <div className="confirm-item-text">{designData}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">素材画像の有無：</div> <div className="confirm-item-text">{photoData}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">役職：</div> <div className="confirm-item-text">{position}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">指定のチャットツール：</div> <div className="confirm-item-text">{chatTool}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">SP対応の有無：</div> <div className="confirm-item-text">{spData}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">電話番号：</div> <div className="confirm-item-text">{tel}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">HPの使用目的：</div> <div className="confirm-item-text">{websitePurpose}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">参考サイトURL</div> <div className="confirm-item-text">{referenceSiteUrl}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">ターゲット：</div><div className="confirm-item-text">{target}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">企業の強み：</div> <div className="confirm-item-text">{strongPoint}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">ドメインの有無：</div> <div className="confirm-item-text">{domainData}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">サーバーの有無：</div> <div className="confirm-item-text">{serverData}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">CMS：</div> <div className="confirm-item-text">{useCms}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">対応デバイス：</div> <div className="confirm-item-text">{device}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">納期：</div> <div className="confirm-item-text">{deadline}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">予算：</div> <div className="confirm-item-text">{budget}</div>
                                </div>
                                <div className="confirm-item">
                                    <div className="confirm-title">その他ご要望：</div> <div className="confirm-item-text">{otherRequests}</div>
                                </div>
                            </div>
                            <div className="btns">
                                <button onClick={handleConfirmHiaringSheet}>編集画面へ</button>
                                <div className="pdfbtn" onClick={generatePDF}>PDFをダウンロード</div>
                            </div>
                        </>
                    }
                </form>

            </div>
            <div className="logout-btn">
                <button onClick={() => auth.signOut()}>ログアウト</button>
            </div>


        </div>
    );
};

export default Home;
