import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function BulkShare() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [resultText, setResultText] = useState('');
  const [includeTitle, setIncludeTitle] = useState(true);
  
  const [sortBy, setSortBy] = useState('terbaru');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: data1 } = await supabase.from('videos1').select('*');
    const { data: data2 } = await supabase.from('videos2').select('*');
    // Tambahkan label asal tabel biar key bener-bener unik
    const v1 = (data1 || []).map(v => ({ ...v, origin: 'v1' }));
    const v2 = (data2 || []).map(v => ({ ...v, origin: 'v2' }));
    const combinedData = [...v2, ...v1];
    setVideos(combinedData);
    setFilteredVideos(combinedData);
  };

  useEffect(() => {
    let result = [...videos];
    if (searchTerm) {
      result = result.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (sortBy === 'terbaru') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'id_besar') {
      result.sort((a, b) => b.id - a.id); 
    } else if (sortBy === 'id_kecil') {
      result.sort((a, b) => a.id - b.id); 
    } else if (sortBy === 'az') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'za') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }
    setFilteredVideos(result);
  }, [sortBy, searchTerm, videos]);

  // FUNGSI TOGGLE YANG DIPERBAIKI
  const toggleSelect = (videy_id) => {
    setSelectedIds((prev) => {
      if (prev.includes(videy_id)) {
        return prev.filter(id => id !== videy_id);
      } else {
        return [...prev, videy_id];
      }
    });
  };

  const selectAll = () => {
    if (selectedIds.length === filteredVideos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVideos.map(v => v.videy_id));
    }
  };

  const generateLinks = () => {
    const selectedVideos = videos.filter(v => selectedIds.includes(v.videy_id));
    const text = selectedVideos.map(v => {
      return includeTitle ? `${v.title}\n${baseUrl}/${v.videy_id}` : `${baseUrl}/${v.videy_id}`;
    }).join('\n\n');
    setResultText(text);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h2 style={{ color: '#f00', textAlign: 'center' }}>Bulk Share Link (Fixed Checkbox)</h2>
      
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #333' }}>
        <input 
          type="text" 
          placeholder="Cari video..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#000', color: '#fff', marginBottom: '15px' }}
        />
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', backgroundColor: '#000', color: '#fff' }}>
            <option value="terbaru">Terbaru</option>
            <option value="id_besar">ID Besar</option>
            <option value="id_kecil">ID Kecil</option>
            <option value="az">A - Z</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#333', padding: '10px', borderRadius: '6px' }}>
            <input type="checkbox" checked={includeTitle} onChange={(e) => setIncludeTitle(e.target.checked)} />
            Sertakan Judul
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <p>{selectedIds.length} video dipilih</p>
        <button onClick={selectAll} style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}>Pilih Semua</button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#000', marginBottom: '20px' }}>
        {filteredVideos.map((vid) => {
          const isSelected = selectedIds.includes(vid.videy_id);
          return (
            <div 
              key={`${vid.origin}-${vid.videy_id}`} 
              onClick={() => toggleSelect(vid.videy_id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px', 
                borderBottom: '1px solid #222',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#330000' : 'transparent', // Kasih warna merah gelap kalau terpilih
                borderLeft: isSelected ? '4px solid #f00' : '4px solid transparent'
              }}
            >
              <input 
                type="checkbox" 
                checked={isSelected} 
                readOnly // Biar tidak bentrok dengan onClick div
                style={{ width: '20px', height: '20px', marginRight: '15px' }}
              />
              <span style={{ fontSize: '0.9rem', color: isSelected ? '#fff' : '#ccc' }}>
                <small style={{ color: '#555' }}>#{vid.id}</small> {vid.title}
              </span>
            </div>
          );
        })}
      </div>

      <button onClick={generateLinks} style={{ width: '100%', padding: '15px', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
        GENERATE LIST LINK
      </button>

      {resultText && (
        <div style={{ marginTop: '20px' }}>
          <textarea readOnly value={resultText} style={{ width: '100%', height: '150px', backgroundColor: '#000', color: '#0f0', padding: '10px', borderRadius: '8px' }} />
          <button onClick={() => { navigator.clipboard.writeText(resultText); alert("Disalin!"); }} style={{ width: '100%', marginTop: '10px', padding: '15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px' }}>
            SALIN SEMUA LINK
          </button>
        </div>
      )}
    </div>
  );
}
