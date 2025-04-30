import React, { useState } from "react";

export default function BasvuruKontrolFormu() {
  const [form, setForm] = useState({
    seviye: "Dr. Öğr. Üyesi",
    temelAlan: "Sağlık Bilimleri, Fen Bilimleri ve Matematik, Mühendislik, Ziraat, Orman ve Su Ürünleri",
    a1a2: 0,
    a1a4: 0,
    a1a5: 0,
    a1a6: 0,
    a1a8: 0,
    baslicaYazar: 0,
    toplamMakale: 0,
    etkinlik: 0,
    proje: 0,
    toplamPuan: 0,
    kisiSayisi: 1,
    derleme: false,
    isbirligi: false,
    ilkYazar: false,
    esYazar: false
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const kKatsayisi = (kisiSayisi) => {
    const n = Number(kisiSayisi);
    if (n === 1) return 1;
    if (n === 2) return 0.8;
    if (n === 3) return 0.6;
    if (n === 4) return 0.5;
    if (n >= 10) return 0.1;
    return 1 / n;
  };

  const kontrolEt = () => {
    const {
      seviye,
      temelAlan,
      a1a2,
      a1a4,
      a1a5,
      a1a6,
      a1a8,
      baslicaYazar,
      toplamMakale,
      etkinlik,
      proje,
      toplamPuan,
      kisiSayisi,
      derleme,
      isbirligi,
      ilkYazar,
      esYazar
    } = form;

    let sonuc = [];
    let katsayi = kKatsayisi(kisiSayisi);
    let puan = Number(toplamPuan);

    if (derleme) puan *= 1.2;
    if (isbirligi) puan *= 1.3;
    if (ilkYazar || esYazar) puan *= 1.4;

    // Hepsini normalize et
    const alan = temelAlan;
    const s = seviye;

    const int = (v) => Number(v) || 0;

    // -------------------------
    // Kombinasyon kontrolleri:
    // -------------------------

    if (alan.includes("Sağlık")) {
      if (s === "Dr. Öğr. Üyesi") {
        if (int(a1a2) < 1) sonuc.push("A.1-A.2: en az 1 makale gerekli");
        if (int(a1a4) < 2) sonuc.push("A.1-A.4: en az 2 makale gerekli");
        if (int(a1a5) < 1) sonuc.push("A.1-A.5: en az 1 makale gerekli");
        if (int(toplamMakale) < 4) sonuc.push("Toplam 4 makale gerekli");
        if (int(baslicaYazar) < 1) sonuc.push("En az 1 başlıca yazar olunmalı");
        if (puan * katsayi < 100) sonuc.push("Asgari toplam puan: 100");
      } else if (s === "Doçent") {
        if (int(a1a2) < 3) sonuc.push("A.1-A.2: en az 3 makale gerekli");
        if (int(a1a4) < 4) sonuc.push("A.1-A.4: en az 4 makale gerekli");
        if (int(toplamMakale) < 7) sonuc.push("Toplam 7 makale gerekli");
        if (int(baslicaYazar) < 2) sonuc.push("En az 2 başlıca yazar olunmalı");
        if (puan * katsayi < 150) sonuc.push("Asgari toplam puan: 150");
      } else if (s === "Profesör") {
        if (int(a1a2) < 3) sonuc.push("A.1-A.2: en az 3 makale gerekli");
        if (int(a1a4) < 4) sonuc.push("A.1-A.4: en az 4 makale gerekli");
        if (int(toplamMakale) < 7) sonuc.push("Toplam 7 makale gerekli");
        if (int(baslicaYazar) < 3) sonuc.push("En az 3 başlıca yazar olunmalı");
        if (puan * katsayi < 200) sonuc.push("Asgari toplam puan: 200");
      }
    } else if (alan.includes("Eğitim")) {
      if (s === "Dr. Öğr. Üyesi") {
        if (int(a1a4) < 1) sonuc.push("A.1-A.4: en az 1 makale gerekli");
        if (int(a1a6) < 3) sonuc.push("A.1-A.6: en az 3 makale gerekli");
        if (int(toplamMakale) < 4) sonuc.push("Toplam 4 makale gerekli");
        if (int(baslicaYazar) < 1) sonuc.push("En az 1 başlıca yazar olunmalı");
        if (puan * katsayi < 100) sonuc.push("Asgari toplam puan: 100");
      } else if (s === "Doçent") {
        if (int(a1a4) < 2) sonuc.push("A.1-A.4: en az 2 makale gerekli");
        if (int(a1a6) < 4) sonuc.push("A.1-A.6: en az 4 makale gerekli");
        if (int(toplamMakale) < 6) sonuc.push("Toplam 6 makale gerekli");
        if (int(baslicaYazar) < 2) sonuc.push("En az 2 başlıca yazar olunmalı");
        if (puan * katsayi < 150) sonuc.push("Asgari toplam puan: 150");
      } else if (s === "Profesör") {
        if (int(a1a4) < 2) sonuc.push("A.1-A.4: en az 2 makale gerekli");
        if (int(a1a6) < 4) sonuc.push("A.1-A.6: en az 4 makale gerekli");
        if (int(toplamMakale) < 6) sonuc.push("Toplam 6 makale gerekli");
        if (int(baslicaYazar) < 3) sonuc.push("En az 3 başlıca yazar olunmalı");
        if (puan * katsayi < 200) sonuc.push("Asgari toplam puan: 200");
      }
    } else if (alan.includes("Hukuk") || alan.includes("İlahiyat")) {
      if (int(toplamMakale) < 4 && s === "Dr. Öğr. Üyesi") sonuc.push("Toplam 4 makale gerekli");
      if (int(toplamMakale) < 6 && s !== "Dr. Öğr. Üyesi") sonuc.push("Toplam 6 makale gerekli");
      if (int(baslicaYazar) < (s === "Profesör" ? 3 : 2)) sonuc.push(`En az ${s === "Profesör" ? 3 : 2} başlıca yazar olunmalı`);
      if (puan * katsayi < (s === "Profesör" ? 200 : s === "Doçent" ? 150 : 100)) sonuc.push(`Asgari toplam puan: ${s === "Profesör" ? 200 : s === "Doçent" ? 150 : 100}`);
    } else if (alan.includes("Güzel Sanatlar")) {
      if (s === "Dr. Öğr. Üyesi") {
        if (int(etkinlik) < 10) sonuc.push("En az 2 kişisel, 8 karma etkinlik gerekli");
        if (int(a1a8) < 1) sonuc.push("A.1-A.8 kapsamında 1 makale gerekli");
        if (int(baslicaYazar) < 1) sonuc.push("En az 1 başlıca yazar olunmalı");
        if (puan * katsayi < 100) sonuc.push("Asgari toplam puan: 100");
      } else if (s === "Doçent") {
        if (int(etkinlik) < 15) sonuc.push("En az 3 kişisel, 12 karma etkinlik gerekli");
        if (int(a1a6) < 1) sonuc.push("A.1-A.6 kapsamında 1 makale gerekli");
        if (int(a1a8) < 2) sonuc.push("A.1-A.8 kapsamında 2 makale gerekli");
        if (int(baslicaYazar) < 2) sonuc.push("En az 2 başlıca yazar olunmalı");
        if (puan * katsayi < 150) sonuc.push("Asgari toplam puan: 150");
      } else if (s === "Profesör") {
        if (int(etkinlik) < 25) sonuc.push("En az 5 kişisel, 20 karma etkinlik gerekli");
        if (int(a1a6) < 1) sonuc.push("A.1-A.6 kapsamında 1 makale gerekli");
        if (int(a1a8) < 2) sonuc.push("A.1-A.8 kapsamında 2 makale gerekli");
        if (int(baslicaYazar) < 3) sonuc.push("En az 3 başlıca yazar olunmalı");
        if (puan * katsayi < 200) sonuc.push("Asgari toplam puan: 200");
      }
    }

    alert(sonuc.length === 0 ? "✅ Tebrikler! Şartları sağlıyorsunuz." : "❌ Eksikler:\n" + sonuc.join("\n"));
  };

  return (
    <div className="basvuru-form">
      <h2>Akademik Başvuru Koşulları Kontrolü</h2>

      <label>Seviye</label>
      <select name="seviye" value={form.seviye} onChange={onChange}>
        <option>Dr. Öğr. Üyesi</option>
        <option>Doçent</option>
        <option>Profesör</option>
      </select>

      <label>Temel Alan</label>
      <select name="temelAlan" value={form.temelAlan} onChange={onChange}>
        <option>Sağlık Bilimleri, Fen Bilimleri ve Matematik, Mühendislik, Ziraat, Orman ve Su Ürünleri</option>
        <option>Eğitim Bilimleri, Filoloji, Mimarlık, Planlama ve Tasarım, Sosyal, Beşeri ve İdari Bilimler ile Spor Bilimleri</option>
        <option>Hukuk, İlahiyat</option>
        <option>Güzel Sanatlar (Konservatuvar dahil)</option>
      </select>

      <label>A.1-A.2 Makale Sayısı</label>
      <input name="a1a2" type="number" value={form.a1a2} onChange={onChange} />

      <label>A.1-A.4 Makale Sayısı</label>
      <input name="a1a4" type="number" value={form.a1a4} onChange={onChange} />

      <label>A.1-A.5 Makale Sayısı</label>
      <input name="a1a5" type="number" value={form.a1a5} onChange={onChange} />

      <label>A.1-A.6 Makale Sayısı</label>
      <input name="a1a6" type="number" value={form.a1a6} onChange={onChange} />

      <label>A.1-A.8 Makale Sayısı</label>
      <input name="a1a8" type="number" value={form.a1a8} onChange={onChange} />

      <label>Başlıca Yazar Olduğu Makale Sayısı</label>
      <input name="baslicaYazar" type="number" value={form.baslicaYazar} onChange={onChange} />

      <label>Toplam Makale</label>
      <input name="toplamMakale" type="number" value={form.toplamMakale} onChange={onChange} />

      <label>Kişisel/Karma Etkinlik Sayısı</label>
      <input name="etkinlik" type="number" value={form.etkinlik} onChange={onChange} />

      <label>Proje Sayısı (F.1, H.1 vb)</label>
      <input name="proje" type="number" value={form.proje} onChange={onChange} />

      <label>Toplam Puan</label>
      <input name="toplamPuan" type="number" value={form.toplamPuan} onChange={onChange} />

      <label>Yazar Sayısı</label>
      <input name="kisiSayisi" type="number" value={form.kisiSayisi} onChange={onChange} />

      <label>
        <input type="checkbox" name="derleme" checked={form.derleme} onChange={onChange} /> Derleme Makale
      </label>

      <label>
        <input type="checkbox" name="isbirligi" checked={form.isbirligi} onChange={onChange} /> Kurumlar Arası İşbirliği
      </label>

      <label>
        <input type="checkbox" name="ilkYazar" checked={form.ilkYazar} onChange={onChange} /> İlk Yazar veya Sorumlu Yazar
      </label>

      <label>
        <input type="checkbox" name="esYazar" checked={form.esYazar} onChange={onChange} /> Eşit İlk Yazar / Sorumlu Yazar
      </label>

      <button onClick={kontrolEt}>Koşulları Kontrol Et</button>
    </div>
  );
}
