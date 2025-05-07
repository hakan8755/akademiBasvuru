import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './YoneticiPdfIndir.css'; // Eğer CSS dosyası yoksa oluştur

export default function YoneticiPdfIndir() {
    const [ilanlar, setIlanlar] = useState([]);
    const [secilenIlan, setSecilenIlan] = useState('');
    const [basvurular, setBasvurular] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔄 İlanları çek
    useEffect(() => {
        fetch('http://localhost:5000/api/ilanlar')
            .then(res => res.json())
            .then(setIlanlar)
            .catch(() => alert("İlanlar alınamadı."));
    }, []);

    // 🔄 İlan değişince başvuruları getir
    useEffect(() => {
        if (!secilenIlan) return;

        setLoading(true);
        fetch(`http://localhost:5000/api/yonetici/ilan-detay/${secilenIlan}`)
            .then(res => res.json())
            .then(setBasvurular)
            .catch(() => alert("Başvurular alınamadı."))
            .finally(() => setLoading(false));
    }, [secilenIlan]);

    // 📄 PDF indir
    const handlePdfExport = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(`İlan Başvuru Raporu (ID: ${secilenIlan})`, 14, 20);
        let y = 30;

        basvurular.forEach((a, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}) ${a.ad} ${a.soyad} - TC: ${a.tc}`, 14, y);
            y += 8;

            const addKategori = (title, items, formatFn) => {
                if (!items || items.length === 0) return;
                doc.setFontSize(11);
                doc.text(title + ":", 16, y);
                y += 6;
                items.forEach((item) => {
                    const line = formatFn(item);
                    doc.text("- " + line, 20, y);
                    y += 6;

                    // Yüklenen dosyalar varsa ekle
                    if (item.uploadedFiles && item.uploadedFiles.length > 0) {
                        item.uploadedFiles.forEach(file => {
                            doc.setFontSize(10);
                            doc.text(`📎 ${file.originalName}`, 24, y);
                            y += 5;
                        });
                    }
                });
                y += 4;
            };

            addKategori("Makaleler", a.makaleler, m => `${m.baslik} (${m.yil}) - ${m.toplamPuan} puan`);
            addKategori("Kitaplar", a.kitaplar, k => `${k.kitapAdi} (${k.yili}) - ${k.puan} puan`);
            addKategori("Projeler", a.projeler, p => `${p.projeAdi} (${p.yili}) - ${p.puan} puan`);
            addKategori("Patentler", a.patentler, p => `${p.patentAdi} (${p.yili}) - ${p.toplamPuan} puan`);
            addKategori("Ödüller", a.oduller, o => `${o.odulTuru} (${o.yili}) - ${o.puan} puan`);
            addKategori("Editörlük", a.editorlukler, e => `${e.gorevTuru} (${e.yili}) - ${e.puan} puan`);
            addKategori("Sanatsal", a.sanatsal, s => `${s.faaliyet} (${s.yili}) - ${s.puan} puan`);
            addKategori("İdari Görevler", a.gorevler, g => `${g.gorevTuru} - ${g.birim} (${g.yili})`);
            addKategori("Tezler", a.tezler, t => `${t.tezTuru} - ${t.ogrenciAdi} (${t.yili})`);

            y += 8;
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });

        doc.save(`ilan-${secilenIlan}-detay-raporu.pdf`);
    };


    return (
        <div className="pdf-export-page">
            <h2>📄 İlan Başvuru Raporu</h2>

            <div className="form-group">
                <label htmlFor="ilan-select">İlan Seçin:</label>
                <select
                    id="ilan-select"
                    value={secilenIlan}
                    onChange={(e) => setSecilenIlan(e.target.value)}
                >
                    <option value="">-- İlan Seçin --</option>
                    {ilanlar.map(i => (
                        <option key={i._id} value={i._id}>
                            {i.seviye} - {i.birim} ({new Date(i.baslangicTarihi).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p>Veriler getiriliyor...</p>}

            {basvurular.length > 0 && (
                <div className="pdf-export-actions">
                    <button onClick={handlePdfExport}>📥 PDF İndir</button>
                </div>
            )}
        </div>
    );
}
