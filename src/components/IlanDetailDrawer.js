import { AiOutlineClose } from 'react-icons/ai';

/**
 * İlan detay çekmecesi – Kriter alanı eksikse de çalışır.
 * Başvuru butonu, props üzerinden gelen fonksiyonla tetiklenir.
 */
export default function IlanDetailDrawer({ ilan = {}, onClose, onApply }) {
  // Güvenli değer atamaları
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
        {/* Kapatma butonu */}
        <button className="close-btn" onClick={onClose}>
          <AiOutlineClose />
        </button>

        <h2>{birim} – {seviye}</h2>
        <h4>{fakultesi}</h4>

        {/* Kriter kutusu */}
        <div className="kriter-box">
          <p><b>Temel Alan:</b> {temelAlan}</p>
          <p><b>Minimum makale:</b> {minMakale}</p>
          <p><b>A1/A2 zorunlu:</b> {a1Zorunlu ? 'Evet' : 'Hayır'}</p>
          <p><b>Toplam Puan:</b> {toplamPuan !== '-' ? `≥ ${toplamPuan}` : '-'}</p>
          <p><i>Kaynak:</i> {tabloReferansi}</p>
        </div>

        {/* PDF linki */}
        {pdfDosyaUrl !== '#' && (
          <a href={pdfDosyaUrl} target="_blank" rel="noreferrer" className="dokuman-link">
            İlan PDF
          </a>
        )}

        <p className="ilan-aciklama">{aciklama}</p>

        {/* Başvuru butonu */}
        <button
          className="basvur-btn"
          onClick={() => {
            console.log('Başvuru butonuna basıldı:', ilan); // ✅ gerçekten log alır
            onApply(); // ✅ gerçekten handleBasvur(secili) çağrılır
          }}
        >
          Başvuru Formunu Doldur
        </button>

      </div>
    </div>
  );
}
