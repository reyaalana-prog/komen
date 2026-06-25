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

  // 🎯 TAHAP 1: AMANKAN DAFTAR DOMAIN BIAR LOLOS BUILD NEXT.JS
  const [daftarDomain, setDaftarDomain] = useState([
    { nama: 'Domain Utama ', url: 'https://vidco.site' },
    { nama: 'slicednive.site', url: 'https://slicednive.site' },
    { nama: 'videiy.biz.id', url: 'https://videiy.biz.id' },
    { nama: 'cdn2.videiy.biz.id', url: 'https://cdn2.videiy.biz.id' },
    { nama: 'Vercel / Pages Cadangan', url: 'https://2dbsclbarfire.pages.dev' } // Nilai sementara sebelum browser siap
  ]);

  useEffect(() => {
    // 🎯 TAHAP 2: SETELAH BROWSER SIAP, BARU ISI WINDOW.LOCATION.ORIGIN
    if (typeof window !== 'undefined') {
      const domainRealTime = [
        { nama: 'Domain Utama ', url: 'vidco.site' },
        { nama: 'slicednive.site', url: 'https://slicednive.site' },
        { nama: 'videiy.biz.id', url: 'https://videiy.biz.id' },
        { nama: 'cdn2.videiy.biz.id', url: 'https://cdn2.videiy.biz.id' },
        { nama: 'Vercel / Pages Cadangan', url: window.location.origin }
      ];
      setDaftarDomain(domainRealTime);
      setBaseUrl(domainRealTime[0].url); // Pasang default domain utama
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: data1 } = await supabase.from('videos1').select('*');
    const { data: data2 } = await supabase.from('videos2').select('*');
    
    // Gabungkan dengan key unik agar tidak tertukar ID-nya
    const v1 = (data1 || []).map(v => ({ ...v, origin: 'v1', uniqueKey: `v1-${v.videy_id}` }));
    const v2 = (data2 || []).map(v => ({ ...v, origin: 'v2', uniqueKey: `v2-${v.videy_id}` }));
    
    const combinedData = [...v2, ...v1]; // videos2 di atas secara default
    setVideos(combinedData);
  };

  useEffect(() => {
    let result = [...videos];

    // Filter Pencarian
    if (searchTerm) {
      result = result.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Logika Sorting
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

  // Fungsi Centang (Toggle)
  const toggleSelect = (videy_id) => {
    setSelectedIds((prev) => 
      prev.includes(videy_id) 
        ? prev.filter(id => id !== videy_id) 
        : [...prev, videy_id]
    );
  };

  // Fungsi Pilih Semua
  const selectAll = () => {
    if (selectedIds.length === filteredVideos.length) {
      setSelectedIds([]); // Batal pilih semua
    } else {
      setSelectedIds(filteredVideos.map(v => v.videy_id)); // Pilih semua yang muncul di filter
    }
  };

  // Generate Teks Link dengan Ekor .mp4 & Domain Pilihan
  const generateLinks = () => {
    const selectedVideos = videos.filter(v => selectedIds.includes(v.videy_id));
    const text = selectedVideos.map(v => {
      // Menggunakan baseUrl dinamis sesuai yang dipilih di dropdown select
      return includeTitle ? `${v.title}\n${baseUrl}/${v.videy_id}.mp4` : `${baseUrl}/${v.videy_id}.mp4`;
    }).join('\n\n');
    setResultText(text);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h2 style={{ color: '#f00', textAlign: 'center', marginBottom: '20px' }}>Bulk Share Link (v1 + v2)</h2>
      
      {/* Search, Sort, & Domain Panel */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #333' }}>
        
        {/* Dropdown Pilihan Domain Jembatan */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '5px', fontWeight: 'bold' }}>Pilih Domain Tujuan:</label>
          <select 
            value={baseUrl} 
            onChange={(e) => setBaseUrl(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#000', color: '#00ffff', border: '1px solid #444', fontWeight: 'bold', fontSize: '0.95rem' }}
          >
            {daftarDomain.map((dom, idx) => (
              <option key={idx} value={dom.url}>{dom.nama}</option>
            ))}
          </select>
        </div>

        <input 
          type="text" 
          placeholder="Cari video di semua database..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#000', color: '#fff', marginBottom: '15px', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: '#000', color: '#fff', border: '1px solid #444' }}>
            <option value="terbaru">Urutan Terbaru</option>
            <option value="id_besar">Angka ID Terbesar</option>
            <option value="id_kecil">Angka ID Terkecil</option>
            <option value="az">Nama A - Z</option>
            <option value="za">Nama Z - A</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#333', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={includeTitle} onChange={(e) => setIncludeTitle(e.target.checked)} />
            Sertakan Judul
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '0 5px' }}>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>{selectedIds.length} video dipilih</p>
        <button onClick={selectAll} style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {selectedIds.length === filteredVideos.length ? "Batal Pilih Semua" : "Pilih Semua Hasil Filter"}
        </button>
      </div>

      {/* Video List Wrapper */}
      <div style={{ maxHeight: '450px', overflowY: 'auto', border: '1px solid #333', borderRadius: '10px', backgroundColor: '#000', marginBottom: '20px' }}>
        {filteredVideos.map((vid) => {
          const isSelected = selectedIds.includes(vid.videy_id);
          return (
            <div 
              key={vid.uniqueKey} 
              onClick={() => toggleSelect(vid.videy_id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '14px', 
                borderBottom: '1px solid #222',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#330000' : 'transparent',
                transition: '0.2s',
                borderLeft: isSelected ? '5px solid #f00' : '5px solid transparent'
              }}
            >
              <input 
                type="checkbox" 
                checked={isSelected} 
                readOnly
                style={{ width: '18px', height: '18px', marginRight: '15px', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.95rem', color: isSelected ? '#fff' : '#ddd' }}>{vid.title}</span>
                <small style={{ color: '#555', fontSize: '0.75rem' }}>ID: #{vid.id} | Tabel: {vid.origin}</small>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={generateLinks} style={{ width: '100%', padding: '18px', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: '0.3s' }}>
        GENERATE LIST LINK
      </button>

      {resultText && (
        <div style={{ marginTop: '20px', animation: 'fadeIn 0.5s' }}>
          <textarea readOnly value={resultText} style={{ width: '100%', height: '180px', backgroundColor: '#000', color: '#0f0', padding: '15px', borderRadius: '10px', border: '1px solid #333', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          <button onClick={() => { navigator.clipboard.writeText(resultText); alert("Teks berhasil disalin ke clipboard!"); }} style={{ width: '100%', marginTop: '12px', padding: '15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            📋 SALIN SEMUA LINK
          </button>
        </div>
      )}
    </div>
  );
}
