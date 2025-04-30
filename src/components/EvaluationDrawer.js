// src/components/EvaluationDrawer.js
export default function EvaluationDrawer({ app, onClose }) {
    const [score, setScore] = useState('');
    const [comment, setComment] = useState('');
    const submit = async () => {
      const r = await fetch(`http://localhost:5000/api/juri/evaluate/${app._id}`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ score, comment })
      });
      if (r.ok) onClose(true);
      else alert('Kaydetme hatası');
    };
    /* — başvuru PDF’ine link, bölümlere puan vs. — */
  }
  