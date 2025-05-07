// src/pages/YoneticiBasvuruDetay.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './YoneticiBasvuruDetay.css';

export default function YoneticiBasvuruDetay() {
    const { ilanId } = useParams();
    const navigate = useNavigate();
    const [adaylar, setAdaylar] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/yonetici/ilan-detay-tum/${ilanId}`)
            .then(r => r.json())
            .then(setAdaylar)
            .catch(() => alert('Aday verileri çekilemedi'))
            .finally(() => setLoading(false));
    }, [ilanId]);

    if (loading) return <p>Yükleniyor…</p>;
    if (adaylar.length === 0) return <p>Bu ilana henüz başvuru yapılmamış.</p>;

    return (
        <div className="detay-container">
            <h2>📄 İlan Detayları (ID: {ilanId})</h2>

            {adaylar.map((a, i) => (
                <div key={i} className="aday-karti">
                    <h3>👤 {a.ad} {a.soyad} - {a.tc}</h3>

                    <Kategori title="Makale Başvuruları" items={a.makaleler} />
                    <Kategori title="Kitaplar" items={a.kitaplar} />
                    <Kategori title="Projeler" items={a.projeler} />
                    <Kategori title="Patentler" items={a.patentler} />
                    <Kategori title="Ödüller" items={a.oduller} />
                    <Kategori title="Editörlük/Hakemlik" items={a.editorlukler} />
                    <Kategori title="Sanatsal Faaliyetler" items={a.sanatsal} />
                    <Kategori title="İdari Görevler" items={a.gorevler} />
                    <Kategori title="Tez Yönetimi" items={a.tezler} />
                </div>
            ))}

            <button className="back-button" onClick={() => navigate(-1)}> ← Geri Dön </button>
        </div>
    );
}

function Kategori({ title, items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="kategori">
            <h4>{title} ({items.length})</h4>
            <ul>
                {items.map((item, i) => (
                    <li key={i} className="kategori-item">
                        {Object.entries(item).map(([k, v]) => (
                            k !== "_id" && k !== "__v" && k !== "userId" && k !== "ilanId" && (
                                <div key={k}>
                                    <strong>{k}:</strong> {typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v)}
                                </div>
                            )
                        ))}

                        {item.uploadedFiles && item.uploadedFiles.length > 0 && (
                            <ul className="file-list">
                                {item.uploadedFiles.map((f, j) => (
                                    <li key={j}>
                                        📂 <a href={`http://localhost:5000/${f.path}`} target="_blank" rel="noopener noreferrer">
                                            {f.originalName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
}
