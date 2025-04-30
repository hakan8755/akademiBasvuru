// Kitap.jsx - kişi sayısına göre k katsayısı ile puan hesaplama
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/toplanti.css';

const kitapFaaliyetleri = [
  "Uluslararası yayınevleri tarafından yayımlanmış özgün kitap",
  "Uluslararası yayınevleri tarafından yayımlanmış özgün kitap editörlüğü, bölüm yazarlığı (Her bir kitap için maksimum 2 bölüm yazarlığı)",
  "Uluslararası yayımlanan ansiklopedi konusu/maddesi (en fazla 3 madde)",
  "Ulusal yayınevleri tarafından yayımlanan özgün kitap",
  "Ulusal yayınevleri tarafından yayımlanan özgün kitap editörlüğü, bölüm yazarlığı (Her bir kitap için maksimum 2 bölüm yazarlığı)",
  "Tam kitap çevirisi (Yayınevleri için ilgili ÜAK kriterleri geçerlidir)",
  "Çeviri kitap editörlüğü, kitap bölümü çevirisi (Her bir kitap için maksimum 2 bölüm çevirisi)",
  "Alanında ulusal yayımlanan ansiklopedi konusu/maddesi (en fazla 3 madde)"
];

const kitapPuanlari = { 1: 60, 2: 20, 3: 5, 4: 40, 5: 10, 6: 15, 7: 6, 8: 3 };

function Kitap() {
  const navigate = useNavigate();

  const [kitaplar, setKitaplar] = useState(
    kitapFaaliyetleri.map((tip, index) => ({
      id: index + 1,
      tip,
      skipped: false,
      authors: '',
      bookTitle: '',
      publisher: '',
      edition: '',
      location: '',
      year: '',
      authorCount: 1,
      files: []
    }))
  );

  const toggleSkip = (id) => {
    setKitaplar(prev => prev.map(k => (k.id === id ? { ...k, skipped: !k.skipped } : k)));
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setKitaplar(prev =>
      prev.map(k => (k.id === id ? {
        ...k,
        [name]: name === 'authorCount' ? parseInt(value) || 1 : value
      } : k))
    );
  };

  const handleFileChange = (id, e) => {
    const uploaded = Array.from(e.target.files);
    setKitaplar(prev =>
      prev.map(k => (k.id === id ? { ...k, files: [...k.files, ...uploaded] } : k))
    );
  };

  const removeFile = (id, fileName) => {
    setKitaplar(prev =>
      prev.map(k => (k.id === id ? { ...k, files: k.files.filter(file => file.name !== fileName) } : k))
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

    const yapilanKitaplar = kitaplar.filter(k => !k.skipped);

    const toplamPuan = yapilanKitaplar.reduce((sum, k) => {
      const base = kitapPuanlari[k.id] || 0;
      const kCarpan = calculateK(k.authorCount || 1);
      return sum + Math.round(base * kCarpan);
    }, 0);

    try {
      localStorage.setItem('bolumC_toplam', toplamPuan);

      const formData = new FormData();
      formData.append('kitaplar', JSON.stringify(yapilanKitaplar));
      formData.append('kitaplarToplamPuan', toplamPuan);

      yapilanKitaplar.forEach(kitap => {
        kitap.files.forEach(file => formData.append('files', file));
      });

      const response = await fetch('http://localhost:5000/api/kitaplar', {
        method: 'POST',
        body: formData
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok) {
          alert(`Başarıyla kaydedildi. Kitaplar puanı: ${toplamPuan}`);
          navigate("/atıflar");
        } else {
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
      <h1>Kitaplar</h1>
      <form onSubmit={handleSubmit}>
        {kitaplar.map(k => (
          <div key={k.id} className={`faaliyet-box ${k.skipped ? 'skipped' : ''}`}>
            <h3>{k.id}) {k.tip}</h3>
            {!k.skipped && (
              <>
                <label>Yazar/Yazarlar:
                  <input type="text" name="authors" value={k.authors} onChange={(e) => handleChange(k.id, e)} required />
                </label>
                <label>Kitap Adı:
                  <input type="text" name="bookTitle" value={k.bookTitle} onChange={(e) => handleChange(k.id, e)} required />
                </label>
                <label>Yayınevi:
                  <input type="text" name="publisher" value={k.publisher} onChange={(e) => handleChange(k.id, e)} required />
                </label>
                <label>Baskı Sayısı:
                  <input type="text" name="edition" value={k.edition} onChange={(e) => handleChange(k.id, e)} required />
                </label>
                <label>Yayımlandığı Yer:
                  <input type="text" name="location" value={k.location} onChange={(e) => handleChange(k.id, e)} required />
                </label>
                <label>Yıl:
                  <input type="text" name="year" value={k.year} onChange={(e) => handleChange(k.id, e)} required />
                </label>
                <label>Kişi Sayısı:
                  <input type="number" name="authorCount" min="1" value={k.authorCount} onChange={(e) => handleChange(k.id, e)} required />
                </label>
                <label>Dosya Yükle:
                  <input type="file" multiple onChange={(e) => handleFileChange(k.id, e)} />
                </label>
                {k.files.length > 0 && (
                  <ul className="uploaded-list">
                    {k.files.map((file, idx) => (
                      <li key={idx}>
                        {file.name}
                        <button type="button" onClick={() => removeFile(k.id, file.name)}>Sil</button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            <div className="skip-section">
              <button type="button" onClick={() => toggleSkip(k.id)} className="skip-button">
                {k.skipped ? '✔️ Geri Al' : '❌ Yapmadım'}
              </button>
            </div>
          </div>
        ))}
        <button type="submit">Atıflar Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default Kitap;