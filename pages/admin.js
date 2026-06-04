import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [bulkData, setBulkData] = useState('');
  const [loading, setLoading] = useState(false);

  const simpanBanyak = async () => {
    if (!bulkData.trim()) return alert("Masukkan data dulu!");
    setLoading(true);
    const rows = bulkData.split('\n');
    const dataToInsert = [];
    
    for (let row of rows) {
      if (!row.includes('|')) continue;
      const [judul, url] = row.split('|').map(item => item.trim());
      let videoId = "";
      
      // 🎯 PERBAIKAN UTAMA: Deteksi ID Video Universal (Mendukung Videy, Slicedrive, dll)
      if (url.includes("?id=")) {
        videoId = new URL(url).searchParams.get("id");
      } else {
        // Mengambil teks paling belakang setelah tanda '/' terakhir, lalu menghapus .mp4 atau .MP4
        videoId = url.split('/').pop().split('?')[0].replace(/\.(mp4|map4)$/i, '');
      }
      
      if (videoId) {
        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        dataToInsert.push({ 
          title: judul, 
          videy_id: videoId, 
          slug: slug,
          kategori: 'umum'
        });
      }
    }

    if (dataToInsert.length === 0) {
      setLoading(false);
      return alert("Tidak ada data video valid yang bisa diproses! Cek format inputnya.");
    }

    const { error } = await supabase.from('videos2').insert(dataToInsert);
    
    if (error) {
      alert("Error: " + error.message);
    } else { 
      alert("Berhasil simpan " + dataToInsert.length + " video!"); 
      setBulkData(''); 
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '850px', margin: 'auto', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', color: '#333' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
         <h1 style={{ fontSize: '1.5rem', color: '#007bff' }}>CDNVIDUY ADMIN PANEL</h1>
         <p style={{ fontSize: '0.8rem', color: '#888' }}>Versi Irit - Fokus Upload Konten</p>
      </div>

      {/* STATS ROW DISESUAIKAN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* CARD HISTATS */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: '4px solid #007bff' }}>
          <h3 style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>TRAFFIC MONITOR</h3>
          <div style={{ margin: '15px 0' }}>
            <a href="https://www.histats.com" target="_blank" rel="noreferrer" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 15px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
              📊 Cek Histats
            </a>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#999', margin: 0 }}>Pantau Realtime di Luar Vercel</p>
        </div>

        {/* INFO CARD */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: '4px solid #28a745' }}>
          <h3 style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>DB STATUS</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745', margin: '12px 0' }}>● CONNECTED</div>
          <p style={{ fontSize: '0.7rem', color: '#999', margin: 0 }}>Supabase Baru Aktif</p>
        </div>
      </div>

      {/* FORM INPUT BULK */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.1rem', marginBottom: '15px' }}>🚀 Tambah Banyak Video</h2>
        <textarea 
          rows="8" 
          placeholder="Judul Video | Link Videy atau Slicedrive" 
          value={bulkData} 
          onChange={(e) => setBulkData(e.target.value)}
          style={{ width:'100%', marginBottom:'15px', padding:'15px', borderRadius:'10px', border:'1px solid #ddd', fontSize: '0.9rem', boxSizing: 'border-box' }} 
        />
        <button 
          onClick={simpanBanyak} 
          disabled={loading} 
          style={{ padding:'15px', width: '100%', backgroundColor: '#007bff', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor: 'pointer', fontSize: '1rem' }}
        >
          {loading ? 'Sedang Memproses...' : 'PROSES & SIMPAN KE DATABASE'}
        </button>
      </div>

    </div>
  );
}
