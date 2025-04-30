import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/sanat.css';

// 🔥 Faaliyetler + Puanlar
const faaliyetler = [
  { faaliyet: "Özgün sanat eserlerinin, tasarım veya yorum çalışmalarının yurt dışında satın alınması veya telif ödenmesi", puan: 40 },
  { faaliyet: "Özgün sanat eserlerinin, tasarım veya yorum çalışmalarının yurt içinde satın alınması veya telif ödenmesi", puan: 25 },
  { faaliyet: "Yerel Yönetimler/Özel Kuruluşların desteklediği kamusal sanat projeleri", puan: 40 },
  { faaliyet: "Galerilerde/müzelerde/kültür merkezlerinde küratörlük etkinlikleri", puan: 10 },
  { faaliyet: "Yurtdışında uluslararası jürili kişisel etkinlik", puan: 25 },
  { faaliyet: "Yurtiçinde jürili kişisel etkinlik", puan: 20 },
  { faaliyet: "Yurtdışında uluslararası jürili karma etkinlik", puan: 20 },
  { faaliyet: "Yurtiçinde ulusal jürili karma etkinlik", puan: 10 },
  { faaliyet: "Uluslararası çalıştay/workshop yöneticiliği", puan: 20 },
  { faaliyet: "Ulusal çalıştay/workshop yöneticiliği", puan: 10 },
  { faaliyet: "Uluslararası çalıştay araştırmacılığı/kurul üyeliği", puan: 10 },
  { faaliyet: "Ulusal çalıştay araştırmacılığı/kurul üyeliği", puan: 6 },
  { faaliyet: "Uluslararası yarışma/festival jüri üyeliği", puan: 6 },
  { faaliyet: "Ulusal yarışma/festival jüri üyeliği", puan: 4 },
  { faaliyet: "Uluslararası haber/yayın organında eser görünmesi", puan: 2 },
  { faaliyet: "Ulusal haber/yayın organında eser görünmesi", puan: 2 },
  { faaliyet: "Uluslararası resital icrası", puan: 40 },
  { faaliyet: "Uluslararası konserde solist icracı", puan: 35 },
  { faaliyet: "Uluslararası konserde karma icracı", puan: 27 },
  { faaliyet: "Uluslararası konserde orkestra/koro şefliği", puan: 40 },
  { faaliyet: "Uluslararası konserde oda müziği icrası", puan: 30 },
  { faaliyet: "Uluslararası konserde grup şefi", puan: 20 },
  { faaliyet: "Uluslararası konserde grup üyesi", puan: 18 },
  { faaliyet: "Uluslararası konserde eşlikçi", puan: 23 },
  { faaliyet: "Uluslararası konserde konser yönetmeni", puan: 15 },
  { faaliyet: "Ulusal resital icrası", puan: 35 },
  { faaliyet: "Ulusal konserde bireysel icracı", puan: 30 },
  { faaliyet: "Ulusal konserde karma icracı", puan: 23 },
  { faaliyet: "Ulusal konserde orkestra/koro şefliği", puan: 30 },
  { faaliyet: "Ulusal konserde oda müziği icrası", puan: 23 },
  { faaliyet: "Ulusal konserde grup şefi", puan: 15 },
  { faaliyet: "Ulusal konserde grup üyesi", puan: 13 },
  { faaliyet: "Ulusal konserde eşlikçi", puan: 18 },
  { faaliyet: "Ulusal konserde konser yönetmeni", puan: 10 },
  { faaliyet: "Uluslararası sesli-görsel etkinlik bireysel ses yayını", puan: 45 },
  { faaliyet: "Uluslararası sesli-görsel etkinlik karma ses yayını", puan: 35 },
  { faaliyet: "Uluslararası sesli-görsel etkinlik müzik yönetmeni", puan: 30 },
  { faaliyet: "Uluslararası Radyo/TV programı hazırlamak", puan: 15 },
  { faaliyet: "Uluslararası Radyo/TV katılımcılığı bireysel", puan: 13 },
  { faaliyet: "Uluslararası Radyo/TV katılımcılığı karma", puan: 10 },
  { faaliyet: "Ulusal sesli-görsel etkinlik bireysel ses yayını", puan: 40 },
  { faaliyet: "Ulusal sesli-görsel etkinlik karma ses yayını", puan: 30 },
  { faaliyet: "Ulusal sesli-görsel etkinlik müzik yönetmeni", puan: 25 },
  { faaliyet: "Ulusal Radyo/TV programı hazırlamak", puan: 13 },
  { faaliyet: "Ulusal Radyo/TV katılımcılığı bireysel", puan: 10 },
  { faaliyet: "Ulusal Radyo/TV katılımcılığı karma", puan: 8 },
  { faaliyet: "Ulusal Orkestra için 0-5 dk eser", puan: 30 },
  { faaliyet: "Ulusal Orkestra için 5-10 dk eser", puan: 35 },
  { faaliyet: "Ulusal Orkestra için 10-15 dk eser", puan: 40 },
  { faaliyet: "Ulusal Orkestra için 15+ dk eser", puan: 45 },
  { faaliyet: "Ulusal Oda Müziği için 0-5 dk eser", puan: 28 },
  { faaliyet: "Ulusal Oda Müziği için 5-10 dk eser", puan: 33 },
  { faaliyet: "Ulusal Oda Müziği için 10-15 dk eser", puan: 38 },
  { faaliyet: "Ulusal Oda Müziği için 15+ dk eser", puan: 43 },
  { faaliyet: "Ulusal Elektro-Akustik 0-5 dk eser", puan: 25 },
  { faaliyet: "Ulusal Elektro-Akustik 5-10 dk eser", puan: 30 },
  { faaliyet: "Ulusal Elektro-Akustik 10-15 dk eser", puan: 35 },
  { faaliyet: "Ulusal Elektro-Akustik 15+ dk eser", puan: 40 },
  { faaliyet: "Uluslararası Orkestra için 0-5 dk eser", puan: 35 },
  { faaliyet: "Uluslararası Orkestra için 5-10 dk eser", puan: 40 },
  { faaliyet: "Uluslararası Orkestra için 10-15 dk eser", puan: 45 },
  { faaliyet: "Uluslararası Orkestra için 15+ dk eser", puan: 50 },
  { faaliyet: "Uluslararası Oda Müziği 0-5 dk eser", puan: 33 },
  { faaliyet: "Uluslararası Oda Müziği 5-10 dk eser", puan: 38 },
  { faaliyet: "Uluslararası Oda Müziği 10-15 dk eser", puan: 43 },
  { faaliyet: "Uluslararası Oda Müziği 15+ dk eser", puan: 48 },
  { faaliyet: "Uluslararası Elektro-Akustik 0-5 dk eser", puan: 30 },
  { faaliyet: "Uluslararası Elektro-Akustik 5-10 dk eser", puan: 35 },
  { faaliyet: "Uluslararası Elektro-Akustik 10-15 dk eser", puan: 40 },
  { faaliyet: "Uluslararası Elektro-Akustik 15+ dk eser", puan: 45 },
  { faaliyet: "Türk Müziği Geleneksel Beste (Nota ile belge)", puan: 35 },
  { faaliyet: "Türk Müziği Bestelenmiş ve Seslendirilmiş Eser (ulusal)", puan: 40 },
  { faaliyet: "Türk Müziği Bestelenmiş ve Seslendirilmiş Eser (uluslararası)", puan: 45 },
  { faaliyet: "THM alanında derleme (TRT onaylı)", puan: 45 },
  { faaliyet: "THM alanında derleme (Nota ile belge)", puan: 40 },
  { faaliyet: "THM alanında derlenmiş parçanın notaya alınması (TRT)", puan: 15 },
  { faaliyet: "Büyük oyun/film yönetmenliği", puan: 18 },
  { faaliyet: "Kısa oyun/film yönetmenliği", puan: 7 },
  { faaliyet: "Uzun sahne oyunu/senaryo/dizi drama yazarlığı", puan: 18 },
  { faaliyet: "Kısa sahne oyunu/senaryo yazarlığı", puan: 7 },
  { faaliyet: "Uzun uyarlama oyun/senaryo metni", puan: 10 },
  { faaliyet: "Kısa uyarlama oyun/senaryo metni", puan: 5 },
  { faaliyet: "Uzun dramaturgi yapmak", puan: 18 },
  { faaliyet: "Kısa dramaturgi yapmak", puan: 7 },
  { faaliyet: "Uzun oyun/senaryo çeviri", puan: 10 },
  { faaliyet: "Kısa oyun/senaryo çeviri", puan: 3 },
  { faaliyet: "Başrol uzun oyun/film/dizi", puan: 18 },
  { faaliyet: "Yan rol uzun oyun/film/dizi", puan: 10 },
  { faaliyet: "Başrol kısa oyun/film", puan: 7 },
  { faaliyet: "Yan rol kısa oyun/film", puan: 3 },
  { faaliyet: "Uzun dekor/kostüm/ışık/ses tasarımı", puan: 18 },
  { faaliyet: "Uzun ekip çalışması dekor/kostüm/ses", puan: 7 },
  { faaliyet: "Kısa dekor/kostüm/ışık tasarımı", puan: 7 },
  { faaliyet: "Kısa ekip çalışması dekor/kostüm/ses", puan: 3 },
  { faaliyet: "Uzun makyaj/mask/kukla tasarımı", puan: 15 },
  { faaliyet: "Uzun makyaj/mask/kukla tasarımı ekip çalışması", puan: 5 },
  { faaliyet: "Kısa makyaj/mask/kukla tasarımı", puan: 7 },
  { faaliyet: "Kısa makyaj/mask/kukla ekip çalışması", puan: 3 },
  { faaliyet: "Sanat yönetmenliği uzun prodüksiyon", puan: 18 },
  { faaliyet: "Sanat yönetmenliği kısa prodüksiyon", puan: 7 },
  { faaliyet: "Koreografi, performans, happening yönetimi", puan: 10 },
  { faaliyet: "Kongre, festival, sempozyum atölye çalışması düzenleme", puan: 7 },
  { faaliyet: "Yapıtın festival/şenlik katılımı", puan: 15 },
  { faaliyet: "TV, dijital platformlarda yapıt gösterimi", puan: 18 },
  { faaliyet: "Sanatsal yarışmada 10+ ödül alınması", puan: 18 }
];

