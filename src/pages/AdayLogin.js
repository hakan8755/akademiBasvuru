import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';   // AuthContext'ten user & login

export default function LoginForm() {
    const [form, setForm] = useState({ tc: '', password: '' });
    const [show, setShow] = useState(false);
    const nav = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const r = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role: 'aday' }),
            });

            const data = await r.json();

            if (!r.ok || !data.user || !data.user._id) {
                return alert(data.message || 'Giriş başarısız');
            }

            // 🟢 Hem localStorage hem context için ID ve rol yazılıyor
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('userRole', data.user.role);

            login({
                _id: data.user._id,
                role: data.user.role,
                token: data.token
            });

            alert('Giriş başarılı!');

            const redirectPath = location.state?.from?.pathname || '/ilanlar';
            nav(redirectPath, { replace: true });

        } catch (err) {
            console.error('🛑 Sunucu hatası:', err);
            alert('Sunucu hatası');
        }
    };

    return (
        <div className="login-wrapper">
            <form className="login-card" onSubmit={handleSubmit}>
                <h2 className="login-title">Aday Girişi</h2>

                <input
                    name="tc"
                    placeholder="T.C. Kimlik"
                    value={form.tc}
                    onChange={handleChange}
                    maxLength={11}
                    required
                />

                <div className="password-wrapper">
                    <input
                        name="password"
                        type={show ? 'text' : 'password'}
                        placeholder="Şifre"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <span onClick={() => setShow(!show)} className="eye-toggle">
                        {show ? '🙈' : '👁️'}
                    </span>
                </div>

                <button type="submit" className="login-btn">Giriş Yap</button>

                <div className="login-links">
                    <button type="button" className="link" disabled>Şifremi Unuttum</button>
                    <button type="button" className="link" onClick={() => nav('/aday/register')}>
                        Kayıt Ol
                    </button>
                </div>
            </form>
        </div>
    );
}
