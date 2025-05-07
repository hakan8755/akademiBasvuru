import React from 'react';
import './IlanCard.css';

const badgeClass = (seviye) => {
  switch (seviye) {
    case 'Dr. Öğr. Üyesi': return 'badge-dr';
    case 'Doçent':         return 'badge-docent';
    case 'Profesör':       return 'badge-prof';
    default:               return 'badge-default';
  }
};

export default function IlanCard({ ilan, onClick }) {
  return (
    <div className="ilan-card" onClick={onClick}>
      <div className={`ilan-badge ${badgeClass(ilan.seviye)}`}>
        {ilan.seviye}
      </div>
      <div className="ilan-body">
        <h3 className="ilan-title">{ilan.birim}</h3>
        <p className="ilan-faculty">{ilan.fakultesi}</p>
      </div>
      <div className="ilan-footer">
        {new Date(ilan.baslangicTarihi).toLocaleDateString()} –{' '}
        {new Date(ilan.bitisTarihi).toLocaleDateString()}
      </div>
    </div>
  );
}
