import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import './IlanDetailDrawer.css'

export default function IlanDetailDrawer({ ilan, onClose }) {
  const { birim, seviye, fakultesi, temelAlan, kriter={}, aciklama, pdfDosyaUrl } = ilan
  const { minMakale, a1Zorunlu, toplamPuan, tabloReferansi } = kriter

  return (
    <div className="drawer-overlay">
      <div className="drawer">
        <button className="close-btn" onClick={onClose}>
          <AiOutlineClose size={24}/>
        </button>
        <h2>{birim}</h2>
        <p className="drawer-subtitle">{seviye} — {fakultesi}</p>

        <section className="kriter">
          <h4>Başvuru Kriterleri</h4>
          <ul>
            <li>Minimum makale: {minMakale ?? '-'}</li>
            <li>A1/A2 zorunlu: {a1Zorunlu ? 'Evet' : 'Hayır'}</li>
            <li>Toplam puan ≥ {toplamPuan ?? '-'}</li>
            <li>Kaynak: {tabloReferansi ?? '-'}</li>
          </ul>
        </section>

        {pdfDosyaUrl && (
          <a href={pdfDosyaUrl} target="_blank" rel="noreferrer" className="pdf-link">
            İlan PDF'sini Görüntüle
          </a>
        )}

        <p className="drawer-desc">{aciklama}</p>
      </div>
    </div>
  )
}
