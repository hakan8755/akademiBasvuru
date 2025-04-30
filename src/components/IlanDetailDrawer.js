import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

/**
 * İlan detay çekmecesi – Kriter alanı eksikse de çalışır.
 * "Başvuru Formunu Doldur" butonu artık /makaleler sayfasına yönlendirir.
 */
export default function IlanDetailDrawer({ ilan = {}, onClose }) {
  const nav = useNavigate();

  // Güvenli de‑structure
  const {
    birim = '-',
    seviye = '-',
    fakultesi = '-',
    temelAlan = '-',
    kriter = {},
    pdfDosyaUrl = '#',
    aciklama = ''
  } = ilan;

  const {
    minMakale = '-',
    a1Zorunlu = false,
    toplamPuan = '-',
    tabloReferansi = '-'
  } = kriter || {};

  return (
    <div className="drawer-overlay">
      <div className="drawer">
        <button className="close-btn" onClick={onClose}>
          <AiOutlineClose />
        </button>

        <h2>{birim} – {seviye}</h2>
        <h4>{fakultesi}</h4>

        <div className="kriter-box">
          <p><b>Temel Alan:</b> {temelAlan}</p>
          <p><b>Minimum makale:</b> {minMakale}</p>
          <p><b>A1/A2 zorunlu:</b> {a1Zorunlu ? 'Evet' : 'Hayır'}</p>
          <p><b>Toplam Puan:</b> {toplamPuan !== '-' ? `≥ ${toplamPuan}` : '-'}</p>
          <p><i>Kaynak:</i> {tabloReferansi}</p>
        </div>

        {pdfDosyaUrl !== '#' && (
          <a href={pdfDosyaUrl} target="_blank" rel="noreferrer" className="dokuman-link">
            İlan PDF
          </a>
        )}

        <p className="ilan-aciklama">{aciklama}</p>

        {/* 🔽 Yönlendirme burada */}
        <button className="basvur-btn" onClick={() => nav('/makaleler')}> 
          Başvuru Formunu Doldur
        </button>
      </div>
    </div>
  );
}