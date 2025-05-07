import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

export default function YoneticiLogin() {
    const [form, setForm] = useState({ tc: '', password: '' });
    const [show, setShow] = useState(false);
    const nav = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const r = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role: 'yonetici' }),
            });

            const data = await r.json();
            if (!r.ok) return alert(data.message);

            login({ ...data.user, token: data.token });

            alert('Giriş başarılı!');

            if (data.user.role === 'yonetici') {
                nav('/yonetici/panel', { replace: true });
            } else {
                nav('/', { replace: true });
            }

        } catch (err) {
            alert('Sunucu hatası');
        }
    };


    return (
        <div className="login-wrapper">
            <form className="login-card" onSubmit={handleSubmit}>
                <h2 className="login-title">Yönetici Girişi</h2>

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
            </form>
        </div>
    );
}
