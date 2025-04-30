import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/araştırmaprojeleri.css';

const projeTurleri = [
  "AB çerçeve programı/NSF/ERC bilimsel araştırma projesinde koordinatör/alt koordinatör olmak",
  "AB çerçeve programı/NSF/ERC bilimsel araştırma projesinde yürütücü olmak",
  "AB çerçeve programı/NSF/ERC bilimsel araştırma projesinde araştırmacı olmak",
  "AB Çerçeve Programı/NSF/ERC dışındaki uluslararası destekli projelerde koordinatör olmak",
  "AB Çerçeve Programı/NSF/ERC dışındaki uluslararası destekli projelerde yürütücü olmak",
  "AB Çerçeve Programı/NSF/ERC dışındaki uluslararası destekli projelerde araştırmacı olmak",
  "AB Çerçeve Programı/NSF/ERC dışındaki uluslararası destekli projelerde danışman olmak",
  "TÜBİTAK ARGE (ARDEB, TEYDEB) ve TÜSEB projelerinde yürütücü olmak",
  "Diğer TÜBİTAK projelerinde yürütücü olmak",
  "TÜBİTAK dışı kamu projelerinde yürütücü olmak",
  "Sanayi projelerinde yürütücü olmak",
  "Özel kuruluş projelerinde yürütücü olmak",
  "TÜBİTAK ARGE (ARDEB, TEYDEB) ve TÜSEB projelerinde araştırmacı olmak",
  "Diğer TÜBİTAK projelerinde araştırmacı olmak",
  "TÜBİTAK dışı kamu projelerinde araştırmacı olmak",
  "Sanayi projelerinde araştırmacı olmak",
  "Özel kuruluş projelerinde araştırmacı olmak",
  "TÜBİTAK ARGE (ARDEB, TEYDEB) ve TÜSEB projelerinde danışman olmak",
  "Diğer TÜBİTAK projelerinde danışman olmak",
  "TÜBİTAK dışı kamu projelerinde danışman olmak",
  "Sanayi projelerinde danışman olmak",
  "Özel kuruluş projelerinde danışman olmak",
  "Üniversite BAP projelerinde yürütücü olmak",
  "Üniversite BAP projelerinde araştırmacı olmak",
  "Üniversite BAP projelerinde danışman olmak",
  "4+ aylık yurtdışı araştırma çalışması",
  "4+ aylık yurtiçi araştırma çalışması",
  "TÜBİTAK 2209/2242 öğrenci projelerinde danışman olmak"
];

// Her proje için puanlar
const projePuanlari = {
  1: 250, 2: 150, 3: 100, 4: 150, 5: 120, 6: 70, 7: 30, 8: 100,
  9: 50, 10: 40, 11: 40, 12: 20, 13: 50, 14: 25, 15: 20, 16: 20,
  17: 10, 18: 25, 19: 12, 20: 10, 21: 10, 22: 10, 23: 8,
  24: 6, 25: 3, 26: 100, 27: 50, 28: 10
};

function ArastirmaProjeleri() {
  const navigate = useNavigate();
  const [projelerData, setProjelerData] = useState(
    projeTurleri.map((tur, index) => ({
      id: index + 1,
      projeTuru: tur,
      projeAdi: '',
      projeNo: '',
      kurumAdi: '',
      yili: '',
      katildim: false
    }))
  );

  const handleChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    setProjelerData(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, [name]: type === 'checkbox' ? checked : value }
          : p
      )
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const yapilanProjeler = projelerData
      .filter(p => p.katildim)
      .map(p => ({
        projeTuru: p.projeTuru,
        projeAdi: p.projeAdi,
        projeNo: p.projeNo,
        kurumAdi: p.kurumAdi,
        yili: p.yili,
        puan: projePuanlari[p.id] || 0
      }));
  
    const toplamPuan1_17 = yapilanProjeler
      .filter(p => p.id >= 1 && p.id <= 17)
      .reduce((acc, p) => acc + (p.puan || 0), 0);
  
    const toplamPuan1_22 = yapilanProjeler
      .filter(p => p.id >= 1 && p.id <= 22)
      .reduce((acc, p) => acc + (p.puan || 0), 0);
  
    const toplamPuan = yapilanProjeler
      .reduce((acc, p) => acc + (p.puan || 0), 0);
  
    try {
      // ✅ Bölüm H localStorage kayıtları
      localStorage.setItem('bolumH1_17', toplamPuan1_17);
      localStorage.setItem('bolumH1_22', toplamPuan1_22);
      localStorage.setItem('bolumH_toplam', toplamPuan);
  
      const response = await fetch('http://localhost:5000/api/projeler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projeler: yapilanProjeler,
          toplamPuan1_17,
          toplamPuan1_22,
          toplamPuan
        })
      });
  
      const contentType = response.headers.get('content-type');
  
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
  
        if (response.ok) {
          console.log('Başarıyla kaydedildi:', data);
          navigate('/DergiEditörlük'); // 🔄 Sonraki sayfa
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
      <h1>Araştırma Projeleri</h1>
      <form onSubmit={handleSubmit}>
        {projelerData.map(p => (
          <div key={p.id} className="faaliyet-box">
            <div className="proje-header">
              <h3>{p.id}) {p.projeTuru}</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="katildim"
                  checked={p.katildim}
                  onChange={(e) => handleChange(p.id, e)}
                />
                Bu projede yer aldım
              </label>
            </div>

            {p.katildim && (
              <div className="proje-detaylar">
                <label>Projenin Adı:
                  <input
                    type="text"
                    name="projeAdi"
                    value={p.projeAdi}
                    onChange={(e) => handleChange(p.id, e)}
                    required
                  />
                </label>

                <label>Proje Numarası:
                  <input
                    type="text"
                    name="projeNo"
                    value={p.projeNo}
                    onChange={(e) => handleChange(p.id, e)}
                    required
                  />
                </label>

                <label>Kurum Adı:
                  <input
                    type="text"
                    name="kurumAdi"
                    value={p.kurumAdi}
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
              </div>
            )}
          </div>
        ))}
        <button type="submit">Dergi Editörlük Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default ArastirmaProjeleri;
