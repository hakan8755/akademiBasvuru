// src/pages/JuriPanel.jsx
import { useEffect, useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { AiOutlineFileText } from "react-icons/ai";
import { useAuth } from "../App";
import JuriDrawer from "../components/JuriDrawer";
import "./JuriPanel.css";

export default function JuriPanel() {
  const { user } = useAuth();
  const [list, setList]   = useState([]);
  const [loading, setL]   = useState(true);
  const [q, setQ]         = useState("");
  const [open, setOpen]   = useState(null);   // seçili başvuru

  /* ───────────────── fetch ───────────────── */
  useEffect(() => {
    const getData = async () => {
      setL(true);
      try {
        const r = await fetch("http://localhost:5000/api/juri/assignments", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.message);
        setList(data);
      } catch (e) { alert(e.message || "Veri çekilemedi"); }
      finally { setL(false); }
    };
    getData();
  }, [user.token]);

  /* ───────────────── filtre ───────────────── */
  const filt = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(x =>
      x.candidate.fullName.toLowerCase().includes(s) ||
      x.position.birim.toLowerCase().includes(s));
  }, [q, list]);

  /* ───────────────── markup ───────────────── */
  return (
    <div className="juri-page">
      <header className="juri-head">
        <h1>Jüri Paneli</h1>
        <div className="searchbox">
          <FiSearch className="icon"/>
          <input placeholder="Ara…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
      </header>

      {loading ? <Skeleton/> :
        filt.length === 0 ? <p className="muted" style={{padding:24}}>Gösterilecek başvuru yok.</p> :
        <table className="table">
          <thead>
            <tr><th>Aday</th><th>Birim</th><th>Seviye</th><th>Durumum</th><th></th></tr>
          </thead>
          <tbody>
            {filt.map(app=>(
              <tr key={app._id}>
                <td>{app.candidate.fullName}</td>
                <td>{app.position.birim}</td>
                <td>{app.position.seviye}</td>
                <td>{app.myVerdict ?? "Beklemede"}</td>
                <td className="action">
                  <button onClick={()=>setOpen(app)}><AiOutlineFileText/> İncele</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }

      {open && <JuriDrawer app={open} onClose={()=>setOpen(null)} onSubmitted={()=>{
        // güncelleme için tekrar fetch yerine listedeki öğeyi güncelle
        setList(l=>l.map(x=>x._id===open._id?{...x,myVerdict:"Gönderildi"}:x));
      }}/>}
    </div>
  );
}

/* basit “skeleton” */
function Skeleton() {
  return <div style={{padding:24}}>
    {Array.from({length:4}).map((_,i)=>(
      <div key={i} className="skeleton-row"/>
    ))}
  </div>;
}
