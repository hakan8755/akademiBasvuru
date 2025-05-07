// src/pages/IlanForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import "./IlanForm.css";

export default function IlanForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    seviye: "Dr. Öğr. Üyesi",
    fakultesi: "",
    temelAlan: "",
    baslangic: "",
    bitis: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!form.fakultesi || !form.baslangic || !form.bitis) {
      setError("Lütfen * işaretli alanları doldurun.");
      setSaving(false);
      return;
    }

    const payload = {
      seviye: form.seviye,
      fakultesi: form.fakultesi,
      temelAlan: form.temelAlan,
      baslangicTarihi: form.baslangic,
      bitisTarihi: form.bitis
    };

    try {
      const r = await fetch("http://localhost:5000/api/ilanlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error((await r.json()).message || "Kayıt hatası");
      alert("İlan başarıyla eklendi!");
      nav("/admin/panel");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-card">
        <h1>Yeni Akademik İlan</h1>

        {error && <p className="error">{error}</p>}

        {/* Seviye */}
        <FieldRow label="Seviye *">
          <select name="seviye" value={form.seviye} onChange={onChange} className="input" required>
            <option>Dr. Öğr. Üyesi</option>
            <option>Doçent</option>
            <option>Profesör</option>
          </select>
        </FieldRow>

        {/* Fakülte */}
        <FieldRow label="Fakülte *">
          <select name="fakultesi" value={form.fakultesi} onChange={onChange} className="input" required>
            <option value="">-- Seçiniz --</option>
            <option>Sağlık Bilimleri, Fen Bilimleri ve Matematik, Mühendislik, Ziraat, Orman ve Su Ürünleri Temel Alanı</option>
            <option>Eğitim Bilimleri, Filoloji, Mimarlık, Planlama ve Tasarım, Sosyal, Beşeri ve İdari Bilimler ile Spor Bilimleri Temel Alanı</option>
            <option>Hukuk, İlahiyat Temel Alanı</option>
            <option>Güzel Sanatlar (Konservatuvar dahil) Temel Alanı</option>
          </select>
        </FieldRow>

        {/* Temel Alan */}
        <FieldRow label="Temel Alan">
          <input name="temelAlan" value={form.temelAlan} onChange={onChange} className="input" />
        </FieldRow>

        {/* Başlangıç Tarihi */}
        <FieldRow label="Başlangıç Tarihi *">
          <input type="date" name="baslangic" value={form.baslangic} onChange={onChange} className="input" required />
        </FieldRow>

        {/* Bitiş Tarihi */}
        <FieldRow label="Bitiş Tarihi *">
          <input type="date" name="bitis" value={form.bitis} onChange={onChange} className="input" required />
        </FieldRow>

        {/* Kaydet Butonu */}
        <button type="submit" disabled={saving} className="btn">
          <AiOutlineSave /> {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </form>
    </div>
  );
}

/* ---------- Küçük Yardımcı  ---------- */
const FieldRow = ({ label, children }) => (
  <div className="field-row">
    <label className="label row-label">{label}</label>
    <div className="row-input">{children}</div>
  </div>
);
