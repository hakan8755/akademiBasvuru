import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../App";               // mevcut AuthContext

export default function JuriLogin() {
  const [form, setForm] = useState({ tc: "", password: "" });
  const [show, setShow] = useState(false);
  const nav  = useNavigate();
  const loc  = useLocation();
  const { login } = useAuth();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      const r = await fetch("http://localhost:5000/api/login", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ ...form, role: "juri" })
      });
      const data = await r.json();
      if (!r.ok) return alert(data.message);

      login({ role: "juri", token: data.token });
      alert("Giriş başarılı!");

      // geldiyse önceki sayfaya veya juri paneline
      const back = loc.state?.from?.pathname || "/juri/panel";
      nav(back, { replace: true });
    } catch (err) {
      alert("Sunucu hatası");
      console.error(err);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={submit}>
        <h2 className="login-title">Jüri Girişi</h2>

        <input
          name="tc" maxLength={11} required
          placeholder="T.C. Kimlik"
          value={form.tc} onChange={handle}
        />

        <div className="password-wrapper">
          <input
            name="password" required
            type={show ? "text" : "password"}
            placeholder="Şifre"
            value={form.password} onChange={handle}
          />
          <span className="eye-toggle" onClick={() => setShow(!show)}>
            {show ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" className="login-btn">Giriş Yap</button>
      </form>
    </div>
  );
}
