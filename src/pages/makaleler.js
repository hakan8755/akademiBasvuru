// ArticleApplicationForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/makaleler.css';

function ArticleApplicationForm() {
  const navigate = useNavigate();

  const articleTypes = [
    { id: 1, name: 'SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q1)', requiresAuthorInfo: true },
    { id: 2, name: 'SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q2)', requiresAuthorInfo: true },
    { id: 3, name: 'SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q3)', requiresAuthorInfo: true },
    { id: 4, name: 'SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q4)', requiresAuthorInfo: true },
    { id: 5, name: 'ESCI tarafından taranan dergilerde yayımlanmış makale', requiresAuthorInfo: false },
    { id: 6, name: 'Scopus tarafından taranan dergilerde yayımlanmış makale', requiresAuthorInfo: false },
    { id: 7, name: 'Uluslararası diğer indekslerde taranan dergilearde yayımlanmış makale', requiresAuthorInfo: false },
    { id: 8, name: 'ULAKBİM TR Dizin tarafından taranan ulusal hakemli dergilerde yayımlanmış makale', requiresAuthorInfo: false },
    { id: 9, name: '8. madde dışındaki ulusal hakemli dergilerde yayımlanmış makale', requiresAuthorInfo: false }
  ];

  const puanlar = { 1: 60, 2: 55, 3: 40, 4: 30, 5: 25, 6: 20, 7: 15, 8: 10, 9: 8 };

  const [articles, setArticles] = useState(
    articleTypes.map(type => ({
      id: type.id,
      name: type.name,
      files: [],
      isMainAuthor: false,
      isResponsibleAuthor: false,
      isEqualContribution: false,
      hasExternalAuthor: false,
      isReview: false,
      authorCount: 1,
      skipped: false,
      articleDetails: {
        authors: '',
        articleTitle: '',
        journalName: '',
        volume: '',
        pages: '',
        year: ''
      }
    }))
  );

  const calculateScore = (maxId) => {
    return articles
      .filter(article => !article.skipped && article.id <= maxId)
      .reduce((total, article) => {
        const base = puanlar[article.id] || 0;
        let k = 1;
        let f = 1;
        const count = article.authorCount || 1;

        // 1) 2 yazarlı ve sadece AD ve LÖ varsa
        if (count === 2) {
          k = 1;
        }
        // 2) 3 yazarlı, sadece AD, ED ve LÖ varsa
        else if (count === 3 && article.isMainAuthor) {
          k = 1;
        }
        // 3) 3 yazarlı ve sadece LÖ1, LÖ2 ve AD varsa
        else if (count === 3 && !article.isMainAuthor) {
          k = 0.6;
        }
        // 4) 4 yazarlı ve kurum dışı yazar varsa
        else if (count === 4) {
          k = 0.5;
          if (article.hasExternalAuthor) f *= 1.3;
        }
        // 5) Derleme makale ise
        if (article.isReview) {
          f *= 1.2;
          if (count === 4) k = 0.5;
        }
        // 6) 5+ yazar, başlıca veya sorumlu yazar
        if (count >= 5) {
          k = 0.2;
          if (article.isMainAuthor || article.isResponsibleAuthor) {
            f *= 1.8;
          }
        }
        // 7) 5+ yazar, eşit katkı
        if (count >= 5 && article.isEqualContribution) {
          f *= 1.4;
        }

        const puan = Math.round(base * k * f);
        return total + puan;
      }, 0);
  };

  const toplamPuan1_4 = calculateScore(4);
  const toplamPuan1_5 = calculateScore(5);
  const toplamPuan1_6 = calculateScore(6);
  const toplamPuan1_8 = calculateScore(8);
  const toplamPuanGenel = calculateScore(9);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasIncomplete = articles.some(article => {
      if (article.skipped) return false;
      const d = article.articleDetails;
      return !d.authors || !d.articleTitle || !d.journalName || !d.volume || !d.pages || !d.year;
    });

    if (hasIncomplete) return alert('Zorunlu alanları doldurun veya "Yapmadım" seçeneğini kullanın.');

    try {
      const formData = new FormData();
      const userId = localStorage.getItem('userId') || 'anonim';

      formData.append('articles', JSON.stringify(articles.map(a =>
        a.skipped ? { articleTypeId: a.id, articleTypeName: a.name, skipped: true }
          : {
              articleTypeId: a.id,
              articleTypeName: a.name,
              skipped: false,
              isMainAuthor: a.isMainAuthor,
              isResponsibleAuthor: a.isResponsibleAuthor,
              isEqualContribution: a.isEqualContribution,
              hasExternalAuthor: a.hasExternalAuthor,
              isReview: a.isReview,
              authorCount: a.authorCount,
              articleDetails: a.articleDetails
            }
      )));

      formData.append('toplamPuan1_4', toplamPuan1_4);
      formData.append('toplamPuan1_5', toplamPuan1_5);
      formData.append('toplamPuan1_6', toplamPuan1_6);
      formData.append('toplamPuan1_8', toplamPuan1_8);
      formData.append('toplamPuan', toplamPuanGenel);
      formData.append('userId', userId);

      articles.forEach(a => a.files.forEach(file => formData.append('files', file)));

      const r = await axios.post('http://localhost:5000/api/articleApplication/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (r.status === 200) {
        alert('Makale başvurusu başarıyla gönderildi.');
        navigate('/BilimselToplantiFaaliyetleri');
      } else {
        alert('Sunucu hatası.');
      }

    } catch (err) {
      console.error('Gönderim hatası:', err);
      alert('Sunucuya bağlanırken hata oluştu.');
    }
  };

  return (
    <div className="application-form">
      <h1>Başvuru Sayfası</h1>
      <form onSubmit={handleSubmit} noValidate>
        {articles.map(article => (
          <div key={article.id} className={`article-section ${article.skipped ? 'skipped' : ''}`}>
            <h3>{article.id}) {article.name}</h3>
            {!article.skipped && (
              <>
                {['authors', 'articleTitle', 'journalName', 'volume', 'pages', 'year'].map(field => (
                  <div className="form-row" key={field}>
                    <label>
                      {field === 'authors' && 'Yazarlar:'}
                      {field === 'articleTitle' && 'Makale Adı:'}
                      {field === 'journalName' && 'Dergi Adı:'}
                      {field === 'volume' && 'Cilt No:'}
                      {field === 'pages' && 'Sayfa:'}
                      {field === 'year' && 'Yıl:'}
                      <input
                        type={field === 'year' ? 'number' : 'text'}
                        name={field}
                        value={article.articleDetails[field]}
                        onChange={(e) => setArticles(prev => prev.map(a =>
                          a.id === article.id ? {
                            ...a,
                            articleDetails: { ...a.articleDetails, [field]: e.target.value }
                          } : a))}
                      />
                    </label>
                  </div>
                ))}

                <div className="form-row checkbox-row">
                  <label>
                    <input type="checkbox" checked={article.isMainAuthor} onChange={e => setArticles(prev => prev.map(a => a.id === article.id ? { ...a, isMainAuthor: e.target.checked } : a))} /> Başlıca Yazar
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Yazar Sayısı:
                    <input type="number" min="1" value={article.authorCount} onChange={e => setArticles(prev => prev.map(a => a.id === article.id ? { ...a, authorCount: parseInt(e.target.value) } : a))} />
                  </label>
                </div>
                <div className="form-row checkbox-row">
                  <label>
                    <input type="checkbox" checked={article.isResponsibleAuthor} onChange={e => setArticles(prev => prev.map(a => a.id === article.id ? { ...a, isResponsibleAuthor: e.target.checked } : a))} /> Sorumlu Yazar
                  </label>
                </div>
                <div className="form-row checkbox-row">
                  <label>
                    <input type="checkbox" checked={article.isEqualContribution} onChange={e => setArticles(prev => prev.map(a => a.id === article.id ? { ...a, isEqualContribution: e.target.checked } : a))} /> Eşit Katkı
                  </label>
                </div>
                <div className="form-row checkbox-row">
                  <label>
                    <input type="checkbox" checked={article.hasExternalAuthor} onChange={e => setArticles(prev => prev.map(a => a.id === article.id ? { ...a, hasExternalAuthor: e.target.checked } : a))} /> Kurum Dışı Yazar Var
                  </label>
                </div>
                <div className="form-row checkbox-row">
                  <label>
                    <input type="checkbox" checked={article.isReview} onChange={e => setArticles(prev => prev.map(a => a.id === article.id ? { ...a, isReview: e.target.checked } : a))} /> Derleme Makale
                  </label>
                </div>
                <div className="form-row">
                  <input type="file" multiple onChange={e => {
                    const files = Array.from(e.target.files);
                    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, files: [...a.files, ...files] } : a));
                  }} />
                </div>
              </>
            )}
            <button type="button" onClick={() => setArticles(prev => prev.map(a => a.id === article.id ? { ...a, skipped: !a.skipped } : a))}>
              {article.skipped ? '✔️ Geri Al' : '❌ Yapmadım'}
            </button>
          </div>
        ))}

        <div className="puan-ozeti">
          <h3>📊 Puan Özeti</h3>
          <ul>
            <li>1–4 Arası Toplam: {toplamPuan1_4} puan</li>
            <li>1–5 Arası Toplam: {toplamPuan1_5} puan</li>
            <li>1–6 Arası Toplam: {toplamPuan1_6} puan</li>
            <li>1–8 Arası Toplam: {toplamPuan1_8} puan</li>
            <li>Genel Toplam (1–9): {toplamPuanGenel} puan</li>
          </ul>
        </div>

        <button type="submit">Sonraki Sayfa</button>
      </form>
    </div>
  );
}

export default ArticleApplicationForm;