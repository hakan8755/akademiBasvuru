import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/araştırmaprojeleri.css';

const gorevTurleri = [
  { ad: "Dekan/Enstitü/Yüksekokul/MYO/Merkez Müdürü", puan: 15 },
  { ad: "Enstitü Müdür Yrd. / Dekan Yrd. / Yüksekokul Müdür Yrd. / MYO Müdür Yrd. / Merkez Müdürü Yrd./Bölüm Başkanı", puan: 12 },
  { ad: "Bölüm Başkan Yrd. / Anabilim Dalı Başkanı", puan: 10 },
  { ad: "Rektörlükçe görevlendirilen Koordinatörlük", puan: 8 },
  { ad: "Rektörlükçe görevlendirilen Koordinatör Yardımcıları", puan: 7 },
  { ad: "Rektörlükçe görevlendirilen üniversite düzeyinde Komisyon/Kurul üyelikleri", puan: 6 },
  { ad: "Dekanlık/Y.O. Müdürlüğü/MYO Müdürlüğü /Konservatuvar Müdürlüğü tarafından görevlendirilen Komisyon/Kurul üyelikleri", puan: 5 },
  { ad: "Bölüm Başkanlıkları tarafından görevlendirilen Komisyon/Kurul üyelikleri", puan: 4 },
  { ad: "Rektörlük/Dekanlık/Y.O. Müdürlüğü/MYO Müdürlüğü /Konservatuvar Müdürlüğü/ Bölüm Başkanlığı görevlendirmeleriyle kurum içi ve dışı eğitim, işbirliği vb konularda katkı sağlamak", puan: 3 },
  { ad: "Uluslararası nitelikteki bilimsel ve mesleki kurum/kuruluşların yönetimlerinde, kurullarında, komisyon veya komitelerinde görev almak", puan: 5 },
  { ad: "Ulusal nitelikteki bilimsel ve mesleki kurum/kuruluşların yönetimlerinde, kurullarında, komisyon veya komitelerinde görev almak", puan: 4 },
  { ad: "Yerel nitelikteki bilimsel ve mesleki kurum/kuruluşların yönetimlerinde, kurullarında, komisyon veya komitelerinde görev almak", puan: 3 }
];

function Gorevler() {
  const navigate = useNavigate();
  const [gorevlerData, setGorevlerData] = useState(
    gorevTurleri.map((tur, index) => ({
      id: index + 1,
      gorevTuru: tur.ad,
      puan: tur.puan,
      birim: '',
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
    const yapilanGorevler = gorevlerData.filter(g => g.aktif);

    const toplamPuan = yapilanGorevler.reduce((acc, g) => acc + g.puan, 0);

    try {
      const response = await fetch('http://localhost:5000/api/gorevler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gorevler: yapilanGorevler, toplamPuan, userId, ilanId })

      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok) {
          console.log('Başarıyla kaydedildi:', data);
          navigate('/Sanat');
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
      <h1>İdari Görevler</h1>
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
                Bu görevi üstlendim
              </label>
            </div>

            {g.aktif && (
              <div className="proje-detaylar">
                <label>Görev Yapılan Birim:
                  <input
                    type="text"
                    name="birim"
                    value={g.birim}
                    onChange={(e) => handleChange(g.id, e)}
                    required
                  />
                </label>

                <label>Görev Yılı:
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
        <button type="submit">Sanat Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default Gorevler;
