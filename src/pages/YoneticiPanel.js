import React from 'react';
import { useNavigate } from 'react-router-dom';
import './YoneticiPanel.css';

export default function YoneticiPanel() {
    const nav = useNavigate();

    return (
        <div className="panel-container">
            <h2>🛠️ Yönetici Paneli</h2>

            <div className="panel-section">
                <h3>1. 📌 Kadro Kriterleri</h3>
                <p>Her ilan için kriter ve gerekli formları tanımlayın.</p>
                <button onClick={() => nav('/yonetici/kriterler')}>Kriterleri Belirle</button>
            </div>

            <div className="panel-section">
                <h3>2. 📑 İlanlar</h3>
                <p>İlanlara yapılan başvuruları ve aday belgelerini inceleyin.</p>
                <button onClick={() => nav('/yonetici/basvurular')}>Başvuruları Görüntüle</button>
            </div>

            <div className="panel-section">
                <h3>3. 📄 Otomatik Tablo 5</h3>
                <p>Başvuruya özel "Tablo 5" çıktısını PDF olarak oluşturun.</p>
                <button onClick={() => nav('/yonetici/pdf-indir')}>Tablo 5 Oluştur</button>
            </div>

            <div className="panel-section">
                <h3>4. 👨‍⚖️ Jüri İşlemleri</h3>
                <p>Her ilan için jüri üyelerini atayın veya düzenleyin.</p>
                <button onClick={() => nav('/yonetici/juri-atama')}>Jüri Seçimi</button>
            </div>

            <div className="panel-section">
                <h3>5. 🧾 Jüri Raporları</h3>
                <p>Jüri üyeleri tarafından yüklenen değerlendirme raporlarını inceleyin.</p>
                <button onClick={() => nav('/yonetici/raporlar')}>Raporları Görüntüle</button>
            </div>

            <div className="panel-section">
                <h3>6. ✅ Başvuru Sonucu</h3>
                <p>Jüri değerlendirmeleri sonrası adaylara sonuç bildirin.</p>
                <button onClick={() => nav('/yonetici/sonuc-bildir')}>Sonucu Açıkla</button>
            </div>


        </div>
    );
}
