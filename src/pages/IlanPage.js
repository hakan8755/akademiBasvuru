import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import FilterBar from '../components/FilterBar';
import IlanDetailDrawer from '../components/IlanDetailDrawer';
import './IlanPage.css';

const seviyeClass = (s) => {
  switch (s) {
    case 'Dr. Öğr. Üyesi': return 'dr';
    case 'Doçent': return 'doc';
    case 'Profesör': return 'prof';
    default: return 'default';
  }
};

export default function IlanPage() {
  const [ilanlar, setIlanlar] = useState([]);
  const [filtre, setFiltre] = useState({ seviye: 'Tümü', fakulte: 'Tümü' });
  const [secili, setSecili] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  /* ---------- ilanları çek ---------- */
  useEffect(() => {
    fetch('http://localhost:5000/api/ilanlar')
      .then(r => r.json())
      .then(setIlanlar)
      .catch(() => alert('İlanlar çekilemedi.'));
  }, []);

  /* ---------- filtreleme ---------- */
  const goster = (i) =>
    (filtre.seviye === 'Tümü' || i.seviye === filtre.seviye) &&
    (filtre.fakulte === 'Tümü' || i.fakultesi === filtre.fakulte);

  const filtered = ilanlar.filter(goster);

  /* ---------- başvuru başlat ---------- */
  const handleBasvur = async (ilan) => {
    console.log('🟢 handleBasvur çağrıldı:', ilan);
    console.log('🔑 ilanId:', ilan._id);
    console.log('👤 userId:', localStorage.getItem('userId'));

    try {
      const userId = localStorage.getItem('userId');
      if (!userId || userId === 'undefined') {
        alert('Giriş yapmanız gerekiyor.');
        navigate('/aday/login');
        return;
      }

      // İlanı seçip başvuru kaydını backend'e gönder
      const response = await fetch('http://localhost:5000/api/applications/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ilanId: ilan._id,
          userId: userId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Başvuru kayıt hatası:', data.message);
        alert(data.message || 'Başvuru başlatılamadı.');
        return;
      }

      // Başarıyla ilan seçildiyse localStorage'a yaz
      localStorage.setItem('ilanId', ilan._id);
      console.log('✅ İlan kaydedildi:', ilan._id);

      // İlgili form sayfasına yönlendir
      const ilkForm = ilan.gerekliFormlar?.[0] || 'makaleler';
      navigate('/' + ilkForm);

    } catch (err) {
      console.error('Başvuru başlatılırken hata oluştu:', err);
      alert('Başvuru başlatılamadı.');
    }
  };

  /* ---------- çıkış ---------- */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="ilan-page">
      <header className="ilan-header">
        <div className="header-top">
          <h1>Açık Akademik İlanlar</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>
        <p>Uygun ilanları filtreleyin ya da üzerine tıklayıp detaylarına göz atın.</p>
      </header>

      <div className="ilan-filters">
        <FilterBar ilanlar={ilanlar} filtre={filtre} onChange={setFiltre} />
      </div>

      <div className="ilan-list">
        {filtered.length === 0 && <p className="no-result">İlan bulunamadı.</p>}
        {filtered.map(ilan => (
          <div
            key={ilan._id}
            className="ilan-row"
            onClick={() => setSecili(ilan)}
          >
            <div className="ilan-left">
              <span className={`badge badge-${seviyeClass(ilan.seviye)}`}>
                {ilan.seviye}
              </span>
              <span className="ilan-birim">{ilan.birim}</span>
            </div>
            <div className="ilan-right">
              {new Date(ilan.baslangicTarihi).toLocaleDateString()} –{' '}
              {new Date(ilan.bitisTarihi).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Detay drawer açılırsa */}
      {secili && (
        <IlanDetailDrawer
          ilan={secili}
          onClose={() => setSecili(null)}
          onApply={() => handleBasvur(secili)}
        />
      )}
    </div>
  );
}