function Sanat() {
  const navigate = useNavigate();
  const [faaliyetlerData, setFaaliyetlerData] = useState(
    faaliyetler.map((f, index) => ({
      id: index + 1,
      faaliyet: f.faaliyet,
      puan: f.puan,
      faaliyetAdi: '',
      yili: '',
      aktif: false
    }))
  );

  const handleChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    setFaaliyetlerData(prev =>
      prev.map(f =>
        f.id === id
          ? { ...f, [name]: type === 'checkbox' ? checked : value }
          : f
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const yapilanFaaliyetler = faaliyetlerData.filter(f => f.aktif);

    // 🔥 Toplam puanı hesapla
    const toplamPuan = yapilanFaaliyetler.reduce((acc, f) => acc + f.puan, 0);

    try {
      const response = await fetch('http://localhost:5000/api/sanatsalfaaliyetler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          faaliyetler: yapilanFaaliyetler,
          toplamPuan: toplamPuan
        })
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok) {
          console.log('Başarıyla kaydedildi:', data);
          navigate('/puan-durumu');
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
      <h1>Sanatsal Faaliyetler ve Başarılar</h1>
      <form onSubmit={handleSubmit}>
        {faaliyetlerData.map(f => (
          <div key={f.id} className="faaliyet-box">
            <div className="proje-header">
              <h3>{f.id}) {f.faaliyet} <span>({f.puan} puan)</span></h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="aktif"
                  checked={f.aktif}
                  onChange={(e) => handleChange(f.id, e)}
                />
                Bu faaliyeti gerçekleştirdim
              </label>
            </div>

            {f.aktif && (
              <div className="proje-detaylar">
                <label>Faaliyet Adı:
                  <input
                    type="text"
                    name="faaliyetAdi"
                    value={f.faaliyetAdi}
                    onChange={(e) => handleChange(f.id, e)}
                    required
                  />
                </label>

                <label>Yılı:
                  <input
                    type="text"
                    name="yili"
                    value={f.yili}
                    onChange={(e) => handleChange(f.id, e)}
                    required
                    placeholder="YYYY"
                  />
                </label>
              </div>
            )}
          </div>
        ))}
        <button type="submit">Sonraki Sayfaya Geç</button>
      </form>
    </div>
  );
}

export default Sanat;