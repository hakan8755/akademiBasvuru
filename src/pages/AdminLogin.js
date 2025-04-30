// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

export default function AdminLogin() {
  const [form, setForm] = useState({ tc: '', password: '' });
  const [show, setShow] = useState(false);
  const nav  = useNavigate();
  const loc  = useLocation();
  const { login } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const r = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'admin' })   // 🔴 sadece burası farklı
      });
      const data = await r.json();
      if (!r.ok) return alert(data.message);

      login({ role: 'admin', token: data.token });
      alert('Admin girişi başarılı!');

      const redirect = loc.state?.from?.pathname || '/admin/panel';
      nav(redirect, { replace: true });
    } catch (err) {
      alert('Sunucu hatası');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Admin Girişi</h2>

        <input
          name="tc" maxLength={11} required
          placeholder="T.C. Kimlik"
          value={form.tc} onChange={handleChange}
        />

        <div className="password-wrapper">
          <input
            name="password" required
            type={show ? 'text' : 'password'}
            placeholder="Şifre"
            value={form.password} onChange={handleChange}
          />
          <span className="eye-toggle" onClick={() => setShow(!show)}>
            {show ? '🙈' : '👁️'}
          </span>
        </div>

        <button className="login-btn" type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}
