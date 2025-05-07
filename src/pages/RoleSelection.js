import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const nav = useNavigate();

  const RoleButton = ({ label, path }) => (
    <button className="role-btn" onClick={() => nav(path)}>
      {label}
    </button>
  );

  return (
    <div className="page-wrapper">
      <header className="header-bar">
        <img src="/logo.png" alt="KOU Logo" className="kou-logo" />
        <h1>Kocaeli Üniversitesi </h1>
      </header>

      <main className="content">
        <h2>Akademik Personel Başvuru Sistemi</h2>
        <p className="subtext">Giriş yapmak istediğiniz bölümü seçiniz</p>

        <div className="role-grid">
          <RoleButton label="Aday Giriş" path="/aday/login" />
          <RoleButton label="Jüri Giriş" path="/juri/login" />
          <RoleButton label="Yönetici Giriş" path="/yonetici/login" />
          <RoleButton label="Admin Giriş" path="/admin/login" />
        </div>

        <button className="register-link" onClick={() => nav('/aday/register')}>
          Hesabınız yok mu? Kayıt Ol
        </button>
      </main>
    </div>
  );
}
