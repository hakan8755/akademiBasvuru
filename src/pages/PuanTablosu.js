import React, { useEffect, useState } from 'react';
import './puantablosu.css'; // Eğer özel stil dosyan varsa

function PuanTablosuModern() {
  const [puanlar, setPuanlar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPuanlar = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/puantablosu');
        const data = await response.json();
        if (response.ok) {
          setPuanlar(data);
        } else {
          console.error('Hata:', data.message);
        }
      } catch (err) {
        console.error('Veri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPuanlar();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (!puanlar) return <p>Puan tablosu bulunamadı.</p>;

  const p = puanlar.puanlar || {};
  const t = p.articleApplication || {};
  const projeler = p.proje || {};

  const rows = [
    ['Bölüm A - A.1-A.4', t.toplamPuan1_4 || 0],
    ['Bölüm A - A.1-A.5', t.toplamPuan1_5 || 0],
    ['Bölüm A - A.1-A.6', t.toplamPuan1_6 || 0],
    ['Bölüm A - A.1-A.8', t.toplamPuan1_8 || 0],
    ['Bölüm A Toplam Puan', t.toplamPuan || 0],
    ['Bölüm B Toplam Puan', p.bilimselToplanti || 0],
    ['Bölüm C Toplam Puan', p.kitap || 0],
    ['Bölüm D Toplam Puan', p.atif || 0],
    ['Bölüm E Toplam Puan', p.dersVerme || 0],
    ['Bölüm F - F.1-F.2', p.tezYonetimi || 0],
    ['Bölüm F Toplam Puan', p.tezYonetimi || 0],
    ['Bölüm G Toplam Puan', p.patent || 0],
    ['Bölüm H - H.1-H.17', projeler.toplam1_17 || 0],
    ['Bölüm H - H.1-H.22', projeler.toplam1_22 || 0],
    ['Bölüm H Toplam Puan', projeler.genelToplam || 0],
    ['Bölüm I Toplam Puan', p.editorluk || 0],
    ['Bölüm J Toplam Puan', p.odul || 0],
    ['Bölüm K Toplam Puan', p.gorev || 0],
    ['Bölüm L Toplam Puan', p.sanat || 0],
    ['TOPLAM PUAN', puanlar.genelToplam || 0]
  ];

  return (
    <div className="puan-tablosu-modern" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Adayın Asgari / Toplam Puan Tablosu</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid #ccc', textAlign: 'left', padding: '8px' }}>Bölüm</th>
            <th style={{ borderBottom: '2px solid #ccc', textAlign: 'right', padding: '8px' }}>Puan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value], idx) => (
            <tr key={idx}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{label}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PuanTablosuModern;
