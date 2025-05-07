import { useEffect, useState } from "react";
import "./AdminPanel.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/users")
            .then(r => r.json())
            .then(setUsers)
            .catch(console.error);
    }, []);

    const filtered = users.filter(u =>
        [u.tc, u.ad, u.soyad, u.role].some(v =>
            v.toLowerCase().includes(query.toLowerCase())
        )
    );

    // TC gizleme fonksiyonu: örn. 1111111**** gibi
    const maskTC = (tc) => {
        if (!tc || tc.length !== 11) return tc;
        return tc.slice(0, 7) + "****";
    };

    return (
        <div className="content">
            <h1 className="content__title">Kullanıcılar</h1>

            <div className="head__actions">
                <input
                    className="searchbox"
                    placeholder="Ara (Ad, TC, Rol)"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>

            <div className="table__wrapper">
                <h2>Kullanıcı Listesi</h2>
                {filtered.length === 0 ? (
                    <p className="muted">Kullanıcı bulunamadı.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>T.C.</th>
                                <th>Ad</th>
                                <th>Soyad</th>
                                <th>Doğum Yılı</th>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u._id}>
                                    <td>{maskTC(u.tc)}</td>
                                    <td>{u.ad}</td>
                                    <td>{u.soyad}</td>
                                    <td>{u.dogumYili}</td>
                                    <td>
                                        <span className={`badge badge--${u.role}`}>{u.role}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
