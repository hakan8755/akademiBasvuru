export default function FilterBar({ ilanlar, filtre, onChange }) {
  const fakListe = ["Tümü", ...new Set(ilanlar.map(i => i.fakultesi))];

  return (
    <div className="filter-bar">
      <select
        value={filtre.seviye}
        onChange={e => onChange({ ...filtre, seviye: e.target.value })}
      >
        {["Tümü", "Dr. Öğr. Üyesi", "Doçent", "Profesör"].map(x => (
          <option key={x}>{x}</option>
        ))}
      </select>

      <select
        value={filtre.fakulte}
        onChange={e => onChange({ ...filtre, fakulte: e.target.value })}
      >
        {fakListe.map(x => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </div>
  );
}
