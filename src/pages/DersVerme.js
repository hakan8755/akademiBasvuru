import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/toplanti.css';

const dersTurleri = [
  "Önlisans/Lisans dersleri",
  "Önlisans/Lisans dersleri (Yabancı dilde)",
  "Lisansüstü dersleri",
  "Lisansüstü dersleri (Yabancı dilde)"
];

// 🔥 Ders türlerine göre puanlar
const dersPuanlari = {
  1: 2,
  2: 3,
  3: 3,
  4: 4
};

function DersVerme() {
  const navigate = useNavigate();

  const [derslerData, setDerslerData] = useState(
    dersTurleri.map((tur, index) => ({
      id: index + 1,
      dersTuru: tur,
      skipped: false,
      dersler: [
        { dersAdi: '', programAdi: '', donemi: '', yili: '' }
      ]
    }))
  );

  const toggleSkip = (id) => {
    setDerslerData(prev =>
      prev.map(d =>
        d.id === id ? { ...d, skipped: !d.skipped } : d
      )
    );
  };

  const handleChange = (id, index, e) => {
    const { name, value } = e.target;
    setDerslerData(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              dersler: d.dersler.map((ders, idx) =>
                idx === index ? { ...ders, [name]: value } : ders
              )
            }
          : d
      )
    );
  };

  const addDers = (id) => {
    setDerslerData(prev =>
      prev.map(d =>
        d.id === id && d.dersler.length < 2
          ? { ...d, dersler: [...d.dersler, { dersAdi: '', programAdi: '', donemi: '', yili: '' }] }
          : d
      )
    );
  };

  const removeDers = (id, index) => {
    setDerslerData(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, dersler: d.dersler.filter((_, idx) => idx !== index) }
          : d
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const yapilanDersler = derslerData.filter(d => !d.skipped);

    // 🔥 Dersler toplam puanını hesapla
    const toplamPuan = yapilanDersler.reduce((sum, ders) => {
      return sum + (dersPuanlari[ders.id] * ders.dersler.length);
    }, 0);

    console.log("Ders Verme Bölümü Toplam Puan:", toplamPuan);

    try {
      const response = await fetch('http://localhost:5000/api/dersverme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dersler: yapilanDersler, derslerToplamPuan: toplamPuan })
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok) {
          console.log('Başarıyla kaydedildi:', data);
          alert(`Başarıyla kaydedildi. Dersler toplam puanı: ${toplamPuan}`);
          navigate("/tezyonetimi"); // 🔄 Sonraki sayfa
        } else {
          console.error('Hata oluştu:', data);
          alert('Sunucu hatası oluştu.');
        }
      } else {
        const text = await response.text();
        console.error('Sunucudan beklenmeyen yanıt:', text);
      }
    } catch (err) {
      console.error('Gönderim hatası:', err);
      alert('Gönderim sırasında hata oluştu.');
    }
  };

  return (
    <div className="toplanti-form">
      <h1>Ders Verme Faaliyetleri</h1>
      <form onSubmit={handleSubmit}>
        {derslerData.map(d => (
          <div key={d.id} className={`faaliyet-box ${d.skipped ? 'skipped' : ''}`}>
            <h3>{d.id}) {d.dersTuru}</h3>

            {!d.skipped && (
              <>
                {d.dersler.map((ders, idx) => (
                  <div key={idx}>
                    <label>Dersin Adı:
                      <input
                        type="text"
                        name="dersAdi"
                        value={ders.dersAdi}
                        onChange={(e) => handleChange(d.id, idx, e)}
                        required
                      />
                    </label>

                    <label>Programın Adı:
                      <input
                        type="text"
                        name="programAdi"
                        value={ders.programAdi}
                        onChange={(e) => handleChange(d.id, idx, e)}
                        required
                      />
                    </label>

                    <label>Dönemi:
                      <input
                        type="text"
                        name="donemi"
                        value={ders.donemi}
                        onChange={(e) => handleChange(d.id, idx, e)}
                        required
                        placeholder="Örn: 2022-2023 Güz"
                      />
                    </label>

                    <label>Yılı:
                      <input
                        type="text"
                        name="yili"
                        value={ders.yili}
                        onChange={(e) => handleChange(d.id, idx, e)}
                        required
                        placeholder="YYYY"
                      />
                    </label>

                    {d.dersler.length > 1 && (
                      <button type="button" onClick={() => removeDers(d.id, idx)}>Dersi Sil</button>
                    )}
                  </div>
                ))}

                {d.dersler.length < 2 && (
                  <button type="button" onClick={() => addDers(d.id)}>+ Ders Ekle</button>
                )}
              </>
            )}

            <div className="skip-section">
              <button type="button" onClick={() => toggleSkip(d.id)} className="skip-button">
                {d.skipped ? '✔️ Geri Al' : '❌ Vermedim'}
              </button>
            </div>
          </div>
        ))}
        <button type="submit">Tez Yönetimi Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default DersVerme;
