import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/toplanti.css';

const faaliyetlerListesi = [
  "SCI-E, SSCI ve AHCI tarafından taranan dergilerde; Uluslararası yayınevleri tarafından yayımlanmış kitaplarda yayımlanan ve adayın yazar olarak yer almadığı yayınlardan her birinde, metin içindeki atıf sayısına bakılmaksızın adayın atıf yapılan her eseri için",
  "E-SCI tarafından taranan dergilerde ve adayın yazar olarak yer almadığı yayınlardan her birinde, metin içindeki atıf sayısına bakılmaksızın adayın atıf yapılan her eseri için",
  "SCI-E, SSCI, AHCI, E-SCI dışındaki diğer uluslararası indeksler tarafından taranan dergilerde; Uluslararası yayınevleri tarafından yayımlanmış kitaplarda bölüm yazarı olarak yayımlanan ve adayın yazar olarak yer almadığı yayınlardan her birinde, metin içindeki atıf sayısına bakılmaksızın adayın atıf yapılan her eseri için",
  "Ulusal hakemli dergilerde; Ulusal yayınevleri tarafından yayımlanmış kitaplarda yayımlanan ve adayın yazar olarak yer almadığı yayınlardan her birinde, metin içindeki atıf sayısına bakılmaksızın adayın atıf yapılan her eseri için",
  "Güzel sanatlardaki eserlerin uluslararası kaynak veya yayın organlarında yer alması veya gösterime ya da dinletime girmesi",
  "Güzel sanatlardaki eserlerin ulusal kaynak veya yayın organlarında yer alması veya gösterime ya da dinletime girmesi"
];

// 🔥 Atıf puanları
const atifPuanlari = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 3,
  6: 1
};

function Atiflar() {
  const navigate = useNavigate();

  const [faaliyetler, setFaaliyetler] = useState(
    faaliyetlerListesi.map((faaliyet, index) => ({
      id: index + 1,
      faaliyet,
      skipped: false,
      eser: '',
      atifSayisi: '',
      files: []
    }))
  );

  const toggleSkip = (id) => {
    setFaaliyetler(prev =>
      prev.map(f =>
        f.id === id ? { ...f, skipped: !f.skipped } : f
      )
    );
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setFaaliyetler(prev =>
      prev.map(f =>
        f.id === id ? { ...f, [name]: value } : f
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const yapilanFaaliyetler = faaliyetler.filter(f => !f.skipped);

    // 🔥 Atıflar toplam puanını hesapla
    const toplamPuan = yapilanFaaliyetler.reduce((sum, f) => {
      return sum + (atifPuanlari[f.id] || 0);
    }, 0);

    console.log("Atıflar Bölümü Toplam Puan:", toplamPuan);

    try {
      const formData = new FormData();

      formData.append('atiflar', JSON.stringify(yapilanFaaliyetler));
      formData.append('atiflarToplamPuan', toplamPuan); // 🆕 toplam puanı ekledik
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('ilanId', localStorage.getItem('ilanId'));

      yapilanFaaliyetler.forEach(faaliyet => {
        faaliyet.files.forEach(file => {
          formData.append('files', file);
        });
      });

      const response = await fetch('http://localhost:5000/api/atiflar', {
        method: 'POST',
        body: formData
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok) {
          console.log('Başarıyla kaydedildi:', data);
          alert(`Başarıyla kaydedildi. Atıflar puanı: ${toplamPuan}`);
          navigate("/dersverme"); // 🔄 Sonraki sayfa
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
      <h1>Atıflar</h1>
      <form onSubmit={handleSubmit}>
        {faaliyetler.map(f => (
          <div key={f.id} className={`faaliyet-box ${f.skipped ? 'skipped' : ''}`}>
            <h3>{f.id}) {f.faaliyet}</h3>

            {!f.skipped && (
              <>
                <label>Atıfın Yapıldığı Eser:
                  <input type="text" name="eser" value={f.eser} onChange={(e) => handleChange(f.id, e)} required />
                </label>

                <label>Atıf Sayısı:
                  <input type="text" name="atifSayisi" value={f.atifSayisi} onChange={(e) => handleChange(f.id, e)} required />
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
        <button type="submit">Ders Verme Sayfasına Geç</button>
      </form>
    </div>
  );
}

export default Atiflar;
