// src/components/IlanCard.js   (veya proje içindeki gerçek yolu)

export default function IlanCard({ ilan, onClick }) {
  /* ----------------------------------------------------------
     Rozet & sol kenar rengi (renk haritası küçük kaldı)
  ---------------------------------------------------------- */
  const renk =
    ilan.seviye === 'Profesör'
      ? 'bg-red-600'
      : ilan.seviye === 'Doçent'
      ? 'bg-indigo-600'
      : 'bg-emerald-600';

  return (
    <button
      onClick={onClick}
      /* kartın tamamına hafif animasyon + gölge */
      className="
        ilan-card w-full text-left p-4 rounded-xl bg-white shadow
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
      "
    >
      {/* -------- Seviye rozeti -------- */}
      <span
        className={`
          inline-block mb-3 px-2 py-0.5 rounded-full text-xs font-semibold text-white
          ${renk}
        `}
      >
        {ilan.seviye}
      </span>

      {/* -------- Başlıklar -------- */}
      <h3 className="text-lg font-semibold text-gray-800 truncate">{ilan.birim}</h3>
      <p className="text-sm text-gray-600 mb-3 truncate">{ilan.fakultesi}</p>

      {/* -------- Yalnızca kontenjan -------- */}
      <p className="text-sm">
        <b>Kontenjan:</b> {ilan.kontenjan}
      </p>
    </button>
  );
}
