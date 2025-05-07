// src/pages/YoneticiBasvurular.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YoneticiBasvurular.css';

export default function YoneticiBasvurular() {
    const nav = useNavigate();
    const [ilanOzet, setIlanOzet] = useState([]);
    const [loading, setLoading] = useState(true);

    /* PDF’lerdeki faaliyet alanlarını kolon listesi olarak tanımla */
    const categories = [
        { key: 'makale', label: 'Makale' },
        { key: 'kitap', label: 'Kitap' },
        { key: 'proje', label: 'Proje' },
        { key: 'patent', label: 'Patent' },
        { key: 'editor', label: 'Editör/Hakem' },
        { key: 'odul', label: 'Ödül' },
        { key: 'gorev', label: 'İd. Görev' },
        { key: 'sanat', label: 'Sanat' },
    ];

    /* ---------------- veriyi çek ---------------- */
    useEffect(() => {
        fetch('http://localhost:5000/api/yonetici/ilan-ozet')
            .then(r => r.json())
            .then(setIlanOzet)
            .catch(() => alert('Özet çekilemedi'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="loading">Yükleniyor…</p>;

    return (
        <div className="yonetici-ozet">
            <h2>📑 İlan Başvuru Özetleri</h2>

            {ilanOzet.length === 0 && <p>Henüz başvuru yok.</p>}

            {ilanOzet.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>İlan ID</th>
                            {/* Her kategori için iki kolon: Aday Sayısı ve Puan */}
                            {categories.map(c => (
                                <React.Fragment key={c.key}>
                                    <th>{c.label} Aday</th>
                                    <th>{c.label} Puan</th>
                                </React.Fragment>
                            ))}
                            <th><b>Toplam Puan</b></th>
                            <th>Detay</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ilanOzet.map(row => {
                            /* Toplam puanı kategorilerden topla */
                            const toplam = categories.reduce((sum, c) => {
                                const value = row[`${c.key}Puan`] || 0;
                                return sum + value;
                            }, 0);

                            return (
                                <tr key={row.ilanId}>
                                    <td>{row.ilanId}</td>

                                    {categories.map(c => (
                                        <React.Fragment key={c.key}>
                                            <td>{row[`${c.key}Count`] || 0}</td>
                                            <td>{row[`${c.key}Puan`] || 0}</td>
                                        </React.Fragment>
                                    ))}

                                    <td><b>{toplam}</b></td>

                                    <td>
                                        <button onClick={() => nav(`/yonetici/basvurular/${row.ilanId}`)}>
                                            İncele
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
