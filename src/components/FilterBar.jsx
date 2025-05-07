import React from 'react'
import './FilterBar.css'

export default function FilterBar({ ilanlar, filtre, onChange }) {
  const seviyeOps = ['Tümü', 'Dr. Öğr. Üyesi', 'Doçent', 'Profesör']
  const fakulteOps = ['Tümü', ...new Set(ilanlar.map(i => i.fakultesi))]

  return (
    <div className="filter-bar">
      <select
        value={filtre.seviye}
        onChange={e => onChange({ ...filtre, seviye: e.target.value })}
      >
        {seviyeOps.map(x => <option key={x}>{x}</option>)}
      </select>

      <select
        value={filtre.fakulte}
        onChange={e => onChange({ ...filtre, fakulte: e.target.value })}
      >
        {fakulteOps.map(x => <option key={x}>{x}</option>)}
      </select>
    </div>
  )
}
