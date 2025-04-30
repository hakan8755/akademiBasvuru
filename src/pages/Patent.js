// Patent.jsx - kişi sayısına göre puan çarpanlı
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/toplanti.css';

const patentTurleri = [
  "Lisanslanan Uluslararası Patent",
  "Tescillenmiş Uluslararası Patent",
  "Uluslararası Patent Başvurusu",
  "Lisanslanan Ulusal Patent",
  "Tescillenmiş Ulusal Patent",
  "Ulusal Patent Başvurusu",
  "Lisanslanan Faydalı Model, Endüstriyel Tasarım, Marka",
  "Faydalı Model ve Endüstriyel Tasarım"
];

const puanlar = {
  1: 120,
  2: 100,
  3: 50,
  4: 80,
  5: 60,
  6: 30,
  7: 20,
  8: 15
};

function Patent() {
  const navigate = useNavigate();
  const [patentlerData, setPatentlerData] = useState(
    patentTurleri.map((tur, index) => ({
      id: index + 1,
      patentTuru: tur,
      skipped: false,
      patentAdi: '',
      yili: '',
      authorCount: 1
    }))
  );

  const toggleSkip = (id) => {
    setPatentlerData(prev =>
      prev.map(p => p.id === id ? { ...p, skipped: !p.skipped } : p)
    );
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setPatentlerData(prev =>
      prev.map(p => p.id === id ? {
        ...p,
        [name]: name === 'authorCount' ? parseInt(value) || 1 : value
      } : p)
    );
  };

  const calculateK = (n) => {
    if (n === 1) return 1;
    if (n === 2) return 0.8;
    if (n === 3) return 0.6;
    if (n === 4) return 0.5;
    if (n >= 5 && n <= 9) return 1 / n;
    return 1 / 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const yapilanPatentler = patentlerData.filter(p => !p.skipped);

    let toplamPuan = 0;
    yapilanPatentler.forEach(p => {
      const base = puanlar[p.id] || 0;
      const k = calculateK(p.authorCount || 1);
      toplamPuan += Math.round(base * k);
    });

    try {
      const response = await fetch('http://localhost:5000/api/patentler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patentler: yapilanPatentler, toplamPuan })
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok) {
          alert(`Patentler kaydedildi. Toplam Puan: ${toplamPuan}`);
          navigate('/AraştırmaProjeleri');
        } else {
          console.error('Hata:', data);
        }
      } else {
        const text = await response.text();
        console.error('Sunucudan beklenmeyen yanıt:', text);
      }
    } catch (err) {
      console.error('Gönderim hatası:', err);
    }
  };

  return (
    <div className="toplanti-form">
      <h1>Patent ve Faydalı Model Bilgileri</h1>
      <form onSubmit={handleSubmit}>
        {patentlerData.map(p => (
          <div key={p.id} className={`faaliyet-box ${p.skipped ? 'skipped' : ''}`}>
            <h3>{p.id}) {p.patentTuru}</h3>

            {!p.skipped && (
              <>
                <label>Patent Adı:
                  <input
                    type="text"
                    name="patentAdi"
                    value={p.patentAdi}
                    onChange={(e) => handleChange(p.id, e)}
                    required
                  />
                </label>

                <label>Yılı:
                  <input
                    type="text"
                    name="yili"
                    value={p.yili}
                    onChange={(e) => handleChange(p.id, e)}
                    required
                    placeholder="YYYY"
                  />
                </label>

                <label>Kişi Sayısı:
                  <input
                    type="number"
                    name="authorCount"
                    min="1"
                    value={p.authorCount}
                    onChange={(e) => handleChange(p.id, e)}
                    required
                  />
                </label>
              </>
            )}

            <div className="skip-section">
              <button type="button" onClick={() => toggleSkip(p.id)} className="skip-button">
                {p.skipped ? '✔️ Geri Al' : '❌ Vermedim'}
              </button>
            </div>
          </div>
        ))}
        <button type="submit">Araştırma Projeleri Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default Patent;