import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/araştırmaprojeleri.css';

const odulTurleri = [
  { ad: "Sürekli ve Periyodik olarak Jürili uluslararası bilim ve sanat ödülleri", puan: 150 },
  { ad: "TÜBİTAK tarafından verilen Bilim, Özel ve Hizmet Ödülleri", puan: 100 },
  { ad: "TÜBA tarafından verilen Akademi Ödülleri", puan: 100 },
  { ad: "TÜBİTAK tarafından verilen Teşvik Ödülü", puan: 80 },
  { ad: "TÜBA tarafından verilen GEBİP ve TESEP ödülleri", puan: 80 },
  { ad: "Sürekli ve Periyodik olarak Jürili ulusal bilim ve sanat ödülleri", puan: 50 },
  { ad: "Jürisiz uluslararası/ulusal sürekli ödüller", puan: 20 },
  { ad: "Uluslararası yarışmalarda birincilik", puan: 20 },
  { ad: "Uluslararası yarışmalarda ikincilik", puan: 10 },
  { ad: "Uluslararası yarışmalarda üçüncülük", puan: 5 },
  { ad: "Ulusal yarışmalarda birincilik", puan: 10 },
  { ad: "Ulusal yarışmalarda ikincilik", puan: 5 },
  { ad: "Ulusal yarışmalarda üçüncülük", puan: 3 },
  { ad: "Uluslararası bilimsel toplantı ödülleri", puan: 5 },
  { ad: "Ulusal bilimsel toplantı ödülleri", puan: 3 },
  { ad: "Sanat, tasarım ve mimarlık alanlarında uluslararası ödüller", puan: 20 },
  { ad: "Sanat, tasarım ve mimarlık alanlarında ulusal ödüller", puan: 10 },
  { ad: "KOU Kurumsal ödülleri", puan: 10 },
  { ad: "Kitap veya makaleye atfedilen ödüller", puan: 5 }
];

function Basarilar() {
  const navigate = useNavigate();
  const [odullerData, setOdullerData] = useState(
    odulTurleri.map((tur, index) => ({
      id: index + 1,
      odulTuru: tur.ad,
      puan: tur.puan,
      verenKurum: '',
      yili: '',
      alindi: false
    }))
  );

  const handleChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    setOdullerData(prev =>
      prev.map(o =>
        o.id === id
          ? { ...o, [name]: type === 'checkbox' ? checked : value }
          : o
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

    const yapilanOduller = odullerData.filter(o => o.alindi);

    const toplamPuan = yapilanOduller.reduce((acc, o) => acc + (o.puan || 0), 0);

    try {
      const response = await fetch('http://localhost:5000/api/oduller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oduller: yapilanOduller,
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
          navigate('/Gorevler');
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
      <h1>Ödüller ve Başarılar</h1>
      <form onSubmit={handleSubmit}>
        {odullerData.map(o => (
          <div key={o.id} className="faaliyet-box">
            <div className="proje-header">
              <h3>{o.id}) {o.odulTuru} <span>({o.puan} Puan)</span></h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="alindi"
                  checked={o.alindi}
                  onChange={(e) => handleChange(o.id, e)}
                />
                Bu ödülü aldım
              </label>
            </div>

            {o.alindi && (
              <div className="proje-detaylar">
                <label>Ödülün Veren Kurumu:
                  <input
                    type="text"
                    name="verenKurum"
                    value={o.verenKurum}
                    onChange={(e) => handleChange(o.id, e)}
                    required
                  />
                </label>

                <label>Yılı:
                  <input
                    type="text"
                    name="yili"
                    value={o.yili}
                    onChange={(e) => handleChange(o.id, e)}
                    required
                    placeholder="YYYY"
                  />
                </label>
              </div>
            )}
          </div>
        ))}
        <button type="submit">Görevler Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default Basarilar;
