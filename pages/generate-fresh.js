import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function GenerateFresh() {
  const [inputLinks, setInputLinks] = useState('');
  const [outputLinks, setOutputLinks] = useState('');

  // 🎯 FUNGSI GENERATE TOPENG ACAK SECARA BULK
  const handleProcessLinks = () => {
    if (!inputLinks.trim()) return;

    // Fungsi membuat string acak 5 karakter untuk topeng kamuflase gess
    const makeRandomString = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // Pecah inputan per baris gess
    const lines = inputLinks.split('\n');
    
    const processedLines = lines.map(line => {
      let trimmed = line.trim();
      if (!trimmed) return '';

      // Cari tahu apakah baris ini berupa link URL atau teks judul biasa
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        try {
          const urlObj = new URL(trimmed);
          let pathname = urlObj.pathname; // Misal: /bpC23SoN1 atau /bpC23SoN1.mp4

          // 1. Bersihkan ekor .mp4 jika ada gess
          let isMp4 = false;
          if (pathname.toLowerCase().endsWith('.mp4')) {
            pathname = pathname.slice(0, -4);
            isMp4 = true;
          }

          // 2. Buat topeng acak baru gess (Misal: -x7a2b)
          const topeng = `_fresh${makeRandomString()}`;

          // 3. Gabungkan kembali URL-nya gess
          urlObj.pathname = `${pathname}-${topeng}${isMp4 ? '.mp4' : ''}`;
          return urlObj.toString();
        } catch (e) {
          return trimmed; // Jika gagal parsing, kembalikan teks aslinya gess
        }
      }
      
      return trimmed; // Jika teks judul biasa, biarkan utuh gess
    });

    setOutputLinks(processedLines.filter(Boolean).join('\n'));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputLinks);
    alert('Link fresh sukses disalin gess! 🚀');
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '30px 15px' }}>
      <Head>
        <title>Bulk Fresh Link Generator (v1)</title>
      </Head>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: '#ff0055', textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', marginBottom: '5px' }}>
          Bulk Fresh Link Generator (v1)
        </h1>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', marginBottom: '30px' }}>
          Ubah massal link lama yang ditandai FB menjadi link fresh anti-blokir lewat sistem 1 Pintu Irit Request Cloudflare.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* KOLOM INPUT LINK LAMA */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#00ffff' }}>
              📥 Paste List Link Hasil Generate Bulk di Sini:
            </label>
            <textarea
              value={inputLinks}
              onChange={(e) => setInputLinks(e.target.value)}
              placeholder="Paste hasil list link dari menu bulk di sini gess (Bisa campur teks judul)..."
              style={{ width: '100%', height: '180px', backgroundColor: '#111', color: '#fff', border: '1px solid #333', borderRadius: '8px', padding: '12px', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* TOMBOL EKSEKUSI */}
          <button
            onClick={handleProcessLinks}
            style={{ width: '100%', padding: '15px', backgroundColor: '#ff0055', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,0,85,0.4)', transition: '0.3s' }}
          >
            🔄 GENERATE JADI LINK FRESH BARU
          </button>

          {/* KOLOM OUTPUT LINK BARU */}
          {outputLinks && (
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#28a745' }}>
                🚀 Hasil Link Fresh Siap Sebar:
              </label>
              <textarea
                value={outputLinks}
                readOnly
                style={{ width: '100%', height: '180px', backgroundColor: '#111', color: '#28a745', border: '1px solid #28a745', borderRadius: '8px', padding: '12px', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'monospace' }}
              />
              <button
                onClick={handleCopy}
                style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📋 SALIN SEMUA LINK
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link href="/bulk" style={{ color: '#666', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Kembali ke Bulk Share Link
          </Link>
        </div>
      </div>
    </div>
  );
}
