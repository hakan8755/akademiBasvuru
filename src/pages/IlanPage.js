// src/pages/IlanPage.js
import { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import IlanDetailDrawer from '../components/IlanDetailDrawer';
import './IlanPage.css';

const seviyeClass = (s) => {
  switch (s) {
    case 'Dr. Öğr. Üyesi': return 'dr';
    case 'Doçent':         return 'doc';
    case 'Profesör':       return 'prof';
    default:               return 'default';
  }
};

export default function IlanPage() {
  const [ilanlar, setIlanlar] = useState([]);
  const [filtre, setFiltre] = useState({ seviye: 'Tümü', fakulte: 'Tümü' });
  const [secili, setSecili] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/ilanlar')
      .then(r => r.json())
      .then(setIlanlar)
      .catch(() => alert('İlan çekilemedi'));
  }, []);

  const goster = (i) =>
    (filtre.seviye === 'Tümü'  || i.seviye   === filtre.seviye) &&
    (filtre.fakulte === 'Tümü' || i.fakultesi === filtre.fakulte);

  const filtered = ilanlar.filter(goster);

  return (
    <div className="ilan-page">
      <header className="ilan-header">
        <h1>Açık Akademik İlanlar</h1>
        <p>Uygun ilanları filtreleyin ya da üzerine tıklayıp detayına bakın.</p>
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

      {secili && (
        <IlanDetailDrawer ilan={secili} onClose={() => setSecili(null)} />
      )}
    </div>
  );
}
