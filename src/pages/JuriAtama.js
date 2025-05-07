// src/pages/YoneticiJuriAtama.jsx
import React, { useEffect, useState } from 'react';
import './YoneticiJuriAtama.css';

export default function YoneticiJuriAtama() {
    const [ilanlar, setIlanlar] = useState([]);
    const [seciliIlanId, setSeciliIlanId] = useState('');
    const [juriListesi, setJuriListesi] = useState([]);
    const [yeniJuri, setYeniJuri] = useState({ ad: '', soyad: '', unvan: '', kurum: '' });

    useEffect(() => {
        fetch('http://localhost:5000/api/ilanlar')
            .then(r => r.json())
            .then(setIlanlar)
            .catch(console.error);
    }, []);

    const handleAddJuri = () => {
        if (!seciliIlanId || !yeniJuri.ad || !yeniJuri.soyad) return alert('Tüm alanları doldurun');

        fetch(`http://localhost:5000/api/juriler/${seciliIlanId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(yeniJuri),
        })
            .then(r => r.json())
            .then(data => {
                alert('Jüri eklendi');
                setJuriListesi([...juriListesi, yeniJuri]);
                setYeniJuri({ ad: '', soyad: '', unvan: '', kurum: '' });
            })
            .catch(() => alert('Ekleme başarısız'));
    };

    return (
        <div className="juri-atama">
            <h2>👨‍⚖️ Jüri Atama</h2>

            <label>İlan Seçin:
                <select value={seciliIlanId} onChange={e => setSeciliIlanId(e.target.value)}>
                    <option value="">-- Seçin --</option>
                    {ilanlar.map(i => (
                        <option key={i._id} value={i._id}>{i.birim} - {i.seviye}</option>
                    ))}
                </select>
            </label>

            <div className="juri-form">
                <input placeholder="Ad" value={yeniJuri.ad} onChange={e => setYeniJuri({ ...yeniJuri, ad: e.target.value })} />
                <input placeholder="Soyad" value={yeniJuri.soyad} onChange={e => setYeniJuri({ ...yeniJuri, soyad: e.target.value })} />
                <input placeholder="Unvan" value={yeniJuri.unvan} onChange={e => setYeniJuri({ ...yeniJuri, unvan: e.target.value })} />
                <input placeholder="Kurum" value={yeniJuri.kurum} onChange={e => setYeniJuri({ ...yeniJuri, kurum: e.target.value })} />
                <button onClick={handleAddJuri}>➕ Ekle</button>
            </div>

            <div className="juri-listesi">
                <h3>Atanmış Jüriler</h3>
                <ul>
                    {juriListesi.map((j, i) => (
                        <li key={i}>{j.ad} {j.soyad} - {j.unvan} ({j.kurum})</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
