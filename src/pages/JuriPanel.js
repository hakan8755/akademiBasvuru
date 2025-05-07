import { useEffect, useState } from 'react';

export default function JuriAtama() {
  const [ilanlar, setIlanlar] = useState([]);
  const [juriUyeleri, setJuriUyeleri] = useState([]);
  const [seciliIlanId, setSeciliIlanId] = useState(null);
  const [seciliJuri, setSeciliJuri] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/ilanlar')
      .then(r => r.json())
      .then(setIlanlar);

    fetch('http://localhost:5000/api/juri/adaylar')
      .then(r => r.json())
      .then(setJuriUyeleri);
  }, []);

  const ata = async () => {
    if (seciliJuri.length < 3) return alert("En az 3 jüri seçin.");
    const atayanYoneticiId = localStorage.getItem('userId');

    const juriSecimi = juriUyeleri
      .filter(j => seciliJuri.includes(j.tc))
      .map(j => ({ userId: j._id, ad: j.ad, soyad: j.soyad, tc: j.tc }));

    const res = await fetch('http://localhost:5000/api/juri/ata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ilanId: seciliIlanId, juriUyeleri: juriSecimi, atayanYoneticiId })
    });

    if (res.ok) alert("Jüri başarıyla atandı.");
    else alert("Hata oluştu.");
  };

  return (
    <div className="juri-atama">
      <h2>İlanlar</h2>
      <ul>
        {ilanlar.map(i => (
          <li key={i._id}>
            <button onClick={() => setSeciliIlanId(i._id)}>
              {i.fakultesi} / {i.seviye}
            </button>
          </li>
        ))}
      </ul>

      {seciliIlanId && (
        <div>
          <h3>Jüri Üyeleri</h3>
          <ul>
            {juriUyeleri.map(j => (
              <li key={j.tc}>
                <label>
                  <input
                    type="checkbox"
                    value={j.tc}
                    onChange={e => {
                      const val = e.target.value;
                      setSeciliJuri(prev =>
                        prev.includes(val)
                          ? prev.filter(tc => tc !== val)
                          : [...prev, val]
                      );
                    }}
                  />
                  {j.ad} {j.soyad} (TC: {j.tc})
                </label>
              </li>
            ))}
          </ul>
          <button onClick={ata}>Seçilen Jürileri Ata</button>
        </div>
      )}
    </div>
  );
}
