import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [form, setForm] = useState({
    tc: '',
    ad: '',
    soyad: '',
    dogumYili: '',
    password: '',
    conf: ''
  });
  const nav = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.conf) return alert('Şifreler uyuşmuyor');

    try {
      const r = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tc: form.tc,
          ad: form.ad,
          soyad: form.soyad,
          dogumYili: form.dogumYili,
          password: form.password,
        })
      });
      const d = await r.json();
      if (!r.ok) return alert(d.message);
      alert('Kayıt başarılı!');
      nav('/aday/login');
    } catch (err) {
      alert('Sunucu hatası');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Aday Kaydı</h2>

        <input name="tc" placeholder="T.C. Kimlik" value={form.tc} onChange={handleChange} maxLength={11} required />
        <input name="ad" placeholder="Ad" value={form.ad} onChange={handleChange} required />
        <input name="soyad" placeholder="Soyad" value={form.soyad} onChange={handleChange} required />
        <input name="dogumYili" placeholder="Doğum Yılı" value={form.dogumYili} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Şifre" value={form.password} onChange={handleChange} required />
        <input name="conf" type="password" placeholder="Şifre Tekrar" value={form.conf} onChange={handleChange} required />

        <button type="submit" className="login-btn">Kaydol</button>
      </form>
    </div>
  );
}
