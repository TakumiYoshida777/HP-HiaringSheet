import React, { useState } from 'react';
import './CorporateList.scss';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CorporateList = ({ hiaringData }) => {
    const [selectedCompany, setSelectedCompany] = useState("");

    if (!hiaringData || !hiaringData.length) {
        return null;
    }

    const data = hiaringData;
    const detailData = data.filter(item => item.companyName === selectedCompany);

    // 企業名のリストを作成
    const companies = data.map(company => company.companyName).sort();

    const selectCompany = (company) => {
        setSelectedCompany(company);
    };

    //PDFダウンロード機能
    const generatePDF = async () => {
        const pdf = new jsPDF('p', 'pt', 'letter'); // ページサイズを指定
        const contentToPdf = document.getElementById('content-to-pdf');
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
        <div className="corporate-list">
            <div className="company-list">
                {companies.map((company, index) => (
                    <ul key={company}>
                        <li
                            className="company-item"
                            onClick={() => selectCompany(company)}
                        >
                            {index + 1}: {company}
                        </li>
                    </ul>
                ))}
            </div>
            <hr />
            <div className="company-details container">
                {detailData.map((item, index) => (

                    <>
                        <div key={index} className="company-detail"
                            id="content-to-pdf">
                            <div className="detail-item">
                                <div>UID:</div>
                                <div>{item.uid}</div>
                            </div>
                            <div className="detail-item">
                                <div>会社名:</div>
                                <div>{item.companyName}</div>
                            </div>
                            <div className="detail-item">
                                <div>会社名（フリガナ）:</div>
                                <div>{item.companyNameKana}</div>
                            </div>
                            <div className="detail-item">
                                <div>日時:</div>
                                <div>{item.dateTime}</div>
                            </div>
                            <div className="detail-item">
                                <div>デザインの有無:</div>
                                <div>{item.designData}</div>
                            </div>
                            <div className="detail-item">
                                <div>メールアドレス:</div>
                                <div>{item.email}</div>
                            </div>
                            <div className="detail-item">
                                <div>業種:</div>
                                <div>{item.industry}</div>
                            </div>
                            <div className="detail-item">
                                <div>メニュー:</div>
                                <div>{item.menu}</div>
                            </div>
                            <div className="detail-item">
                                <div>その他メニュー:</div>
                                <div>{item.otherMenu}</div>
                            </div>
                            <div className="detail-item">
                                <div>素材画像の有無:</div>
                                <div>{item.photoData}</div>
                            </div>
                            <div className="detail-item">
                                <div>役職:</div>
                                <div>{item.position}</div>
                            </div>
                            <div className="detail-item">
                                <div>指定のチャットツール:</div>
                                <div>{item.chatTool}</div>
                            </div>
                            <div className="detail-item">
                                <div>SP対応の有無:</div>
                                <div>{item.sp}</div>
                            </div>
                            <div className="detail-item">
                                <div>電話番号:</div>
                                <div>{item.tel}</div>
                            </div>
                            <div className="detail-item">
                                <div>HPの使用目的:</div>
                                <div>{item.websitePurpose}</div>
                            </div>
                            <div className="detail-item">
                                <div>ターゲット:</div>
                                <div>{item.target}</div>
                            </div>
                            <div className="detail-item">
                                <div>ドメインの有無:</div>
                                <div>{item.domainData}</div>
                            </div>
                            <div className="detail-item">
                                <div>サーバーの有無:</div>
                                <div>{item.serverData}</div>
                            </div>
                            <div className="detail-item">
                                <div>CMS:</div>
                                <div>{item.useCms}</div>
                            </div>
                            <div className="detail-item">
                                <div>対応デバイス:</div>
                                <div>{item.device}</div>
                            </div>
                            <div className="detail-item">
                                <div>納期:</div>
                                <div>{item.deadline}</div>
                            </div>
                            <div className="detail-item">
                                <div>予算:</div>
                                <div>{item.budget}</div>
                            </div>
                            <div className="detail-item">
                                <div>その他ご要望:</div>
                                <div>{item.otherRequests}</div>
                            </div>
                        </div>
                        <button onClick={generatePDF}>PDFをダウンロード</button>
                    </>
                ))}


            </div>
        </div>
    );
};

export default CorporateList;
