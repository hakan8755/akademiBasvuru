import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔸 Yönlendirme için eklendi
import '../styles/toplanti.css';

const tezTurleri = [
  "Doktora/Sanatta Yeterlik veya Tıp/Diş Hekimliğinde Uzmanlık tez yönetimi",
  "Yüksek Lisans Tez Yönetimi",
  "Doktora/Sanatta Yeterlik (Eş Danışman)",
  "Yüksek Lisans/Sanatta Yeterlik Tez Yönetimi (Eş Danışman)"
];

const puanTablosu = {
  1: 40,
  2: 15,
  3: 9,
  4: 4
};

function TezYonetimi() {
  const navigate = useNavigate(); // 🔸
  const [tezlerData, setTezlerData] = useState(
    tezTurleri.map((tur, index) => ({
      id: index + 1,
      tezTuru: tur,
      skipped: false,
      ogrenciAdi: '',
      tezAdi: '',
      enstitusu: '',
      yili: '',
      files: []
    }))
  );

  const toggleSkip = (id) => {
    setTezlerData(prev =>
      prev.map(t => t.id === id ? { ...t, skipped: !t.skipped } : t)
    );
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setTezlerData(prev =>
      prev.map(t => t.id === id ? { ...t, [name]: value } : t)
    );
  };

  const handleFileChange = (id, e) => {
    const uploaded = Array.from(e.target.files);
    setTezlerData(prev =>
      prev.map(t => t.id === id ? { ...t, files: [...t.files, ...uploaded] } : t)
    );
  };

  const removeFile = (id, fileName) => {
    setTezlerData(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, files: t.files.filter(file => file.name !== fileName) }
          : t
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const yapilanTezler = tezlerData.filter(t => !t.skipped);

    // 🔢 PUAN HESAPLARI
    let doktoraYuksekToplam = 0;
    let genelToplam = 0;

    yapilanTezler.forEach(t => {
      const puan = puanTablosu[t.id] || 0;
      genelToplam += puan;
      if (t.id === 1 || t.id === 2) doktoraYuksekToplam += puan;
    });

    try {
      const formData = new FormData();
      formData.append('tezler', JSON.stringify(yapilanTezler));
      formData.append('tezlerToplamPuan', genelToplam);
      formData.append('f1-f2', doktoraYuksekToplam);

      yapilanTezler.forEach(tez => {
        tez.files.forEach(file => {
          formData.append('files', file);
        });
      });

      const response = await fetch('http://localhost:5000/api/tezyonetimi', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert(`Kaydedildi! Toplam Puan: ${genelToplam} | Doktora + YL: ${doktoraYuksekToplam}`);
        navigate('/patentler'); // 🔸 yönlendirme
      } else {
        const data = await response.json();
        alert('Hata: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Sunucuya bağlanırken hata oluştu.');
    }
  };

  return (
    <div className="toplanti-form">
      <h1>Tez Yönetimi Faaliyetleri</h1>
      <form onSubmit={handleSubmit}>
        {tezlerData.map(t => (
          <div key={t.id} className={`faaliyet-box ${t.skipped ? 'skipped' : ''}`}>
            <h3>{t.id}) {t.tezTuru}</h3>

            {!t.skipped && (
              <>
                <label>Öğrenci Adı:
                  <input type="text" name="ogrenciAdi" value={t.ogrenciAdi} onChange={(e) => handleChange(t.id, e)} required />
                </label>

                <label>Tez Adı:
                  <input type="text" name="tezAdi" value={t.tezAdi} onChange={(e) => handleChange(t.id, e)} required />
                </label>

                <label>Enstitüsü:
                  <input type="text" name="enstitusu" value={t.enstitusu} onChange={(e) => handleChange(t.id, e)} required />
                </label>

                <label>Yılı:
                  <input type="text" name="yili" value={t.yili} onChange={(e) => handleChange(t.id, e)} required />
                </label>

                <label>Dosya Yükle:
                  <input type="file" multiple onChange={(e) => handleFileChange(t.id, e)} />
                </label>

                {t.files.length > 0 && (
                  <ul className="uploaded-list">
                    {t.files.map((file, idx) => (
                      <li key={idx}>
                        {file.name}
                        <button type="button" onClick={() => removeFile(t.id, file.name)}>Sil</button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            <div className="skip-section">
              <button type="button" onClick={() => toggleSkip(t.id)} className="skip-button">
                {t.skipped ? '✔️ Geri Al' : '❌ Vermedim'}
              </button>
            </div>
          </div>
        ))}

        <button type="submit">Patentler Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default TezYonetimi;
