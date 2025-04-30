// src/components/JuriDrawer.jsx
import { useState, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlineFilePdf } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { useAuth } from "../App";
import "./JuriDrawer.css";

export default function JuriDrawer({ app = {}, onClose, onSubmitted }) {
  const { token } = useAuth().user || {};
  const [verdict, setVerdict] = useState("");      // "accept" | "reject"
  const [note,    setNote]    = useState("");
  const [file,    setFile]    = useState(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);

  /* ESC tuşuna basılınca kapat */
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Overlay’e (karanlık arka plan) tıklama – drawer dışına tıksa kapat */
  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) onClose?.();
  };

  /* ---- Gönder ---- */
  const submit = async () => {
    if (!verdict) return alert("Lütfen sonucu seçin");

    const fd = new FormData();
    fd.append("applicationId", app._id);
    fd.append("verdict", verdict);
    fd.append("note", note);
    if (file) fd.append("report", file);

    setSending(true);
    try {
      const r = await fetch("http://localhost:5000/api/juri/evaluate", {
        method : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body   : fd
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      alert("Değerlendirmeniz kaydedildi");
      onSubmitted?.();   // listeyi tazele
      onClose?.();
    } catch (err) {
      alert(err.message || "Sunucu hatası");
    } finally { setSending(false); }
  };

  return (
    <div className="drawer-overlay" onClick={handleOverlayClick}>
      <aside className="drawer">
        <button className="close-btn" onClick={onClose}>
          <AiOutlineClose/>
        </button>

        {/* -------- Başlık -------- */}
        <header className="drawer-head">
          <h2>{app.candidate?.fullName || "-"}</h2>
          <p className="muted">
            {app.position?.seviye} – {app.position?.birim}
          </p>
        </header>

        {/* -------- Bilgi kutusu -------- */}
        <section className="info-box">
          <div><span>Başvuru Tarihi</span>{new Date(app.createdAt).toLocaleString()}</div>
          <div><span>Sistem Durumu</span>{app.status}</div>
        </section>

        {/* -------- Belgeler -------- */}
        <section className="file-section">
          <h4>Yüklenen Belgeler</h4>
          <ul className="file-list">
            {app.files?.length
              ? app.files.map(f => (
                  <li key={f.storageName}>
                    <AiOutlineFilePdf/>
                    <a href={`http://localhost:5000/${f.path}`}
                       target="_blank" rel="noreferrer">
                      {f.originalName}
                    </a>
                  </li>
                ))
              : <li>Belge yok.</li>}
          </ul>
        </section>

        {/* -------- Değerlendirme -------- */}
        <section className="form-section">
          <h4>Değerlendirme</h4>

          <div className="radio-group">
            <label className={verdict === "accept" ? "selected" : ""}>
              <input type="radio" value="accept"
                     checked={verdict === "accept"}
                     onChange={e => setVerdict(e.target.value)} />
              Olumlu
            </label>

            <label className={verdict === "reject" ? "selected" : ""}>
              <input type="radio" value="reject"
                     checked={verdict === "reject"}
                     onChange={e => setVerdict(e.target.value)} />
              Olumsuz
            </label>
          </div>

          <label className="field">
            Açıklama / Not
            <textarea rows={4}
                      value={note}
                      onChange={e => setNote(e.target.value)} />
          </label>

          {/* ---------- PDF Yükle ---------- */}
          <div className="upload-field">
            <input ref={fileInputRef}
                   type="file"
                   accept="application/pdf"
                   onChange={e => setFile(e.target.files[0])} />
            <button type="button" onClick={() => fileInputRef.current?.click()}>
              <FiUpload/>
              {file ? file.name : "PDF Rapor Yükle"}
            </button>
          </div>

          <button className="submit-btn"
                  disabled={sending}
                  onClick={submit}>
            {sending ? "Gönderiliyor…" : "Kaydet"}
          </button>
        </section>
      </aside>
    </div>
  );
}