// pages/BilimselToplantiFaaliyetleri.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/toplanti.css';


const faaliyetTipleri = [
  "Uluslararası bilimsel toplantılarda sözlü olarak sunulan, tam metni matbu veya elektronik olarak bildiri kitapçığında yayımlanmış çalışmalar",
  "Uluslararası bilimsel toplantılarda sözlü olarak sunulan, özet metni matbu veya elektronik olarak bildiri kitapçığında yayımlanmış çalışmalar",
  "Uluslararası bilimsel toplantılarda poster olarak sunulan çalışmalar",
  "Ulusal bilimsel toplantılarda sözlü olarak sunulan tam metni matbu veya elektronik olarak bildiri kitapçığında yayımlanmış çalışmalar",
  "Ulusal bilimsel toplantılarda sözlü olarak sunulan, özet metni matbu veya elektronik olarak bildiri kitapçığında yayımlanmış çalışmalar",
  "Ulusal bilimsel toplantılarda poster olarak sunulan çalışmalar",
  "Uluslararası bir kongre, konferans veya sempozyumda organizasyon veya yürütme komitesinde düzenleme kurulu üyeliği veya bilim kurulu üyeliği yapmak",
  "Ulusal bir kongre, konferans veya sempozyumda organizasyon veya yürütme komitesinde düzenleme kurulu üyeliği veya bilim kurulu üyeliği yapmak",
  "Uluslararası konferanslarda, bilimsel toplantı, seminerlerde davetli konuşmacı olarak yer almak",
  "Ulusal konferanslarda, bilimsel toplantı, seminerlerde davetli konuşmacı olarak yer almak",
  "Uluslararası veya ulusal çeşitli kurumlarla işbirliği içinde atölye, çalıştay, yaz okulu organize ederek gerçekleştirmek",
  "Uluslararası veya ulusal çeşitli kurumlarla işbirliği içinde atölye, çalıştay, panel, seminer, yaz okulunda konuşmacı veya panelist olarak görev almak"
];

const faaliyetPuanlari = {
  1: 8, 2: 7, 3: 6, 4: 7, 5: 6, 6: 5,
  7: 7, 8: 5, 9: 8, 10: 6, 11: 6, 12: 5
};

function BilimselToplantiFaaliyetleri() {
  const navigate = useNavigate();

  const [faaliyetler, setFaaliyetler] = useState(
    faaliyetTipleri.map((tip, index) => ({
      id: index + 1,
      tip,
      skipped: false,
      authors: '',
      title: '',
      conferenceName: '',
      location: '',
      pages: '',
      date: '',
      authorCount: 1,
      files: []
    }))
  );
  console.log('Mevcut ilanId:', localStorage.getItem('ilanId'));

  const toggleSkip = (id) => {
    setFaaliyetler(prev =>
      prev.map(f => f.id === id ? { ...f, skipped: !f.skipped } : f)
    );
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setFaaliyetler(prev =>
      prev.map(f =>
        f.id === id ? {
          ...f,
          [name]: name === 'authorCount' ? parseInt(value) || 1 : value
        } : f
      )
    );
  };

  const handleFileChange = (id, e) => {
    const uploaded = Array.from(e.target.files);
    setFaaliyetler(prev =>
      prev.map(f =>
        f.id === id ? { ...f, files: [...f.files, ...uploaded] } : f
      )
    );
  };

  const removeFile = (id, fileName) => {
    setFaaliyetler(prev =>
      prev.map(f =>
        f.id === id ? { ...f, files: f.files.filter(file => file.name !== fileName) } : f
      )
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

    const userId = localStorage.getItem('userId');
    const ilanId = localStorage.getItem('ilanId');

    if (!userId || !ilanId || ilanId === 'null') {
      alert("Giriş yapmadınız veya ilana tıklamadınız. Lütfen ilana gidip tekrar deneyin.");
      return;
    }

    const yapilanFaaliyetler = faaliyetler.filter(f => !f.skipped);

    const toplamPuan = yapilanFaaliyetler.reduce((sum, f) => {
      const base = faaliyetPuanlari[f.id] || 0;
      const k = calculateK(f.authorCount || 1);
      return sum + Math.round(base * k);
    }, 0);

    try {
      const formData = new FormData();
      formData.append('faaliyetler', JSON.stringify(yapilanFaaliyetler));
      formData.append('bolumBToplamPuan', toplamPuan);
      formData.append('userId', userId);
      formData.append('ilanId', ilanId);

      yapilanFaaliyetler.forEach(f => {
        f.files.forEach(file => {
          formData.append('files', file);
        });
      });

      const response = await fetch('http://localhost:5000/api/faaliyet/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert(`Başarıyla gönderildi. Bölüm B puanı: ${toplamPuan}`);
        navigate('/kitaplar');
      } else {
        const errorText = await response.text();
        console.error('Sunucu cevabı:', errorText);
        alert('Sunucu hatası oluştu.');
      }

    } catch (err) {
      console.error('Gönderim hatası:', err);
      alert('Gönderim sırasında hata oluştu.');
    }
  };

  return (
    <div className="toplanti-form">
      <h1>Bilimsel Toplantı Faaliyetleri</h1>
      <form onSubmit={handleSubmit}>
        {faaliyetler.map(f => (
          <div key={f.id} className={`faaliyet-box ${f.skipped ? 'skipped' : ''}`}>
            <h3>{f.id}) {f.tip}</h3>

            {!f.skipped && (
              <>
                <label>Yazar/Yazarlar:
                  <input type="text" name="authors" value={f.authors} onChange={(e) => handleChange(f.id, e)} required />
                </label>

                <label>Bildiri Adı:
                  <input type="text" name="title" value={f.title} onChange={(e) => handleChange(f.id, e)} required />
                </label>

                <label>Konferansın Adı:
                  <input type="text" name="conferenceName" value={f.conferenceName} onChange={(e) => handleChange(f.id, e)} required />
                </label>

                <label>Yapıldığı Yer:
                  <input type="text" name="location" value={f.location} onChange={(e) => handleChange(f.id, e)} required />
                </label>

                <label>Sayfa Sayıları:
                  <input type="text" name="pages" value={f.pages} onChange={(e) => handleChange(f.id, e)} required />
                </label>

                <label>Tarih:
                  <input type="date" name="date" value={f.date} onChange={(e) => handleChange(f.id, e)} required />
                </label>

                <label>Kişi Sayısı:
                  <input type="number" name="authorCount" min="1" value={f.authorCount} onChange={(e) => handleChange(f.id, e)} required />
                </label>

                <label>Dosya Yükle:
                  <input type="file" multiple onChange={(e) => handleFileChange(f.id, e)} />
                </label>

                {f.files.length > 0 && (
                  <ul className="uploaded-list">
                    {f.files.map((file, idx) => (
                      <li key={idx}>
                        {file.name}
                        <button type="button" onClick={() => removeFile(f.id, file.name)}>Sil</button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            <div className="skip-section">
              <button type="button" onClick={() => toggleSkip(f.id)} className="skip-button">
                {f.skipped ? '✔️ Geri Al' : '❌ Yapmadım'}
              </button>
            </div>
          </div>
        ))}
        <button type="submit">Kitaplar Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default BilimselToplantiFaaliyetleri;
