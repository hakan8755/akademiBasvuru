import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/araştırmaprojeleri.css';

const gorevTurleri = [
  { ad: "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamındaki dergilerde baş editörlük görevinde bulunmak", puan: 100 },
  { ad: "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamındaki dergilerde alan/yardımcı/ortak/asistan editörlük görevinde bulunmak", puan: 70 },
  { ad: "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamındaki dergilerde misafir/davetli editörlük görevinde bulunmak", puan: 50 },
  { ad: "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamındaki dergilerde yayın kurulu üyeliği", puan: 40 },
  { ad: "SCI-E, SSCI, AHCI, E-SCI kapsamı dışındaki uluslararası indekslerde baş editörlük görevinde bulunmak", puan: 40 },
  { ad: "SCI-E, SSCI, AHCI, E-SCI kapsamı dışındaki uluslararası indekslerde alan/yardımcı/ortak/asistan editörlük görevinde bulunmak", puan: 30 },
  { ad: "SCI-E, SSCI, AHCI, E-SCI kapsamı dışındaki uluslararası indekslerde misafir/davetli editörlük görevinde bulunmak", puan: 20 },
  { ad: "SCI-E, SSCI, AHCI, E-SCI kapsamı dışındaki uluslararası indekslerde yayın kurulu üyeliği", puan: 10 },
  { ad: "ULAKBİM tarafından taranan dergilerde baş editörlük görevi", puan: 15 },
  { ad: "ULAKBİM tarafından taranan dergilerde yayın kurulu üyeliği veya editörlük görevi", puan: 5 },
  { ad: "SCI-E, SSCI veya AHCI kapsamındaki dergilerde tamamlanmış hakemlik faaliyeti", puan: 3 },
  { ad: "Uluslararası diğer indekslerde tamamlanmış hakemlik faaliyeti", puan: 2 },
  { ad: "ULAKBİM kapsamındaki dergilerde tamamlanmış hakemlik faaliyeti", puan: 1 }
];

function DergiEditorluk() {
  const navigate = useNavigate();
  const [gorevlerData, setGorevlerData] = useState(
    gorevTurleri.map((tur, index) => ({
      id: index + 1,
      gorevTuru: tur.ad,
      puan: tur.puan,
      dergiAdi: '',
      sayisi: '',
      yili: '',
      aktif: false
    }))
  );

  const handleChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    setGorevlerData(prev =>
      prev.map(g =>
        g.id === id
          ? { ...g, [name]: type === 'checkbox' ? checked : value }
          : g
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const ilanId = localStorage.getItem('ilanId');

    if (!userId || !ilanId) {
      alert('Giriş yapmanız veya ilan seçmeniz gerekiyor.');
      return;
    }

    try {
      const yapilanGorevler = gorevlerData.filter(g => g.aktif);

      const toplamPuan = yapilanGorevler.reduce((acc, g) => {
        return acc + (g.puan * Number(g.sayisi || 1));
      }, 0);

      const response = await fetch('http://localhost:5000/api/editorlukler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          editorlukler: yapilanGorevler,
          toplamPuan,
          userId,
          ilanId
        })

      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok) {
          console.log('Başarıyla kaydedildi:', data);
          navigate('/basarılar');
        } else {
          console.error('Hata oluştu:', data);
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
      <h1>Dergi Editörlük ve Hakemlik Faaliyetleri</h1>
      <form onSubmit={handleSubmit}>
        {gorevlerData.map(g => (
          <div key={g.id} className="faaliyet-box">
            <div className="proje-header">
              <h3>{g.id}) {g.gorevTuru} <span>({g.puan} Puan)</span></h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="aktif"
                  checked={g.aktif}
                  onChange={(e) => handleChange(g.id, e)}
                />
                Bu görevde bulundum
              </label>
            </div>

            {g.aktif && (
              <div className="proje-detaylar">
                <label>Derginin Adı:
                  <input
                    type="text"
                    name="dergiAdi"
                    value={g.dergiAdi}
                    onChange={(e) => handleChange(g.id, e)}
                    required
                  />
                </label>

                <label>Görev Sayısı:
                  <input
                    type="number"
                    name="sayisi"
                    value={g.sayisi}
                    onChange={(e) => handleChange(g.id, e)}
                    min="1"
                    required
                  />
                </label>

                <label>Yılı:
                  <input
                    type="text"
                    name="yili"
                    value={g.yili}
                    onChange={(e) => handleChange(g.id, e)}
                    required
                    placeholder="YYYY"
                  />
                </label>
              </div>
            )}
          </div>
        ))}
        <button type="submit">Başarılar Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default DergiEditorluk;
