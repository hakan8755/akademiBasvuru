// src/pages/AdminPanel.jsx
import { useEffect, useState, useMemo } from "react";
import { AiOutlinePlus, AiOutlineFileAdd, AiOutlineUser } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";               // <── yeni css

export default function AdminPanel() {
  const nav = useNavigate();
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  /* ---------------- Fetch ---------------- */
  useEffect(() => {
    fetch("http://localhost:5000/api/ilanlar")
      .then(r => r.json())
      .then(setIlanlar)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- Search ---------------- */
  const filtrenmis = useMemo(() => {
    const q = query.trim().toLowerCase();
    return !q
      ? ilanlar
      : ilanlar.filter(
          i =>
            i.birim.toLowerCase().includes(q) ||
            i.fakultesi.toLowerCase().includes(q) ||
            i.seviye.toLowerCase().includes(q)
        );
  }, [query, ilanlar]);

  /* ---------------- Markup ---------------- */
  return (
    <div className="admin-layout">
      {/* ── Sidebar ───────────────────────── */}
      <aside className="sidebar">
        <h2 className="sidebar__title">Admin Paneli</h2>
        <nav className="sidebar__nav">
          <SideBtn onClick={() => nav("/admin/panel")}>İlanlar</SideBtn>
          <SideBtn onClick={() => nav("/admin/applications")}>Başvurular</SideBtn>
          <SideBtn onClick={() => nav("/admin/users")}>Kullanıcılar</SideBtn>
        </nav>
      </aside>

      {/* ── Main area ──────────────────────── */}
      <main className="content">
        {/* header */}
        <div className="content__head">
          <h1 className="content__title">İlan Yönetimi</h1>

          <div className="head__actions">
            <div className="searchbox">
              <FiSearch className="searchbox__icon" />
              <input
                placeholder="Ara…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => nav("/admin/ilan-yeni")}
              className="btn btn--primary"
            >
              <AiOutlinePlus /> Yeni İlan
            </button>
          </div>
        </div>

        {/* stat cards */}
        <section className="stats">
          <StatCard
            icon={<AiOutlineFileAdd size={22} />}
            label="Toplam İlan"
            value={ilanlar.length}
          />
          <StatCard
            icon={<AiOutlineFileAdd size={22} />}
            label="Aktif İlan"
            value={ilanlar.filter(i => new Date(i.bitisTarihi) > Date.now()).length}
          />
          <StatCard
            icon={<AiOutlineUser size={22} />}
            label="Toplam Başvuru"
            value={42 /* TODO */}
          />
        </section>

        {/* table */}
        <div className="table__wrapper">
          <h2>İlan Listesi</h2>
          {loading ? (
            <SkeletonRows />
          ) : filtrenmis.length === 0 ? (
            <p className="muted">Gösterilecek ilan bulunamadı.</p>
          ) : (
            <IlanTable
              rows={filtrenmis}
              onDetail={id => nav(`/admin/announcement/${id}`)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------- küçük yardımcı bileşenler ---------- */
const SideBtn = ({ onClick, children }) => (
  <button onClick={onClick} className="sidebtn">
    {children}
  </button>
);

function StatCard({ icon, label, value }) {
  return (
    <div className="statcard">
      <div className="statcard__icon">{icon}</div>
      <div>
        <p className="statcard__label">{label}</p>
        <p className="statcard__value">{value}</p>
      </div>
    </div>
  );
}

function IlanTable({ rows, onDetail }) {
  const now = Date.now();
  return (
    <div className="table-scroll">
      <table className="table">
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Birimi</Th>
            <Th>Seviye</Th>
            <Th>Fakülte</Th>
            <Th>Başlangıç</Th>
            <Th>Bitiş</Th>
            <Th className="text-right">İşlem</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(i => (
            <tr key={i._id}>
              <Td>{i._id.slice(-6)}</Td>
              <Td>{i.birim}</Td>
              <Td>{i.seviye}</Td>
              <Td>{i.fakultesi}</Td>
              <Td>{new Date(i.baslangicTarihi).toLocaleDateString()}</Td>
              <Td>
                <span
                  className={
                    new Date(i.bitisTarihi) > now ? "badge badge--ok" : "badge badge--late"
                  }
                >
                  {new Date(i.bitisTarihi).toLocaleDateString()}
                </span>
              </Td>
              <Td className="text-right nowrap">
                <Action onClick={() => onDetail(i._id)}>Detay</Action>
                <Action onClick={() => alert("Düzenle TODO")}>Düzenle</Action>
                <Action danger onClick={() => alert("Sil TODO")}>
                  Sil
                </Action>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Th = ({ children }) => <th className="th">{children}</th>;
const Td = ({ children }) => <td className="td">{children}</td>;

const Action = ({ children, onClick, danger }) => (
  <button onClick={onClick} className={`action ${danger ? "action--danger" : ""}`}>
    {children}
  </button>
);

function SkeletonRows() {
  return (
    <div className="skeletons">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton" />
      ))}
    </div>
  );
}
